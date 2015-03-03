---
layout: post
title: "art every day"
author: "ian zapolsky"
---

## Use Case

I've got a note on my iPhone of about 100 artists that, up until a couple weeks
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
hard-coded list (copied from my iPhone), runs a Google image search on that 
artist's name, randomly selects one of the first five results that come up, and 
then tweets it out for all to see. For example:

<blockquote class="twitter-tweet" lang="en"><p>so profound (by Juan Gris) <a href="http://t.co/opqYCCclhy">http://t.co/opqYCCclhy</a></p>&mdash; art every day (@art_err_day) <a href="https://twitter.com/art_err_day/statuses/464011775285796866">May 7, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

What's more, if I'm feeling lonely, I can mention [@art\_err\_day][aed] at any
time in a tweet of my own, and it will tweet back at me within the minute with 
a piece of art generated in the same way as above.

## Infinite Loops and CRON

The code that runs behind [@art\_err\_day][aed] is pretty straightforward. It
is broken into two separate scripts, bot.py and responder.py, each of which is
run as a CRON job on a server in the cloud.

First, let's take a look at the meat of bot.py.

{% highlight python %}
# grab a random artist name from an array called "artists"
def random_artist():
  return artists[random.randint(0, (len(artists)-1))]

# grab a random message from an array called "messages"
def random_message():
  return messages[random.randint(0, (len(messages)-1))]

# grab one of the first 5 links returned by an image search on the name of
# the artist + "artwork"
def random_link(artist):
  service = build('customsearch', 'v1', developerKey=GOOGLE_DK)
  result = service.cse().list(
      q          = artist+' artwork',
      searchType = 'image',
      imgSize    = 'xlarge',
      cx         = GOOGLE_CX
  ).execute()
  return result['items'][random.randint(0,5)]['link']

# assemble the information into one tweet
def random_tweet():
  artist = random_artist()
  url    = random_link(artist)
  msg    = random_message()+' (by '+artist+') '+url
  return msg

if __name__ == '__main__':

  # initialize Twitter connection
  t = Twitter(auth=OAuth(OAUTH_TOKEN, OAUTH_SECRET,
                         CONSUMER_KEY, CONSUMER_SECRET))

  # build and send the tweet!
  msg = random_tweet()
  t.statuses.update(status=msg)
{% endhighlight %}

In addition to the code you see above, bot.py also contains an array of artists 
and an array of messages that give the tweets a more personalized feel.
However, this script is pretty one-dimensional. It can tweet out random art
but it can't respond to tweets in which it is mentioned, which was a 
functionality I knew I wanted.

My original solution was basically to run the code you see above in an infinite
loop, repeatedly checking to see if someone new had mentioned the bot and then
sleeping for 60 seconds at the end of each iteration to avoid going over 
the Twitter API request quota. 

But this seemed inelegant to me, and furthermore, if my server had a
service interruption, or for some reason the bot process was killed, then all
response functionality would be lost without me knowing about it.

So instead, I wrote another script, responder.py, which stores the ID of the 
last seen mention of the bot in a text file in the current directory, and can 
then be run as a CRON job every minute to constantly check if someone new has
requested art. 

The code for responder.py is almost the same as bot.py, but
with a few key additions to enable checking Twitter for recent mentions and
reading from and writing to the text file where the last seen ID is stored.

{% highlight python %}
# return all tweets mentioning @BOT_NAME that have been created since latest_id
def fetch_unseen_mentions(latest_id):
  return t.search.tweets(q='@'+BOT_NAME, result_type='recent', since_id=latest_id)['statuses']

# return the id of the latest tweet mentioning @BOT_NAME
def fetch_latest_id():
  return t.search.tweets(q='@'+BOT_NAME, result_type='recent', count=1)['statuses'][0]['id']

if __name__ == '__main__':

  # initialize Twitter connection
  t = Twitter(auth=OAuth(OAUTH_TOKEN, OAUTH_SECRET,
                         CONSUMER_KEY, CONSUMER_SECRET))

  # read in the latest id from the last check
  f = open('.latest_id', 'r')
  latest_id = f.read().rstrip()
  f.close()

  # check for unseen tweets since the latest id
  results = fetch_unseen_mentions(latest_id)

  # if we got any tweets, reply to them
  if results:
    for tweet in reversed(results):

      tweeter  = tweet['user']['screen_name']
      artist = random_artist()
      url    = random_link(artist)
      msg    = '@'+tweeter+' '+random_tweet()
      t.statuses.update(status=msg)

      latest_id = str(tweet['id'])

  # write the new latest_id to the file
  f = open('.latest_id', 'w')
  f.write(latest_id)
  f.close()
{% endhighlight %}

## Build Your Own

So there you have it. These two fairly simple Python scripts create an 
interactive Twitter program that users can play around with. Please follow 
[@art\_err\_day][aed] if you're on Twitter, and feel free to fork my
[code][code] and build out a bot that serves your own collection of artists.

[aed]:https://twitter.com/art_err_day
[code]:https://github.com/ianzapolsky/art_err_day
