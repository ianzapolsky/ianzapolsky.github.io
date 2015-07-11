---
layout: post
title: "visualizing Buffon's needles"
author: "ian zapolsky"
---

<script src="/js/src/painter.js" type="text/javascript"></script>

## Groundwork

Yesterday I started playing with the [HTML5 canvas][canvas] as part of
Google's devart (art made with code) competition. Having never used
the canvas before, I decided to start simple and build a sort of Jackson Pollock-esque
random line generator. 

Javascript interaction with the canvas is exposed via a drawing context (each
canvas has a unique context) which we can obtain like this, assuming we've 
defined a canvas element in our HTML markup with id "canvas":

{% highlight javascript %}
/* Grab the canvas context. */ 
c = document.getElementById("canvas");
ctx = c.getContext("2D");
{% endhighlight %}

This context is a built-in HTML5 object on which all the properties and methods
for drawing on the canvas are defined. What is interesting to note here is that 
although the explicit call to "2D" in the getContext invocation would seem to 
imply that there are perhaps other kinds of contexts to the canvas (3D? 4D?!!), 
there are not. According to [the canvas writeup on diveintoHTML5.info][dh5], 
while there are some unstandardized third party implementations of what a 3D 
canvas context might look like, the official HTML5 spec says that it does not 
exist yet.

Now that we have a context for our canvas, let's write a couple functions 
utilizing its built-in methods to draw random lines on the canvas.

{% highlight javascript %}
/**
 * sets the stroke style to some random width and color
 */
getRandomStroke = function () {
  var width, r, g, b;
  width = Math.floor((Math.random()*10)+1);
  r = Math.floor(Math.random()*256);
  g = Math.floor(Math.random()*256);
  b = Math.floor(Math.random()*256);

  ctx.beginPath();
  ctx.lineWidth = width.toString();
  ctx.strokeStyle ="rgb("+r.toString()+","+g.toString()+","+b.toString()+")";
};

/**
 * draw a line of specifiable length on the canvas. if no length is specified
 * draw a line of random length
 */
drawLine = function (length) {
  var
    x1, y1, x2, y2;

  x1 = getRandomX();
  y1 = getRandomY();

  if (typeof(length) === 'number') {
    var valid = false;
    while (valid === false) {
      var r = Math.random()*(2*Math.PI);
      x2 = x1 + (length*Math.cos(r));
      y2 = y1 + (length*Math.sin(r));
      // check that (x2, y2) is not outside the bounds of the canvas
      if ( (x2 > c.width || x2 < 0) || (y2 > c.height || y2 < 0) )
        valid = false;
      else
        valid = true;
    }
  }
  else {
    x2 = getRandomX();
    y2 = getRandomY();
  }
  getRandomStroke();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
};
{% endhighlight %}

Briefly, this code randomizes the color, width, length, and position of a
line, and then draws it on the canvas. Click the button below to see what 500
calls to drawLine() (with no lengths specified) produces on a blank canvas.

<button class="btn centered" onclick="painter.paint();">click me</button>
<br>
<canvas id="canvas" width="400" height="400"></canvas>

I think the effect is kind of beautiful. But ultimately, these are just random
lines. There's nothing really cool going on mathematically, and we have now
laid the groundwork to inject some logic into our drawing process. This is 
where things get interesting.

## Buffon's needles

It was about this point in my experimentation when a good friend (and Econ-Math
major at Columbia, as will become clear shortly) peeked over my shoulder at
what I was doing. He asked how all the lines were being generated, and I 
explained that I was randomly simulating their positions. Then, he told me 
about Buffon's needle problem.

[Buffon's needle problem][bfn] is one of the earliest and most famous geometric
probability problems in mathematics. It goes like this: given a plane with 
evenly spaced vertical lines, we randomly drop needles onto the plane with the
goal of finding the probability that a needle lands crossing a line. For 
simplicity, we assume that the length of the needles is equal to the distance 
between vertical lines. 

As it turns out, Buffon's experimentation led him to discover an early method
to estimate pi, which, when holding the length of the needle and distance
between vertical lines equal, comes out to two times the total number of 
needles dropped, divided by the number of needles that landed crossing one of 
the vertical lines.

This is a pretty easy problem to simulate. There are basically two things we
need to do: generate lines of a uniform length (see the drawLine() function
defined above), and determine if a line crosses some x coordinate. This is
straightforward: 

{% highlight javascript %}
/**
 * check if two X coordinates cross a single X coordinate
 */
checkCross = function (cross, x1, x2) {
  if (x1 <= cross && cross <= x2)
    return true;
  else if (x1 >= cross && cross >= x2)
    return true;
  else
    return false;
};
{% endhighlight %}

Given these methods we can write up a simulation and visualization of
this problem for the canvas we were working on earlier. Though not very
aesthetically pleasing, it actually gives pretty good estimates of pi! 
(Note that this is just running 500 trials, we would expect the number to come 
much closer to actual pi as we increase the number of trials.)

<button class="btn centered" onclick="painter.buffon('buffon1', false);">click me</button>
<p id="num-crosses">crosses:</p>
<p id="pi">pi estimate:</p>
<canvas id="buffon1" width="400" height="400"></canvas>

## Problems

Initially, our simulations were yielding numbers of crosses that were too high,
and thus estimates of pi that were too low. We couldn't figure out why this
would be for an hour or so, and decided to sleep on it. But as soon as my head
hit the pillow, I realized that the problem lay in the implementation of the
method getRandomX():

{% highlight javascript %}
getRandomX = function () {
  return Math.floor((Math.random()*(c.width+1)));
};
{% endhighlight %}

See the problem? We were flooring the result of our randomly generated x
coordinates, making it much more likely that they would cross a vertical line,
which are located at integer coordinates (multiples of 10 in this instance).
Boy, that was dumb. When we corrected that issue, our numbers started to look
a lot more normal.

## Bringing it back

By this time it was 5:00am and my buddy and I were tired, so we turned in for
the night. But I've since gotten to play around with the simulation we built
and it yields some cool looking devart. Check it out, and feel free to copy
the code and make your own additions or modifications.

<button class="btn centered" onclick="painter.buffon('buffon2', true);">click me</button>
<br>
<canvas id="buffon2" width="400" height="400"></canvas><br>

[canvas]:http://www.w3schools.com/tags/ref_canvas.asp
[bfn]:http://en.wikipedia.org/wiki/Buffon's_needle
[dh5]:http://diveintohtml5.info/canvas.html
