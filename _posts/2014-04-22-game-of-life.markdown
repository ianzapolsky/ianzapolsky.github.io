---
layout: post
title: "game of life"
author: "ian zapolsky"
---

<link rel="stylesheet" href="/css/life.css" type="text/css">

<script src="/js/life.js" type="text/javascript"></script>
<script>$(document).ready(function () { life.init(25) });</script>

## The Game

This is a simple Javascript/jQuery implementation of [John Conway's famous Game 
of Life][gol] for the browser. 

The two-dimensional grid below represents an abstract universe where life can 
either thrive or perish. Each cell on the grid can be alive (black) or dead 
(white) at any given time. 

You can click on cells to manually alternate their state. Turn some black
to seed the grid with a starting population. Then click the "Start"
button to begin simulating the passing of time, measured in arbitrary "years,"
according to the rules of the game, which are as follows: 

- Any live cell with less than 2 live adjacent cells dies (under-population). 
- Any live cell with greater than 3 live adjacent cells dies (over-population).
- Any live cell with 2 or 3 live adjacent cells lives to see the another day.
- Any dead cell with exactly 3 live adjacent cells becomes alive.

You will see your initial population begin to struggle for life as the
forces of the game world act upon it, and eventually either stabalize or die
away completely.

<button id="start" class="btn btn-success btn-md">Start</button>
<button id="stop" class="btn btn-danger btn-md">Stop</button>
<div id="grid"></div>

## Lessons

Implementing this game was a great learning exercise in Javascript 
development. In the course of writing an initial solution, figuring out why it 
sucked, and then starting from scratch again, I drastically improved my 
understanding of the structure of good Javascript code, the inherent 
limitations of jQuery, and the speed of traversing the HTML Document Object
Model (hint: it's not fast). 


My first shot at building this game had one central flaw: I tightly coupled 
the display of the game with the state of the game. I stored the information 
that told me whether a given cell in my grid was dead or alive in the CSS of 
the cell itself. Furthermore, I did not cache any DOM objects, meaning that 
every time I wanted to check the state of a given cell I had to traverse to it 
accross the entire DOM and then inspect its class attribute.

This is an egregious error, but it's a mistake that is actually pretty easy to 
make for those just getting started with jQuery. "The $! What a novel tool," I 
thought to myself. At first use, the seemingly all-powerful jQuery selector
feels like a hash lookup to HTML elements on the page. But the syntactical and 
logical ease of use of the "$" in jQuery obscures what it actually is: a slow 
and painful traversal across the tree structure of the DOM.

Just check out this method I wrote to calculate the number of live cells 
adjacent to some given cell at coordinate (x, y):

{% highlight javascript %}
countAdjLive = function (x, y) {
  var live = 0;
  live += isAlive($('#x'+(x-1)+'y'+(y-1)));
  live += isAlive($('#x'+(x-1)+'y'+(y)));
  live += isAlive($('#x'+(x-1)+'y'+(y+1)));
  live += isAlive($('#x'+(x)+'y'+(y-1)));
  live += isAlive($('#x'+(x)+'y'+(y+1)));
  live += isAlive($('#x'+(x+1)+'y'+(y-1)));
  live += isAlive($('#x'+(x+1)+'y'+(y)));
  live += isAlive($('#x'+(x+1)+'y'+(y+1)));
  return live;
}; 
{% endhighlight %}

To quote the perpetually classy Ron Burgundy, "Sweet grandmother's spatula!" 
That's one inefficient method. Keep in mind that I was calling this for _every 
cell in the grid_, every time I simulated a unit of time in the game, meaning 
that if my grid was 40 cells x 40 cells I was calling this method 1600 times at 
each step. Furthermore, within each of these calls are 8 calls to the jQuery
selector. So that's 12800 DOM traversals for each simulated step in the game.
Needless to say, my original implementation was slow. 

So I fell into a bad trap during my first go round with this game. But that's 
OK! I often find that reading about the best practices out of a book or some
documentation just isn't enough to convince me of why some things should never 
be done. It makes for a more memorable lesson if you fall face first into the 
problems that the best practices are there to help you avoid. Only then do you 
truly understand the value of their existence.

I ended up completely overhauling my implementation of the game. Instead of 
storing the game state in the CSS classes of my individual cells, I rewrote the 
program to represent the game board state internally with a multidimensional 
array. This made things much faster. I also cached the grid element from the 
DOM so that I could cut down on traversal time slightly when I *did* have to 
use the jQuery selector. Finally, I tried my best to separate code that 
controlled the state of the game and the logic behinds its rules, and 
manipulation of the DOM 
itself.

The result is what you see on this page, the [code][code] for which is up on 
github. 

[gol]:http://en.wikipedia.org/wiki/Conway's_Game_of_Life
[code]:https://github.com/ianzapolsky/game-of-life-js


