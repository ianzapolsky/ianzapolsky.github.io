
$(document).ready(function () {

  var getTime = function() {
    var currentTime = new Date();
    var second = currentTime.getSeconds();
    var minute = currentTime.getMinutes();
    var hour = currentTime.getHours() + minute / 60;
    return data = [
      {
        "unit": "seconds",
        "numeric": second
      }, {
        "unit": "minutes",
        "numeric": minute
      }, {
        "unit": "hours",
        "numeric": hour 
      }
    ];
  };

  var getMilli = function() {
    var currentTime = new Date();
    var millisecond = currentTime.getMilliseconds();
    return data = [
      {
        "unit": "milliseconds",
        "numeric": millisecond
      }
    ];
  };

  var renderMilli = function(data) {
    clockGroup.selectAll('.milliclockhand').remove();
    clockGroup.append('path')
        .attr('d', function () { return millisecondArc(data[0].numeric); })
        .attr('class', 'milliclockhand')
        .attr('transform', 'translate(' + 45 + ',' + 35 + ')')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
  };

  var renderTime = function(data) {
    clockGroup.selectAll('.clockhand')
        .data(data)
      .transition()
      .attr('d', function (d) {
        if (d.unit === 'seconds')
          return secondArc(d);
        else if (d.unit === 'minutes')
          return minuteArc(d);
        else
          return hourArc(d);
      });
  };

  // constants
  var width = 300;
  var height = 300;
  var offsetX = 150;
  var offsetY = 150;
  var pi = Math.PI;
  var clockRad = 120;
  var milliRad = 22;

  // time scales
  var scaleMillisecs = d3.scale.linear().domain([0, 999 + 999/1000]).range([0, 2 * pi]);
  var scaleSecs = d3.scale.linear().domain([0, 59 + 999/1000]).range([0, 2 * pi]);
  var scaleMins = d3.scale.linear().domain([0, 59 + 59/60]).range([0, 2 * pi]);
  var scaleHours = d3.scale.linear().domain([0, 11 + 59/60]).range([0, 2 * pi]);

  // tick scale and data
  var scaleTicks = d3.scale.linear().domain([0, 359]).range([0, 2 * pi]);
  var tickData = (function() { 
    var data = []
    for (var i = 0; i < 60/5; i++)
      data[i] = i * 5;
    return data;
  });

  // time arcs
  var millisecondArc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(milliRad - 5)
    .startAngle(function (d) { return scaleMillisecs(d); })
    .endAngle(function (d) { return scaleMillisecs(d); });
  var secondArc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(clockRad - 20)
    .startAngle(function (d) { return scaleSecs(d.numeric); })
    .endAngle(function (d) { return scaleSecs(d.numeric); });
  var minuteArc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(clockRad - 20)
    .startAngle(function (d) { return scaleMins(d.numeric); })
    .endAngle(function (d) { return scaleMins(d.numeric); });
  var hourArc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(clockRad - 50)
    .startAngle(function (d) { return scaleHours(d.numeric % 12); })
    .endAngle(function (d) { return scaleHours(d.numeric % 12); });

  // tick arc
  var tickArc = d3.svg.arc()
    .innerRadius(clockRad - 8)
    .outerRadius(clockRad - 4)
    .startAngle(function (d) { return scaleMins(d); })
    .endAngle(function (d) { return scaleMins(d); });

  // initialize svg 
  var svg = d3.select('.chart')
    .attr('width', width)
    .attr('height', height);
  
  var clockGroup = svg.append('g')
    .attr('transform', 'translate(' + offsetX + ',' + offsetY + ')');
 
  // paint clock
  clockGroup.append('circle')
    .attr('r', clockRad)
    .attr('fill', 'none')
    .attr('class', 'clock outercircle')
    .attr('stroke', 'black')
    .attr('stroke-width', 2);

  clockGroup.append('circle')
    .attr('r', 6)
    .attr('fill', 'black')
    .attr('class', 'clock innercircle');

  clockGroup.append('circle')
      .attr('class', 'clock millicircle')
      .attr('fill', 'none')
      .attr('r', milliRad)
      .attr('transform', 'translate(' + 45 + ',' + 35 + ')')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

  clockGroup.append('circle')
      .attr('class', 'clock innermillicircle')
      .attr('r', 4)
      .attr('fill', 'black')
      .attr('transform', 'translate(' + 45 + ',' + 35 + ')')

  // paint ticks
  clockGroup.selectAll('path')
      .data(tickData)
    .enter().append('path')
      .attr('d', function (d) { return tickArc(d); })
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

  // paint clockhands
  clockGroup.selectAll('.clockhand')
    .data(getTime())
      .enter().append('path')
    .attr('d', function (d) {
      if (d.unit === 'seconds')
        return secondArc(d);
      else if (d.unit === 'minutes')
        return minuteArc(d);
      else
        return hourArc(d);
    })
    .attr('class', 'clockhand')
    .attr('stroke', 'black')
    .attr('stroke-width', function (d) {
      if (d.unit === 'seconds')
        return 2;
      else if (d.unit === 'minutes')
        return 3;
      else
        return 4;
    })
    .attr('fill', 'none');

  setInterval(function () {
    renderTime(getTime());
  }, 1000);

  setInterval(function () {
    renderMilli(getMilli());
  }, 1);
  
});
 
