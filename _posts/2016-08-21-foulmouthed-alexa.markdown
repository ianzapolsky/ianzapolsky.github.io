---
layout: post
title: "foulmouthed alexa"
author: "ian zapolsky"
---

## y u bleep?

The Amazon Echo is a product that is so easy to make fun of in its darkest hours, for being useless, broken, or both, and yet is so unarguably _dope_ in its best moments.
For example, the other night a friend and I were hanging out in my apartment and our conversation strayed to music – specifically how influential a specific recording had been on our own playing.
The song in question was “Lush Life,” by Billy Strayhorn, as performed by Ella Fitzgerald and Oscar Peterson on her legendary 1957 album _Ella Fitzgerald Sings the Duke Ellington Song Book_.

So I asked the Echo in the room, “Alexa, play Lush Life by Ella Fitzgerald and Oscar Peterson.”
She found the precise recording we were looking for (off Amazon Prime Music) and played it for us.
For a music nerd, the ability to seamlessly call up a specific record in conversation, without having to pause to navigate iTunes or YouTube, makes the Echo worth the price of admission.

However, there’s something that the Echo won’t do: curse.
The device appears to have a system-level aversion to curse words, and even words that sound like curse words.
Of course, this motivated me to learn how to write some basic Echo “skills,” which are just AWS Lambda functions that you can trigger by speaking to your Echo.

Sure enough, Alexa will bleep out “fuck,” “shit,” and “bitch,” but also misspellings of these words, and phonetic alternatives like “phuck.”

## Enter the umlaut

The fact that the Echo bleeps phonetic substitutes threw me for a loop.
I was definitely expecting to be able to find good alternatives for my favorite curse words that could trick Alexa into saying them, but no dice.
This leads me to suspect that instead of simply scanning a list of blocked words and bleeping them out if they’re present in the body of text it’s about to say, the Echo actually attempts to sound out the words first, comparing each one against a phonetic key for every banned word.
This would be pretty clever, so clever in fact that it actually makes me doubt the theory.
I don’t think Amazon cares that much if people get their Echos to swear at them.

But if the Echo _does_ do a phonetic comparison, it seems that there are disconnects between the way it says certain letters, and the way it thinks those letters are pronounced.
Take the umlaut for example.
That’s the two dots above a vowel, most commonly U, that you see in German, Hungarian, and other Eastern European languages.
It’s supposed to make a sort of “UE” sound. The German words fürer and über are two examples, but the Echo pronounces it just like a normal “U.”
It also pronounces ï just like a normal “I.”

So, what happens when you ask Alexa to say “fück, shït, bïtch?”

<audio controls>
  <source src="/assets/bad_alexa.m4a" type="audio/ogg">
</audio>

Lol. Human 1, machine 0.

