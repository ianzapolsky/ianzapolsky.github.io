---
layout: post
title: "Foulmouthed Alexa"
---

## y u bleep?

The Amazon Echo is a product that is so easy to make fun of in its darkest hours for being useless, broken, or both, and yet is so unarguably excellent in its best moments.
The other night a friend and I were hanging out and our conversation strayed to music – how influential a certain recording had been for us.
The song in question was “Lush Life,” by Billy Strayhorn, as performed by Ella Fitzgerald and Oscar Peterson on the 1957 album _Ella Fitzgerald Sings the Duke Ellington Song Book_.

I asked the Echo in the room, “Alexa, play Lush Life by Ella Fitzgerald and Oscar Peterson.”
It found the recording we were looking for (off Amazon Prime Music) and played it for us.
For a music nerd, the ability to seamlessly call up a specific record in the midst of a conversation, without having to pause to navigate iTunes or YouTube, makes the Echo worth the price of admission.

However, there’s something that the Echo won’t do: curse.
The device appears to have a system-level aversion to curse words, and even words that sound like curse words.
Of course, this motivated me to learn how to write some basic Echo “skills,” which are just AWS Lambda functions that you can trigger by speaking to your Echo.

Sure enough, Alexa will bleep out “fuck,” “shit,” and “bitch,” but also misspellings of these words and phonetic alternatives (e.g.“phuck.”)

## Enter the umlaut

The fact that the Echo bleeps words that _sound_ like bad words but are spelled differently threw me for a loop.
I was definitely expecting to be able to find good alternatives for my favorite curse words that could trick Alexa into saying them, but no dice.
This leads me to suspect that instead of simply scanning a list of blocked words and bleeping them out if they’re present in the body of text it’s about to say, Echo actually attempts to sound out the words first, comparing the result against a phonetic key for every banned word.
This would be pretty clever, so clever in fact that it makes me doubt the theory.
I don’t think Amazon cares that much if people get their Echos to swear at them.

But if the Echo _does_ do some type of phonetic comparison, it seems that there are disconnects between the way it says certain letters and the way it thinks those letters are pronounced.
Take the umlaut for example.
That’s the two dots above a vowel, most commonly U, that you see in German, Hungarian, and other Eastern European languages.
The German words fürer and über are two examples of words that use it.
It’s supposed to make a sort of “UE” sound, but the Echo pronounces it just like a normal “U.”
It also pronounces ï just like a normal “I.”

So, what happens when you ask Alexa to say “fück, shït, bïtch?”

<audio controls>
  <source src="/assets/bad_alexa.m4a" type="audio/mpeg">
</audio>

Human 1, machine 0.

