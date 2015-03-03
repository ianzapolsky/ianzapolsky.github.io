/**
 * change an html5 canvas called "canvas" with javascript
 */

var painter = function () {
  
  var 
    // variables
    c,   
    ctx,

    // functions
    init, getRandomX, getRandomY, getRandomStroke, drawLine, checkCross,
    buffon, paint;

  /**
   * initialize the canvas object
   */
  init = function () {
    c   = document.getElementById("canvas");
    ctx = c.getContext("2d");
  };

  /**
   * return random X and Y coordinates from 0 to the width/height of the
   * canvas
   */
  getRandomX = function () {
    return Math.floor((Math.random()*(c.width+1)));
  };
  
  getRandomY = function () {
    return Math.floor((Math.random()*(c.height+1)));
  };

  /**
   * sets the stroke style to some random width and color
   */
  getRandomStroke = function () {
    ctx.beginPath();
    var width, r, g, b;
    width = Math.floor((Math.random()*10)+1);
    r = Math.floor(Math.random()*256);
    g = Math.floor(Math.random()*256);
    b = Math.floor(Math.random()*256);
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

 /**
  * paint on the canvas
  */ 
  paint = function () {
 
    init();
    ctx.clearRect(0, 0, c.width, c.height);
    for (var i = 0; i < 500; i++) {
      drawLine();
    }

  };

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

  /**
   * paint on the canvas
   */
  buffon = function (canvas_name, color) {

    c   = document.getElementById(canvas_name);
    ctx = c.getContext("2d");
   
    ctx.beginPath();
 
    ctx.width="1";
    ctx.strokeSyle="black";

    ctx.clearRect(0,0,c.width,c.height);

    var 
      crosses = 0,
      trials = 500;

    // build and draw array of vertical lines
    var arr = new Array(41);
    for (var i = 0; i < 41; i++) {
      arr[i] = (i*10);
      ctx.moveTo(arr[i], 0);
      ctx.lineTo(arr[i], c.height);
      ctx.stroke();
    }

    for (var i = 0; i < trials; i++) {

      var 
        x1 = Math.random()*(c.width+1),
        y1 = Math.random()*(c.height+1),
        valid = false;

      while (valid === false) {
        var r = Math.random()*(2*Math.PI);
        if (color === true) {
          var x2 = x1 + (30*Math.cos(r));
          var y2 = y1 + (30*Math.sin(r));
        } else {
          var x2 = x1 + (10*Math.cos(r));
          var y2 = y1 + (10*Math.sin(r));
        }
        if (x2 > c.width || x2 < 0)
          valid = false;
        else if (y2 > c.height || y2 < 0)
          valid = false;
        else
          valid = true;
      }

      for (var j = 0; j < 41; j++) {
        if (checkCross(arr[j], x1, x2)) {
          crosses += 1;
          break;
        }
      }
      if (color === true)
        getRandomStroke();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    var num_crosses = document.getElementById("num-crosses");
    var pi = document.getElementById("pi");
    guess = (2*trials)/(crosses);
    num_crosses.innerHTML = "crosses: "+crosses;
    pi.innerHTML = "pi estimate: "+guess
  };

  return { paint : paint, buffon : buffon };

}();



        




