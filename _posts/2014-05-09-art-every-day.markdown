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
art, every day, from this list of artists.

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
However, this solution had drawbacks; if my server ever went down, or for some
reason the bot process was killed, then all functionality would be lost without
me knowing it.

So instead, I broke the posting and responding functionalities of the bot out 
into two separate scripts, `bot.py` and `responder.py`, both of which run as 
CRON jobs.

`bot.py` runs every tweleve hours, and simply tweets out a piece of art.
`responder.py` runs every minute, and stores the ID of the last seen tweet that
mentions the bot in a text file. Every time it wakes up, it pulls every tweet
that has been sent since the tweet stored in the text file, and responds, overwriting
the last seen tweet in the file with the most ID when it finishes.

## Build Your Own

So there you have it. These two simple Python scripts create an interactive 
Twitter bot that users can play around with.

Please follow [@art\_err\_day][aed] if you're on Twitter, and feel free to fork
my [code][code] and build out a bot that serves your own collection of artists,
or anything else you want!

[aed]:https://twitter.com/art_err_day
[code]:https://github.com/ianzapolsky/art_err_day
