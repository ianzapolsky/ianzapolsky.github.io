
$(document).ready(function() {

  var customConf = {
    "decks": 1,
    // TODO: enable 'font' option -- loading cards.ttf
    "renderMode": 'css',
    // For a coustom " of "-String
    "ofString": " of ",
    "startShuffled": true,
    "jokers": 0,
    "jokerText": "Joker",
    "ranks": {
        "2": "Two",
        "3": "Three",
        "4": "Four",
        "5": "Five",
        "6": "Six",
        "7": "Seven",
        "8": "Eight",
        "9": "Nine",
        "10": "Ten",
        "J": "Jack",
        "Q": "Queen",
        "K": "King",
        "A": "Ace"
    },
    "suits": {
        "S": "Spades",
        "D": "Diamonds",
        "C": "Clubs",
        "H": "Hearts"
    }
  };

  var cardDeck = playingCards(customConf);

  var hand = [];
  
  var dealer = [];

  var consecutiveCorrect = 0;

  var showHand = function(){
      var el = $('#yourHand')
      el.html('');
      for (var i = 0; i < hand.length; i++) {
          el.append(hand[i].getHTML());
      }
  }

  var showDealer = function(){
      var el = $('#dealerHand')
      el.html('');
      for (var i = 0; i < dealer.length; i++) {
          el.append(dealer[i].getHTML());
      }
  }

  var doShuffle = function(){
      cardDeck.shuffle();
  }

  var doDrawCard = function(){
      var c = cardDeck.draw();
      if(!c){
          showError('no more cards');
          return;
      }
      hand[hand.length] = c;
      showHand();
  }

  var doDrawDealer = function(){
      var c = cardDeck.draw();
      if(!c){
          showError('no more cards');
          return;
      }
      dealer[dealer.length] = c;
      showDealer();
  }

  var doReturnCardToDeck = function(){
      if(!hand.length){
          showError('your hand is empty');
          return;
      }
      var c = hand.pop();
      showHand();
      cardDeck.addCard(c);
  }
  
  var doReturnCardFromDealer = function(){
      if(!dealer.length){
          showError('your hand is empty');
          return;
      }
      var c = dealer.pop();
      showDealer();
      cardDeck.addCard(c);
  }

  var dealNewGame = function(){
    while (hand.length > 0) {
      doReturnCardToDeck();
    }
    while (dealer.length > 0) {
      doReturnCardFromDealer();
    }
    doShuffle();
    doDrawCard();
    doDrawCard();
    doDrawDealer();
  }

  var convertRankToValue = function(cardRank){
    switch (cardRank) {
      case '2':
        return 2;
        break;
      case '3':
        return 3;
        break;
      case '4':
        return 4;
        break;
      case '5':
        return 5;
        break;
      case '6':
        return 6;
        break;
      case '7':
        return 7;
        break;
      case '8':
        return 8;
        break;
      case '9':
        return 9;
        break;
      case '10':
        return 10;
        break;
      case 'J':
        return 10;
        break;
      case 'Q':
        return 10;
        break;
      case 'K':
        return 10;
        break;
      case 'A':
        return 1;
        break;
    }
  }

  var checkMove = function(move) {
    var dealerCard = convertRankToValue(dealer[0].rank);
    var playerFirstCard = convertRankToValue(hand[0].rank);
    var playerSecondCard = convertRankToValue(hand[1].rank);
    if (blackjackPlayer.getOptimalMove(playerFirstCard, playerSecondCard, dealerCard) === move) {
      $('#feedback').text('Good! You\'ve gotten ' + (++consecutiveCorrect) + ' in a row!');
      dealNewGame();
    } else {
      consecutiveCorrect = 0;
      $('#feedback').text('No! Wrong!');
    }
  }

  dealNewGame();
  
  $('#hit').click(function() {
    checkMove('hit');
  });
  $('#stand').click(function() {
    checkMove('stand');
  });
  $('#double').click(function() {
    checkMove('double');
  });
  $('#split').click(function() {
    checkMove('split');
  });
  
  $(window).keypress(function(event) {
    switch (event.which) {
      case 104:
        checkMove('hit');
        break;
      case 115:
        checkMove('stand');
        break;
      case 100:
        checkMove('double');
        break;
      case 112:
        checkMove('split');
        break;
    }
  });

});

