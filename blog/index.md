---
layout: default 
title: Blog
---

<div class="home">

  <h1 style="font-size:42px;font-weight:300;">Blog</h1>

  <ul class="posts">
    {% for post in site.posts %}
      <li><span class="post-date">{{ post.date | date: "%b %-d, %Y" }}</span> <a class="post-link" href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>

</div>
