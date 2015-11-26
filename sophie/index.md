---
layout: page
title: Dogs for Sophie
---

<link rel="stylesheet" href="/css/main.css" type="text/css">
<link rel="stylesheet" href="/css/stock.css" type="text/css">

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="https://www.google.com/jsapi"></script>
<script type="text/javascript">

  google.load('search', '1');

  var imageSearch;

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

  var page = 0;

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

    img.src = result.url;
  }

  function searchComplete() {

    console.log(imageSearch.cursor.pages);
    //imageSearch.gotoPage(2);

    imageSearch.results.forEach(function (result) {
      buildImage(result);
    });
  }

  function onLoad() {
    imageSearch = new google.search.ImageSearch();
    imageSearch.setResultSetSize(8);
    imageSearch.setSearchCompleteCallback(this, searchComplete, null);
    var searchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    console.log(searchTerm);
    imageSearch.execute(searchTerm);
  }

  google.setOnLoadCallback(onLoad);

  $(document).ready(function() {
    $('#more').click(function() {
      if (page === 8) {
        alert('there are no more puppies :(');
      } else {
        imageSearch.gotoPage(++page);
      }
    });
  });

</script>

<div id="image-container">
</div>

<div style="margin:20px auto;width:50px;">
  <button class="btn" id="more">More</button>
</div>

