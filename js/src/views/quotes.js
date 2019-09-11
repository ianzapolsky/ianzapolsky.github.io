define([
  'underscore',
  'jquery',
  'backbone',
], function(_, $, Backbone) {

  var QuotesView = Backbone.View.extend({

    el: '.site-footer',

    quotes: [
      '<i>The amount of useful invention you do is directly proportional to the number of experiments you can run per week per month per year.</i><br><strong>Jeff Bezos</strong>',
      '<i>Premature optimization is the root of all evil.</i><br><strong>Donald Knuth</strong>',
      '<i>Pretend to be completely in control and people will assume that you are.</i><br><strong>Nolan Bushnell</strong>',
      '<i>You can please some of the people, some of the time.</i><br><strong>Steve Jobs</strong>',
      '<i>The best way to predict the future is to invent it.</i><br><strong>Alan Kay</strong>',
      '<i>The journey is the reward.</i><br><strong>Steve Jobs</strong>',
      "<i>It's not about money... it's the willingness to outwork and outlearn everyone.</i><br><strong>Mark Cuban</strong>",
      '<i>As technology becomes more generic and less expensive, the leverage point becomes more in the people...</i><br><strong>Mark Zuckerberg</strong>',
      '<i>If things are not failing, you are not innovating enough.</i><br><strong>Elon Musk</strong>',
      "<i>It's better to be a pirate than to join the navy.</i><br><strong>Steve Jobs</strong>",
      '<i>Violence is the last refuge of the incompetent.</i><br><strong>Salvor Hardin</strong>',
      '<i>There is no art without intention.</i><br><strong>Duke Ellington</strong>'
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
