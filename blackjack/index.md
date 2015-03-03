---
layout: page 
title: Learn the Blackjack Book
---

<link rel="stylesheet" href="JavaScript-Playing-Cards/playingCards.ui.css">
<link rel="stylesheet" href="blackjack-book.css">

<script src="JavaScript-Playing-Cards/playingCards.js"></script>
<script src="JavaScript-Playing-Cards/playingCards.ui.js"></script>
<script src="blackjack-book.js"></script>
<script src="blackjack-game.js"></script>

<h3>Instructions</h3>
<ul>
  <li>This tool will help you memorize the mathematically optimal way of playing blackjack (found <a href="http://www.blackjackinfo.com/bjbse.php">here</a>), determined via extensive computer simulation.
  </li>
  <li>Click the appropriate button below for each blackjack situation, or use the 'h' (hit), 's' (stand), 'd' (double), and 'p' (split) keys to indicate your choice.
  </li>
</ul>
<h3>Acknowledgements</h5>
This tool was built in part with <a href="https://github.com/atomantic/JavaScript-Playing-Cards">automantic's javascript playing card library</a>.

<h2 class="center-align">Dealer Card</h2>
<div id="dealerHand"></div>

<h2 class="center-align">Your Hand</h2>
<div id="yourHand"></div>
  
<div id="options">
  <button id="hit" class="btn btn-default btn-md">hit</button>
  <button id="stand" class="btn btn-default btn-md">stand</button>
  <button id="double" class="btn btn-default btn-md">double</button>
  <button id="split" class="btn btn-default btn-md">split</button>
</div>
<br>
<h2 id="feedback"></h2>
