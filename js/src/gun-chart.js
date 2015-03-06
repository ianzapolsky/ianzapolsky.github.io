

var extractYears = function(data) {
  var years = [];
  var yearObjects = [];
  // zero out the array we use to count
  for (var i = 0; i < data[data.length - 1] - data[0] + 1; i++) {
    years[i] = 0;
  }
  // count all shootings for all years
  for (var i = 0; i < data.length; i++) {
    years[data[i] - data[0]] += 1;
  }
  // record number for each year
  for (var i = 0; i < years.length; i++) {
    var yearObj = {"year": i + data[0], "number": years[i]};
    yearObjects.push(yearObj);
  }
  return yearObjects;
};

$(document).ready(function() {

  // Chart
  var margin = {top: 20, right: 30, bottom: 30, left: 40};
  var width = 1000 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;

  var xScale = d3.time.scale()
      .range([0, width])
      .domain([1853, 2014]);

  var yScale = d3.scale.linear()
      .domain([0, 40])
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .tickFormat(d3.format('d'))
      .ticks(20);

  var yAxis = d3.svg.axis()
      .scale(yScale)
      .orient('left');

  var chart = d3.select('.chart.shootings')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top +')');

  chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height +')')
      .call(xAxis)

  chart.append('g')
      .attr('class', 'y axis')
      .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('School Schootings in the United States');

  // Grab data
  d3.text('http://ianzapolsky.com/js/src/data/gun-data.txt', function(rawData) {
    var data = [];
    var rows = d3.dsv(' ', 'text/plain').parseRows(rawData);
    rows.forEach(function(row) {
      data.push(parseInt(row[row.length - 1]));
    });
    var yearData = extractYears(data);

    var barWidth = width / yearData.length;

    var bar = chart.selectAll('g.bar')
        .data(yearData)
      .enter().append('g')
        .attr('transform', function(d, i) { 
          return 'translate(' + i * barWidth + ',0)'; });

    bar.append('rect')
        .attr('y', function(d) { return yScale(d.number); })
        .attr('height', function(d) { 
          return height - yScale(d.number); })
        .attr('width', barWidth - .5);

  });

});












