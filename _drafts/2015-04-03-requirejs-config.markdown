---
layout: post
title: "the most important RequireJS detail that nobody talks about"
author: "ian zapolsky"
---

## RequireJS config

I am currently in the process of building a medium-sized web application as a freelance project, and I've taken it as an opportunity to learn RequireJS, which seems to be becoming the default tool for loading asynchronous Javascript modules in the browser.

Things appeared to be going fairly smoothly, and I felt I had a handle on the various use cases for RequireJS. The most common and simple of these use cases is loading the scripts for a single page application. This just needs to happen once, and the same scripts are loaded every time.

However, my use case is inherently multi-page. While all pages in my app share a subset of scripts (a `common` module), each page has its own unique combination of scripts on top of that common layer, defined in a `require` block at the top of each page's template.

I configured my setup according to the documentation I found online, and it worked, <strong>98% of the time</strong>. The other 2% of the time, the network requests for three of the vendor libraries whose paths I define in the `require.config` block in my `main.js` file (the `data-main` file loaded initially by RequireJS) errored out with 404’s. The paths these libraries were being requested at were totally wrong.

## So what's happening?

The cause of this problem lies in Javascript’s asynchronicity. These erroneous network requests were being sent only when the additional, page-specific scripts (those on top of the `common` layer) managed to load <strong>before</strong> the `main.js` script. Basically, I had written my import system under the assumption that `main.js` would always be loaded first, which obviously is not true, because while the browser will generally try to load the scripts in the order that they appear on the page, this is not guaranteed behavior.

Several ways to fix this problem are documented [here](https://github.com/amdjs/amdjs-api/wiki/AMD), but I opted for the simplest, which is to explicitly define the configuration options previously stored in `main.js`'s `require.conf` block in their own script tag just before the initial import of `main.js`. Now, I am guaranteed that any script subsequently loaded on the page will be loaded with my configured version of the `require` call.

{% highlight html %}
<!-- Define RequireJS settings -->
<script>
  var require = {
    shim: {
      'common': {'deps': ['jquery']}
    },
    paths: {
      'common': 'dist/lib/common',
      'backbone': 'dist/lib/backbone',
      'jquery': 'dist/lib/jquery',
      'underscore': 'dist/lib/underscore',
    }
  };
</script>

<!-- Load main RequireJS module -->
<script data-main="path/to/main.js" src="path/to/require.js"></script>
{% endhighlight %}

This problem seemed worthy of a post, simply because it took me a while to figure it out by myself on the Internet, and it is only tangentially mentioned in the RequireJS docs. However, I imagine this problem is actually somewhat pervasive, and its effects can be <strong>highly</strong> annoying. Hopefully I’ve saved somebody out there some time.

