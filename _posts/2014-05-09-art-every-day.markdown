---
layout: post
title: "art every day"
author: "ian zapolsky"
---

## Use Case

I've got a note on my phone of about 100 artists that, up until a couple weeks
ago, I had no idea what to do with. Every time I'm in an art museum I 
compulsively write down the names of artists who made the paintings I like. 
Sometimes I look up the names later when I'm bored, but this wasn't happening 
as much as I would have liked it to. 

What I really wanted was a service that could non-obtrusively deliver me some 
art, every day, from a set of artists that I designate.

So, I built a Twitter bot.

## Art Every Day

[@art\_err\_day][aed] is a Twitter account that I made to serve as my own
personal curated art feed. Every 12 hours it randomly selects an artist from a 
hard-coded list (copied from my phone), runs a Google image search on that 
artist's name, randomly selects one of the first five results that come up, and 
then tweets it out for all to see.

For example:

<blockquote class="twitter-tweet" lang="en"><p>so profound (by Juan Gris) <a href="http://t.co/opqYCCclhy">http://t.co/opqYCCclhy</a></p>&mdash; art every day (@art_err_day) <a href="https://twitter.com/art_err_day/statuses/464011775285796866">May 7, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

What's more, if I'm feeling lonely, I can mention [@art\_err\_day][aed] at any
time in a tweet of my own, and it will tweet back at me within the minute with 
a piece of art generated in the same way as above.

## Infinite Loops and CRON

My original implementation of this bot was a Python program that ran on an
infinite loop, repeatedly checking to see if someone new had mentioned the bot 
and then sleeping for 60 seconds at the end of each iteration to avoid going
over the Twitter API request quota. Every 720 loops (the number of minutes in
12 hours), the program would tweet out a piece of art. 
However, this solution seemed inelegant to me, and furthermore, if my server 
had a service interruption, or for some reason the bot process was killed, then
all functionality would be lost without me knowing about it.

So instead, I broke the posting and responding functionalities of the bot out 
into two separate scripts, `bot.py` and `responder.py`, both of which I run as 
CRON jobs. 

I run `bot.py` once every 12 hours (`0 */12 * * *` for those who speak CRON), 
and it simply picks a random artist from an artists array, a random
message from a messages array, and builds a tweet with that information.
However, the script is one-dimensional. It can tweet out random art but it 
can't respond to tweets in which it is mentioned, which was a functionality I 
knew I wanted.

So instead, I wrote a second script, `responder.py`, which stores the ID of the 
last seen mention on Twitter of the bot in a text file in the current 
directory. I run `responder.py` once every minute using CRON (`* * * * *`) and 
it repeatedly calls up a list of the most recent tweets that mention the bot, 
checks them against the ID of the last seen tweet stored in the text file, and 
responds to any new ones, updating the last seen tweet ID when it finishes.

## Build Your Own

So there you have it. These two simple Python scripts create an interactive 
Twitter program that users can play around with.

Please follow [@art\_err\_day][aed] if you're on Twitter, and feel free to fork
my [code][code] and build out a bot that serves your own collection of artists.

[aed]:https://twitter.com/art_err_day
[code]:https://github.com/ianzapolsky/art_err_day
