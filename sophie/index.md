---
layout: page
title: Dogs for Sophie
---

<link rel="stylesheet" href="/css/main.css" type="text/css">
<link rel="stylesheet" href="/css/stock.css" type="text/css">

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script type="text/javascript">

  var nextQuery = null;

  var loadImages = function(searchTerm, next=false) {
    if (next) {
      if (nextQuery) {
        $.get('https://www.googleapis.com/customsearch/v1?q='+searchTerm+'&start='+nextQuery.startIndex+'cx=012813865030616110872:i1ij5jt2494&imgColorType=color&searchType=image&key=AIzaSyDYsBFujVbyB4SyE3_8atE9tP28ITCvmR0', function(result) {
          nextQuery = result.queries.nextPage ? result.queries.nextPage : null;
          result.items.forEach(function(item) {
            buildImage(item);
          });
        });
      } else {
        alert('there are no more puppies :(');
      }
    }
    // first query
    else {
      $.get('https://www.googleapis.com/customsearch/v1?q='+searchTerm+'&cx=012813865030616110872:i1ij5jt2494&imgColorType=color&searchType=image&key=AIzaSyDYsBFujVbyB4SyE3_8atE9tP28ITCvmR0', function(result) {
        nextQuery = result.queries.nextPage ? result.queries.nextPage : null;
        result.items.forEach(function(item) {
          buildImage(item);
        });
      });
    }
  };

  var searchTerms = [
    'cute puppies',
    'cute puppies wearing boots',
    'dogs with boots',
    'small puppies',
    'small dogs',
    'puppies with boots',
    'dogs wearing clothes',
    'puppies wearing clothes',
    'dogs with clothes',
    'puppies with clothes',
    'dogs wearing costumes',
    'puppies wearing costumes',
    'adorable puppies',
    'small white dogs',
    'small white puppies'
  ];

  function buildImage(result) {

    var img = document.createElement('img');
    var div = document.createElement('div');

    div.style.clear = 'both';
    div.style.margin = '20px auto';
    div.style.maxWidth = '100%';
    div.setAttribute('class', 'centered');

    img.style.width = result.width + 'px';
    img.style.maxWidth = '100%';
    img.style.margin = '0 auto';
    img.style.display = 'block';

    var container = document.getElementById('image-container');

    img.onload = function() {
      div.appendChild(img);
      container.appendChild(div);
    };

    img.src = result.link;
  }

  function searchComplete() {

    imageSearch.results.forEach(function (result) {
      buildImage(result);
    });
  }

  $(document).ready(function() {
    var searchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    console.log(searchTerm);
    loadImages(searchTerm);

    $('#more').click(function() {
      loadImages(searchTerm, true);
    });
  });

</script>

<div id="image-container">
</div>

<div style="margin:20px auto;width:50px;">
  <button class="btn" id="more">More</button>
</div>

