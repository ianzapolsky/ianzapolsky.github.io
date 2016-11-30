---
layout: post
title: "default danger"
author: "ian zapolsky"
---

<style>
#ian-image {
  max-width: 100%;
  float: left;
  margin-right: 50px;
  margin-bottom: 50px;
}
</style>

This is wrong:

{% highlight golang %}
func main() {
    channel := make(chan []byte, 100)
    wg := &sync.WaitGroup{}

    wg.Add(1)
    go func() {
        for {
            select {
            case msg, ok := <-channel:
                if ok {
                    fmt.Println(msg)
                } else {
                    for msg := range channel {
                        fmt.Println(msg)
                    }
                    return
                }
            default:
                /* no-op */
            }
        }
    }()

    go func() {
        for {
            channel <- []byte("Hello world")
            time.Sleep(3 * time.Second)
        }
    }()

    wg.Wait()
}
{% endhighlight %}

Can you spot the bug?
Here's a hint:

<img id="ian-image" src="/assets/perf_screenshot.png"></img>

## the dreaded default case

When you provide a deafult case to a select in Golang, you're giving the program a route to take when the other cases are blocked.

What we _want_ to happen here is for our program to block on the receive from `channel`.
While we're blocked, we don't need to do anything, but we want to immediately print something as soon as we receive it from the channel.

Unfortunately, by providing a default case, which does nothing, we basically turn this blocking select statement into a spin lock, pinning the CPU while attempting a receive from the channel over and over and over again.
Bad news.

Here's a rewritten version that does what we want:

{% highlight golang %}
func main() {
    channel := make(chan []byte, 100)
    wg := &sync.WaitGroup{}

    wg.Add(1)
    go func() {
        for {
            msg, ok := <-channel
            if ok {
                fmt.Println(msg)
            } else {
                for msg := range channel {
                    fmt.Println(msg)
                }
                return
            }
        }
    }()

    go func() {
        for {
            channel <- []byte("Hello world")
            time.Sleep(3 * time.Second)
        }
    }()

    wg.Wait()
}
{% endhighlight %}
