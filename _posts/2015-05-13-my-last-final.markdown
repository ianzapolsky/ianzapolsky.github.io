---
layout: post
title: "my last final"
author: "ian zapolsky"
---

In the hours leading up to the last final exam of my college career, I was hacking, not cramming.
The final was for Operating Systems, a notoriously difficult class, and would surely contain tricky questions about things like the different use cases for binary semaphores and mutexes, and multi-level paging tables.
This stuff genuinely interested me, and I had spent the previous two days doing all the assigned reading and typing up a masterful study guide.
Of course, I used vim to do this, and wrote my study guide in Markdown, because it was fast, and I knew I could make it look good later if need be.

But as the test drew near, I became anxious to actually start studying my study guide.
That's when I realized that I didn't have any good way of quickly converting raw Markdown files into clean, readable documents from the command line.
I've used [Mou][mou] before, which is nice, but its parser lacks some of my favorite features of Github Flavored Markdown, like fenced code blocks.
Then there's the option of simply pushing my Markdown files up to Github and reading them from there, but that's pretty ineglegant.

With two hours to go before my test, I got obsessed with the idea that there should be an easy way to write notes in Markdown and view them as compiled HTML instantly, without having to manually convert them from the command line using a tool like [pandoc][pandoc]. 

So, I created [marknotes][marknotes], my custom solution for everyday note taking, built for people who spend a lot of time at the terminal.
Basically, it's a barebones Node/Express.js app exposed to the user via three very simple executable shell scripts.

- `nn`, short for "new note," creates a new Markdown file in the marknotes directory and opens it for editing.
- `nb`, short for "notebook," starts a Node app that serves the HTML versions of your Markdown notes, and then opens the app in your default browser.
- `vn`, short for "view notes," opens the marknotes directory in which all of your Markdown notes are stored in vim, so you can easily edit or delete existing notes.

Once you add these three commands to your `PATH`, you can use them at any time from the terminal, greatly reducing the time it takes to jot down a simple idea, add an item to a todo list, or read one of your existing notes.
After you've added a couple notes, type `nb` to bring up the app and view them in your browser!

I hope someone gets some use out of this.
But, like all good side projects, I designed marknotes for myself.
So far, it has made the process of taking and mainting notes way more efficient for me. 

[mou]:http://25.io/mou/
[marknotes]:https://github.com/ianzapolsky/marknotes
[pandoc]:http://pandoc.org/

