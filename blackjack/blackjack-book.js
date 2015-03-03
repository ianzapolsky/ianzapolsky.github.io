// Property of Ian Zapolsky, 10/22/2014
// Javascript for a blackjack probability training tool.

var blackjackPlayer = {

  getOptimalMove: function(playerFirstCard, playerSecondCard, dealerCard) {
  
    var playerTotal = playerFirstCard + playerSecondCard; 
    
    // Check for pair.
    if (playerFirstCard === playerSecondCard) {
      return this.checkPair(playerFirstCard, dealerCard);
    }

    // Check for soft pair.
    if (playerFirstCard === 1) {
      return this.checkSoftHand(playerSecondCard, dealerCard);
    }
    if (playerSecondCard === 1) {
      return this.checkSoftHand(playerFirstCard, dealerCard);
    }

    // Check for hand point total.
    return this.checkHandTotal(playerTotal, dealerCard);
    
  },

  checkHandTotal: function(playerTotal, dealerCard) {
  
    // Check cases where result is not dependent on dealer card.
    // This happens when the player's total is 5 - 8 and 17.
    if (playerTotal >= 5 && playerTotal <= 8) {
      return 'hit';
    }
    if (playerTotal >= 17) {
      return 'stand';
    }

    // Check cases where result is dependent on dealer card.
    switch (playerTotal) {
      
      case 9:
        if (dealerCard >= 3 && dealerCard <= 6) {
          return 'double';
        } else {
          return 'hit';
        }
        break;

      case 10:
        if (dealerCard === 10 || dealerCard === 1) {
          return 'hit';
        } else {
          return 'double';
        }
        break;

      case 11:
        if (dealerCard === 1) {
          return 'hit';
        } else {
          return 'double';
        }
        break;

      case 12:
        if (dealerCard >= 4 && dealerCard <= 6) {
          return 'stand';
        } else {
          return 'hit';
        }
        break;

      case 13:
        if (dealerCard >= 2 && dealerCard <= 6) {
          return 'stand';
        } else {
          return 'hit';
        }
        break;

      case 14:
        if (dealerCard >= 2 && dealerCard <= 6) {
          return 'stand';
        } else {
          return 'hit';
        }
        break;

      case 15:
        if (dealerCard >= 2 && dealerCard <= 6) {
          return 'stand';
        } else {
          return 'hit';
        }
        break;

      case 16:
        if (dealerCard >= 2 && dealerCard <= 6) {
          return 'stand';
        } else {
          return 'hit';
        }
        break;
    }
  },

  checkSoftHand: function(playerCard, dealerCard) {
    
    // Check cases where result is not dependent on dealer card.
    // This happens when the player's card is 8, 9, or 10.
    if (playerCard === 8 || playerCard === 9 || playerCard === 10) {
      return 'stand';
    }

    // Check cases where result is dependent on dealer card.
    switch (playerCard) {
  
      case 2:
        if (dealerCard === 5 || dealerCard === 6) {
          return 'double';
        } else {
          return 'hit';
        }
        break;

      case 3:
        if (dealerCard === 5 || dealerCard === 6) {
          return 'double';
        } else {
          return 'hit';
        }
        break;

      case 4:
        if (dealerCard === 4 || dealerCard === 5 || dealerCard === 6) {
          return 'double';
        } else {
          return 'hit';
        }
        break;

      case 5:
        if (dealerCard === 4 || dealerCard === 5 || dealerCard === 6) {
          return 'double';
        } else {
          return 'hit';
        }
        break;

      case 6:
        if (dealerCard >= 3 && dealerCard <= 6) {
          return 'double';
        } else {
          return 'hit';
        }
        break;

      case 7:
        if (dealerCard >= 3 && dealerCard <= 6) {
          return 'double';
        } else if (dealerCard === 2 || dealerCard === 7 || dealerCard === 8) {
          return 'stand';
        } else {
          return 'hit';
        }
        break;
    }
  },

  checkPair: function(pairCard, dealerCard) {

    // Check cases where result is not dependent on dealer card.
    // This happens when we have a pair of 8s, Aces (split), or 10s (stand).
    if (pairCard === 8 || pairCard === 1) {
      return 'split';
    }
    if (pairCard === 10) {
      return 'stand';
    }

    // Check cases where result is dependent on dealer card.
    switch (dealerCard) {

      case 1:
        if (pairCard === 9) {
          return 'stand'; 
        } else {
          return 'hit';
        }
        break;

      case 2:
        if (pairCard === 4) {
          return 'hit';
        } else if (pairCard === 5) {
          return 'double';
        } else {
          return 'split';
        }
        break;

      case 3:
        if (pairCard === 4) {
          return 'hit';
        } else if (pairCard === 5) {
          return 'double';
        } else {
          return 'split';
        }
        break;

      case 4:
        if (pairCard === 4) {
          return 'hit';
        } else if (pairCard === 5) {
          return 'double';
        } else {
          return 'split';
        }
        break;

      case 5:
        if (pairCard === 5) {
          return 'double';
        } else {
          return 'split';
        }
        break;

      case 6:
        if (pairCard === 5) {
          return 'double';
        } else {
          return 'split';
        }
        break;

      case 7:
        if (pairCard === 4 || pairCard === 6) {
          return 'hit';
        } else if (pairCard === 5) {
          return 'double';
        } else if (pairCard === 9) {
          return 'stand';
        } else {
          return 'split';
        }
        break;

      case 8:
        if (pairCard === 5) {
          return 'double';
        } else if (pairCard < 8) {
          return 'hit';
        } else {
          return 'split';
        }
        break;

      case 9:
        if (pairCard === 5) {
          return 'double';
        } else if (pairCard < 8) {
          return 'hit';
        } else {
          return 'split';
        }
        break;

      case 10:
        if (pairCard === 9) {
          return 'stand'; 
        } else {
          return 'hit';
        }
        break;
    }
  }

};

