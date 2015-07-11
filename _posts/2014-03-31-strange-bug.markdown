---
layout: post
title: "a strange bug"
author: "ian zapolsky"
---

## The setup

Recently I spent some time setting up my Unix environment on the cluster of 
Linux machines hosted by the Columbia University Computer Science Department. 
CS students here at Columbia can gain access to these machines for $50 per 
semester, which is relatively cheap compared to renting a similarly-sized box 
from AWS (this would run you about $160 per semester under Amazon's [newly 
released pricing scheme][awsprice]). 

Many, but not all, CS classes require the use of these accounts, so I can 
understand why they cost extra. On the other hand, you'd think that Columbia 
might be able to come up with this $50 surcharge somewhere in the $55,000 
annual tuition its students pay (pardon the ramblings of a disgruntled 
student).

My first step in setting up my Unix environment, as it has become by default 
ever since I read this [article by Zach Holman][dotfiles], was to copy my 
customized dotfiles (`.bashrc`, `.vimrc`, etc.) from my local machine to the remote 
machine so that I could quickly and easily achieve continuity between my 
setups. To do this I used [scp][scp], or secure copy, which is a program that 
uses the ssh protocol to copy files between hosts on a network. 

My scp command looked like this, using the "-r" option to recursively copy the 
entire directory called ".dotfiles":

```
scp -r ~/.dotfiles iaz2105@clic.cs.columbia.edu:~/.
```

Upon executing this command, I got this response in my terminal window:
    
```
setting up databases config...
done 
```

Hmm...

## Digging

When I ssh'ed into my account on the Columbia Linux cluster, I found that the 
`.dotfiles` directory had definitely not been copied across the network from my 
local machine. I was puzzled, and my confusion was compounded by the message I 
was recieving about setting up some database configuration. What the hell was 
that?!

Then I opened the `.bashrc` on my remote machine and, lo and behold, I found the
following two lines, leftovers from some old project I had worked on for class
more than a year ago:

```
echo 'setting up databases config...'
...
echo 'done'
```

This is one of those bugs you hope isn't true. You *really* hope that the 
success of a network file transfer program does not depend on whether you have 
a print statement in the `.bashrc` file of your destination computer. 

But, indeed, [it does][bug].

## WAT?

But why is this true? It turns out that scp expects to recieve protocol data 
via the stdout channel, and when we have echo statements in our `.bashrc`, we 
inject new stuff into this channel when `.bashrc` is automatically run on 
connection with the ssh client, thus completely screwing up the data transfer. 
Seems like a massive oversight in the design of scp right?

Well, there are a couple very easy workarounds for this problem that actually 
give us a bit of insight into the different ways Unix shells can be used, 
namely interactively and non-interactively. If we wrap all the echo statements
in our `.bashrc` in an if statement as shown below, they will only be executed 
when our ssh session is interactive, or when there is a human on the other end 
of the line (instead of, say, an instance of the scp program).

```
if [ "$SSH_TTY" ]
then
  echo 'xyz'
fi
```

Now, when scp uses ssh to remotely connect to your machine, the `.bashrc` file
will check for the existence of the environment variable `SSH_TTY`, which is 
set to the name of the tty pseudo-terminal that has been allocated to 
handle interactive input from the keyboard for the shell session. Shell 
sessions initiated by scp will not have this environment variable, so we're 
safe from any echo statements ruining our day.

## Non-intuitive

This is one of the weirder quirks I've come accross in the usually extremely
stable and straightforward suite of linux tools I use. I guess it just
goes to show that [computers are magic][magic] and not to be understood by 
anyone.

[scp]:http://www.linuxmanpages.com/man1/ssh.1.php
[ssh]:http://www.linuxmanpages.com/man1/scp.1.php
[awsprice]:http://aws.amazon.com/ec2/pricing/effective-april-2014/
[dotfiles]:http://zachholman.com/2010/08/dotfiles-are-meant-to-be-forked/
[bug]:https://bugzilla.redhat.com/show_bug.cgi?id=20527
[magic]:http://james.hamsterrepublic.com/technomancy/

