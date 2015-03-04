define([
  'underscore',
  'jquery',
  'backbone',
], function(_, $, Backbone) {

  var QuotesView = Backbone.View.extend({

    el: '.site-footer',

    quotes: [
      'I think the amount of useful invention that you have is directly proportional to the number of experiments you can do per week per month per year. - <strong>Jeff Bezos</strong>',   
      'Premature optimization is the root of all evil. - <strong>Donald Knuth</strong>',
      'Pretend to be completely in control and people will assume that you are. - <strong>Nolan Bushnell</strong>',
      'You can please some of the people, some of the time. - <strong>Steve Jobs</strong>',
      'The best way to predict the future is to invent it. - <strong>Alan Kay</strong>',
      'The journey is the reward. - <strong>Steve Jobs</strong>',
      "It's not about money... it's the willingness to outwork and outlearn everyone. - <strong>Mark Cuban</strong>",
      "Skate where the puck's going, not where it's been. - <strong>Wayne Gretsky</strong>",
      "Western notation blocks total absorption in the 'action' playing. - <strong>Cecil Taylor</strong>",
      'As technology becomes more generic and less expensive, the leverage point becomes more in the people... - <strong>Mark Zuckerberg</strong>', 
      'If things are not failing, you are not innovating enough. - <strong>Elon Musk</strong>',
      "It's better to be a pirate than to join the navy. - <strong>Steve Jobs</strong>"
    ],
  
    seen: [],

    initialize: function () {
      var _this = this;
      this.changeQuote();
      setInterval(function() {
        _this.changeQuote();
      }, 10000);
    },

    renderQuote: function (quote) {
      var quoteParagraph = $('#quote');
      quoteParagraph.fadeOut(1000, function() {
        quoteParagraph.html(quote);
        quoteParagraph.fadeIn();
      });
    },

    changeQuote: function () {
      if (this.quotes.length === 0) {
        this.quotes = this.seen;
        this.seen = [];
      }
      var index = Math.floor(Math.random() * this.quotes.length);
      var quote = this.quotes.splice(index, 1)[0];
      this.seen.push(quote);
      this.renderQuote(quote);
    }

  });

  return QuotesView;

});

    

    
