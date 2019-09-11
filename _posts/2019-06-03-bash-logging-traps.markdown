---
layout: post
title: "Bash Logging Traps"
---

At AppNexus, we use Bash to do some important things, and whenever you have a system that does important things, it's critical to get logging right so that you can find out what happened when something goes wrong.

The strategy we use to log from Bash is outlined in [this blog post](https://urbanautomaton.com/blog/2014/09/09/redirecting-bash-script-output-to-syslog/). To summarize, we redirect `STDOUT` and `STDERR` in our Bash scripts to write into [`logger`](http://man7.org/linux/man-pages/man1/logger.1.html), with various options enabled. `logger` then sends our messages to syslog (as well as the terminal), and with some syslog configuration we make sure that the messages are routed into a centralized file.

The code to achieve this looks like this:

```
#!/bin/bash

exec 1> >(/usr/bin/logger -s -t "$(basename $0)")

echo "Hi, I'm using syslog!"
```

output:

```
test.sh: Hi, I'm using syslog!
```

This is all well and good, and we've written many Bash scripts that use this approach to great success. However, there is an edge case to consider when doing this that we encountered recently and that I want to point out because it 1) can result in serious bugs, and 2) provides an opportunity to learn more about how Bash handles redirection and signals!

## Cleanup traps

It is a common pattern in our Bash scripts to trigger some cleanup work if the script exits for some reason (be it because an error was encountered, the script was forcibly killed, or we simply got to the end). To implement this, we use [`trap`](http://man7.org/linux/man-pages/man1/trap.1p.html) to set up a signal handler for whichever signals we consider important to intercept.

In this example, we set up a handler for the `INT` signal, so that if we are killed during execution, we execute the `cleanup` function:

```
#!/bin/bash

exec 1> >(/usr/bin/logger -s -t "$(basename $0)")

cleanup() {
    # Do something really important
    echo "Done with cleanup!"
    exit 1
}

trap cleanup INT

echo "Hi, I'm using syslog!"

while true; do
    # Wait indefinitely by running sleep in the background. Reason to run in 
    # the background is because when Bash is executing an external command in
    # the foreground, it does not handle any signals received until the
    # foreground process terminates.
    # See http://mywiki.wooledge.org/SignalTrap#When_is_the_signal_handled.3F
    # for more details.
    sleep 10 &
    wait $!
done
```

When we run the script, we should see:

```
$ ./test.sh
test.sh: Hi, I'm using syslog!
```

Now, in another shell, let's find our process using `ps`:

```
$ ps afx
...
28242 pts/18   Ss     0:00  \_ -bash
31316 pts/18   S+     0:00      \_ /bin/bash ./test.sh
31317 pts/18   S+     0:00          \_ /bin/bash ./test.sh
31321 pts/18   S+     0:00          |   \_ /usr/bin/logger -s -t test.sh
31369 pts/18   S+     0:00          \_ sleep 10
```

There are a couple of PIDs here, and it's worth going into detail about what each one of them are. First, process `28242` is the Bash shell from which we ran `test.sh` (our program). `31316` is `test.sh` itself. Process `31369` is the `sleep` command that we run in the background that allows us to wait indefinitely for a `SIGINT`. `31321` is the instance of the `logger` program that is actually sending our log messages to syslog. Finally, `31317` is a child process of `31316` that is created by the `exec` command to handle redirection of `STDOUT` of the `test.sh` parent process (`31316`) to `STDIN` of the logger process (`31321`).

Now, let's send a `SIGINT` to `31316` and see what happens:

```
$ kill -s INT 31316
--- In shell where test.sh was run ---
test.sh: Hi, I'm using syslog!
test.sh: Done with cleanup
```

Good! Our signal handler worked and we were able to perform the cleanup work we wanted to. 

Now, let's run this program again, but instead of using the `kill` command from another shell to stop it, let's just hit Ctrl+C in our terminal. When we do this, we see the following:

```
$ ./test.sh
test.sh: Hi, I'm using syslog!
^C
```

It would seem that this time `cleanup` didn't get executed. Is this correct? Not quite. Actually, `cleanup` did run, but the logger process responsible for writing messages to the terminal was dead by the time our `echo` in `cleanup` was executed. This is an important point: **if you call `kill` on the parent PID, only that process will see the signal. However, if you hit Ctrl+C, *all* processes in the process group will see the signal.** This means that when you kill this program with Ctrl+C, you are not only killing PID `31316` (the parent) but also all the children, including the `sleep`, `logger`, and the intermediary child process.

Because the logger process is the program that actually writes messages to `STDOUT` in our case, it follows that if it is dead, any messages we try to send to `STDOUT` will never make it there. That's why, when we kill our process with Ctrl+C, we don't see the messages written from cleanup in our `terminal`.

To verify this theory, let's make the following small change to `cleanup` to make it to write to `STDERR` instead of `STDOUT`, so that we avoid piping output through `logger`:

```
cleanup() {
    # Do something really important
    echo "Done with cleanup!" >&2
    exit 1
}
```

Now, let's run our program again and kill with Ctrl+C:

```
$ ./test.sh
batches_test: Hi, I'm using syslog!
^CDone with cleanup!
```

Good! This proves that `cleanup` is in fact running. We see the message on the terminal now because we are writing to `STDERR` instead of `STDOUT`, and we haven't set up a kill-able program to handle redirection to `STDERR`.

## Closed pipes

So far the effects of this behavior we have outlined seem fairly innocuous. Our signal handler `cleanup` still gets fired, so presumably it's still able to do the important things it needs to do, albeit without logging. It's annoying, and would certainly impede dubugging efforts, but at least we're running our important `cleanup` routine.

Well, aside from the argument that losing logs in a function that does important things constitutes a serious failure in its own right, consider the following rewritten `cleanup`:

```
cleanup() {
    # This sleep is critical to illustrate a race condition
    sleep 1

    echo "Entering cleanup"

    # Do something really important

    echo "Done with cleanup!" >&2
    exit 1
}
```

What would we expect to see when we run this, and kill with Ctrl+C? Make special note of the fact that the first echo writes to `STDOUT`, and the second echo writes to `STDERR`.

Here's what we see when we run `test.sh` with this `cleanup` function:

```
$ ./test.sh
test.sh: Hi, I'm using syslog!
^C
```

Uh oh! Why wouldn't we have seen the message we sent to `STDERR`? Does it mean `cleanup` is not executing all the way to the end, or is something else going on? Let's run our script with Bash debugging enabled, so we can see every statement that gets executed:

```
$ bash -x test.sh
+ exec
+ trap cleanup INT
+ echo 'Hi, I'\''m using syslog!'
+ true
+ wait 54008
+ sleep 10
+++ basename test.sh
++ /usr/bin/logger -s -t test.sh
test.sh: Hi, I'm using syslog!
^C++ cleanup
++ sleep 1
++ echo 'About to cleanup!'
$ echo $?
141
```

This trace makes it clear that `cleanup` is exiting early, specifically right after we try to send a message to `STDOUT`. When we print the return code of the script, we see that it exits with code `141`, which in most Linux systems means `SIGPIPE`. What's happening is when the first echo statement in `cleanup` tries to write to `STDOUT`, it encounters a closed pipe (because the redirection and `logger` processes have been killed). This triggers a `SIGPIPE` which, if left unhandled, will cause the script to terminate immediately.

This could be **really serious** if you have a script that performs important work in its cleanup handler. It would also be difficult to track down because the script would not exhibit this bad behavior when killed with the `kill` command. In our case, this bug led to a stale lock file being left around on disk, preventing future instances of the Bash script from running. This ultimately resulted in a delay in one of our data jobs that was caught both by an alert on the age of our lock file, and an alert further down the pipeline.

## Safety first

So, let's talk about solutions. There are a couple interesting ways to get around this particular behavior, each of which have their own tradeoffs.

The first option is to set up a global no-op signal handler on SIGPIPE.

```
trap '' PIPE
```

This is not my preferred solution, as it has implications on how your script behaves with other Unix programs that a user might pipe together on the command line that are impossible for said user to know about without reading the source code of the script. However, for Bash scripts that are always run as their own standalone programs, say via a CRON job, this can be the simplest choice.

The second and third options are similar. Instead of using `echo` to log from your script, we can define a function to handle logging, and then use some tricks to make the function resilient to `SIGPIPE`.

```
log_safe1() {
   (echo $1)
}

log_safe2() {
    /usr/bin/logger -s -t "$(basename $0)" $1
}
```

`log_safe1` executes `echo` in a subshell, so that if a `SIGPIPE` is encountered, only the subshell spawned to run `echo` dies while the parent continues on. To be clear, `log_safe1` must be used in conjunction with an `exec` statement that redirects `STDOUT` to write to `logger`.

`log_safe2` executes logger directly, so no redirection is needed. Instead, each time your script needs to log something, a new instance of `logger` is created to write that message to `STDOUT`. These options both have the same drawback: they are significantly less performant than using `echo` with redirection because they incur the cost of spinning up a new process for each logged message.

As mentioned above, if you go with `log_safe2`, you don't need to redirect `STDOUT` anymore. However, it's important to keep in mind that if you don't redirect `STDOUT`, you leave yourself vulnerable to missing log data in other ways. For example, if your script calls another script, and *that* script sends output to `STDOUT` by some means other than by calling `log_safe2`, that output will not make it into syslog.

The fourth and final option changes the redirection itself. Instead of sending `STDOUT` of our script directly to `logger`, we can send it instead to an instance of `tee`, run with the `-i` flag to ignore interrupt signals. This looks like: 

```
exec 1> >(tee -i >(/usr/bin/logger -s -t "$(basename $0)") > /dev/null)
```

When we do this, `tee` handles any encountered `SIGPIPE` signals for us, essentially protecting our script from dying if the logger process dies. This option also adds performance overhead to logging.

So there you have it. Bash is often bemoaned for its lack of tooling, sensical type system, introspection, and other language features we now consider to be standard. However, sometimes it's the right tool for the job, especially if you're using it as a wrapper to call into other Unix programs like sed, awk, grep, xargs, and grep. Hopefully this post will help others avoid the same pitfall we encountered!
