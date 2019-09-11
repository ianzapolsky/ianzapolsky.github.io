---
layout: post
title: "Hot and Cold"
---

While watching the Utah Jazz lose to the Golden State Warriors in the first round of the 2017 NBA playoffs, I made a hypothesis that Joe Johnson was one of the 3-point shooters most capable of "getting hot" in the league.
By "getting hot," I mean that once shots start to fall for Johnson, he gets more confident in himself and begins to perform better.
My hypothesis was based purely on anecdotal evidence; to confirm or refute my claim I had to try to get a measure of the way localized past performance _within a single game_ impacts future performance in that game for different players.
I decided to isolate my analysis to 3-point shooting.

I downloaded play-by-play data for the 2016-17 NBA season, and then set about calculating the following statistics for all players across all games:

  - **Total 3-point percentage**: all 3-point makes / all 3-point attempts (this stat is already tracked, so it served as a nice litmus test for the accuracy of my play-by-play data)
  - **"Hot" 3-point percentage**: percentage of 3-point shots made that were attempted within two minutes of game time after the player's most recently made 3-point shot
  - **"Cold" 3-point percentage**: percentage of 3-point shots made that were attempted _more_ than two minutes of game time after the player's most recently made 3-point shot
  - **Hot/Cold Differential**: how much better or worse a player’s "hot" 3-point percentage is compared to his "cold" 3-point percentage ("hot" 3P% minus "cold" 3P%)

A quick note about the definition of "game time" as it is used above: in my play-by-play dataset, I get the quarter number and game clock reading with each game event.
I converted these data points to a continuous range of seconds, from 0 ("Q1 12:00") to 2880 ("Q4 00:00"), the formula for which is:

``` golang
(60 * (12 * (period_number - 1 ))) +
((12 * 60) - ((60 * game_clock_minutes) + game_clock_seconds))
```

For example: "Q1 11:45" converts to 15, because 15 seconds of game time have elapsed at this point.
"Q4 00:05" converts to 2875 because all but 5 seconds of game time have elapsed.
I do not make any sort of effort to account for timeouts, pauses after fouls, or even halftime.
Shots attempted during overtime are also not included in this analysis.

Below is a graph of the players who attempted >= 250 3-point shots and >= 40 "hot" 3-point shots in the 2016-17 season.
On the X-axis we have the total number of "hot" 3-point shots attempted, and on the Y-axis we have hot/cold differential.
A positive hot/cold differential means that that player’s "hot" 3-point shooting percentage is better than his "cold" 3-point shooting percentage.

<div class="svgholder">
  <svg id="g1"></svg>
</div>

The biggest question created by this graph is: what is C.J. McCollum doing, or what are Kyle Korver and Channing Frye _not_ doing, that sets them so drastically apart in this distribution?
Both are attempting the same number of "hot" 3-point shots, but McCollum, ludicrously, was 15.46% more likely to make his "hot" 3-point shots than his "cold" ones.
**McCollum shot 55.77% from 3 when he was hot!**
Meanwhile, Korver and Frye were both more than 20% _less_ likely to hit their "hot" shots.
Is this because Korver and Frye are traditionally used as spot up shooters on their team, while McCollum is able to generate his own shots off the dribble when he gets hot?

Or is this just an aberration due to small sample size? We can see clearly in the graph above that as the number of "hot" 3-point shots attempted by a player increases, the hot/cold 3-point differential appears to shrink.
However, there is likely selection bias underlying this trend, as the most consistent 3-point shooters in the world (i.e. the ones with the smallest hot/cold differentials) are the ones who have the green light to attempt as many 3-point shots as they can.

Looking at the dataset as a whole, it is definitely more rare to be a good "hot" 3-point shooter.
Of the 108 NBA players who attempted >= 250 3s in the 2016-17 season, only 38 had positive hot/cold differentials, with the remaining 70 players being worse at shooting "hot" 3s than "cold" ones.
This follows the intuition that defense would tighten up around a player that had just made a 3-point shot, because defenders would be more cognizant of the shooter as a threat during the next offensive possession.

Unsurprisingly, the elite shooters who attempted >= 500 3-point shots in the season (there are only 11 players in this set) have less variance between their "hot" and "cold" 3-point shot performance.
There are also more "hot" shooters than expected in this set compared to the >= 250 set.
Only two players from this set cracked +5% in their hot/cold differentials: Russell Westbrook (+5.95%) and Ryan Anderson (+7.46%).
One player sticks out in this group for being especially atrocious at shooting "hot" 3s: Bradley Beal (-13.88%).
However, Beal has the best "cold" 3-point shooting percentage of the group, nearly a full percentage point better than Stephen Curry, the next best.
Beal also took the least "hot" 3s of this group, so perhaps he knows it’s a weakness of his.

Finally, Joe Johnson did indeed "get hot" in 2016-17 – his hot/cold differential was +6.8%.
However, Johnson did not make it into the graph as he only attempted 19 "hot" 3s in the entire season (out of 258 3-point shots attempted).

## Going bigger

Fascinated by these results, and in a state of disbelief over the McCollum result, I decided to expand my analysis to encompass a wider range of data.
I reached back to the start of the modern era in the NBA (the 1998-99 season, [according to Wikipedia][me]) and built a new spreadsheet with every game that had taken place from then up to the end of the 2016-17 season, averaging player performance over the number of seasons they appeared in.

The first person I looked for in this dataset was Ray Allen.
His -0.75% hot/cold differential on an average of 48.06 "hot" 3-point shot attempts per season tell a story of an elite spot up shooter who rarely ran the point but instead was targeted frequently by his teammates and knew how to elude defenses even when they knew what was coming.
"Hot" shots only make up 11.37% of all of Allen’s 3-point attempts.

Stephen Curry, by contrast, frequently brings the ball up the court and initiates his team’s offense, and always has the green light to attempt a 3.
This helps explain why, despite the fact that Curry has attempted two-thirds as many 3-point shots as Ray Allen (an incredible feat in and of itself, given that Curry has only played 8 full seasons compared to Allen’s 19), Curry has already eclipsed the number of "hot" 3s Allen attempted in his whole career.
"Hot" shots make up 18.43% of all of Curry’s 3-point attempts.
In the graph below, you can see just how much of an outlier Curry is in terms of the raw number of "hot" 3-point shots he attempts.

<div class="svgholder">
  <svg id="g2"></svg>
</div>

I think that more than anything, my analysis here simply points to the increasing number of 3-point shots overall that are attempted each season in the NBA.
It is telling that Ray Allen, long considered the best 3-point shooter in NBA history, is not even close to a leader in terms of "hot" 3s attempted.
**This, to me, signals that players like Curry, Klay Thompson, Damian Lillard, and J.R. Smith are an entirely new type of NBA basketball player that has only emerged in the last 10-15 years.**

However, if we had to choose one player who is most threatening when "hot," this graph would suggest that Klay Thompson is an outlier in this regard.
While Danny Green, Kevin Love, and Rodney Hood also appear strong, Thompson stands on his own.
Nobody even comes close to his +3.02% hot/cold differential given the number of "hot" 3-point shots he attempts per season.

And, in case you were wondering, Joe Johnson has a positive lifetime hot/cold differential at +1.02% overall.

If you’d like to look at the data or the code I used to write this post, check out this [github repository][ghr].

[me]:https://en.wikipedia.org/wiki/National_Basketball_Association#Modern_era
[ghr]:https://github.com/ianzapolsky/nbastats


<style>
.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.svgholder {
  text-align: center;
}

.dot {
  stroke: #000;
}

.tooltip {
  position: absolute;
  padding-left: 2px;
  font-size: 12px;
  width: 200px;
  height: 28px;
  pointer-events: none;
}
</style>
<script src="http://d3js.org/d3.v3.min.js"></script>
<script>

var x = function() {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 500 - margin.left - margin.right,
      //height = 500 - margin.top - margin.bottom;
      height = 500 - margin.top - margin.bottom;
  
  /* 
   * value accessor - returns the value to encode for a given data object.
   * scale - maps value to a visual display encoding, such as a pixel position.
   * map function - maps from data value to display value
   * axis - sets up axis
   */ 
  
  // setup x 
  var xValue = function(d) { return d["Hot 3P Att"]; }, // data -> value
      xScale = d3.scale.linear().range([0, width]), // value -> display
      xMap = function(d) { return xScale(xValue(d));}, // data -> display
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  
  // setup y
  var yValue = function(d) { return d["Hot/Cold Diff"];}, // data -> value
      yScale = d3.scale.linear().range([height, 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("left");
  
  // setup fill color
  var cValue = function(d) { return d.Name;},
      color = d3.scale.category10();
  
  // add the graph canvas to the body of the webpage
  var svg = d3.select("#g1")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
  // load data
  d3.csv("/assets/2016-17.csv", function(error, data) {
  //d3.csv("reports/avg.csv", function(error, data) {
  
    // change string (from CSV) into number format
    data.forEach(function(d) {
      d["Hot 3P Att"] = +d["Hot 3P Att"];
      d["Hot/Cold Diff"] = +d["Hot/Cold Diff"];
      d["Hot 3P%"] = +d["Hot 3P%"];
  //    console.log(d);
    });
  
    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    //xScale.domain([50, d3.max(data, xValue)+1]);
    //yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
    yScale.domain([-25, 25]);
    //yScale.domain([-10, 10]);
  
    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("# Hot 3P Att");
  
    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Hot/Cold 3P% Differential");
  
    svg.append("line")
      .style("stroke", "black")
      .attr("x1", 0)
      .attr("y1", (height/2))
      .attr("x2", width)
      .attr("y2", (height/2));

    svg.append("text")
      .attr("x", (width/2))
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .text("Hot/Cold Differential in 2016-17");
  
    // draw dots
    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
      // .filter(function(d) { return d["Hot 3P Att"] >= 250 && d["Hot 3P Att"] >= 40; })
      //.filter(function(d) { return d["Hot 3P Att"] >= 500; })
      .filter(function(d) { return d["Hot 3P Att"] >= 40 && d["Total 3P Att"] > 250; })
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return color(cValue(d));}) 
        .on("mouseover", function(d) {
            tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
            tooltip.html(d["Name"] + "<br/> (" + xValue(d)
            + ", " + yValue(d).toFixed(2) + "%)")
                 .style("left", (d3.event.pageX + 5) + "px")
                 .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });
  });
};

var y = function() {
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 500 - margin.left - margin.right,
      //height = 500 - margin.top - margin.bottom;
      height = 500 - margin.top - margin.bottom;
  
  /* 
   * value accessor - returns the value to encode for a given data object.
   * scale - maps value to a visual display encoding, such as a pixel position.
   * map function - maps from data value to display value
   * axis - sets up axis
   */ 
  
  // setup x 
  var xValue = function(d) { return d["Hot 3P Att"]; }, // data -> value
      xScale = d3.scale.linear().range([0, width]), // value -> display
      xMap = function(d) { return xScale(xValue(d));}, // data -> display
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  
  // setup y
  var yValue = function(d) { return d["Hot/Cold Diff"];}, // data -> value
      yScale = d3.scale.linear().range([height, 0]), // value -> display
      yMap = function(d) { return yScale(yValue(d));}, // data -> display
      yAxis = d3.svg.axis().scale(yScale).orient("left");
  
  // setup fill color
  var cValue = function(d) { return d.Name;},
      color = d3.scale.category10();
  
  // add the graph canvas to the body of the webpage
  var svg = d3.select("#g2")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  // add the tooltip area to the webpage
  var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  
  // load data
  //d3.csv("reports/2016-17.csv", function(error, data) {
  d3.csv("/assets/avg.csv", function(error, data) {
  
    // change string (from CSV) into number format
    data.forEach(function(d) {
      d["Hot 3P Att"] = +d["Hot 3P Att"];
      d["Hot/Cold Diff"] = +d["Hot/Cold Diff"];
      d["Hot 3P%"] = +d["Hot 3P%"];
  //    console.log(d);
    });
  
    // don't want dots overlapping axis, so add in buffer to data domain
    xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    //xScale.domain([50, d3.max(data, xValue)+1]);
    //yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);
    //yScale.domain([-25, 25]);
    yScale.domain([-10, 10]);
  
    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Avg # Hot 3P Att per Season");
  
    // y-axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Hot/Cold 3P% Differential");
  
    svg.append("line")
      .style("stroke", "black")
      .attr("x1", 0)
      .attr("y1", (height/2))
      .attr("x2", width)
      .attr("y2", (height/2));

    svg.append("text")
      .attr("x", (width/2))
      .attr("y", 0)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .text("Avg Hot/Cold Differential for all games 1998-2017");
  
    // draw dots
    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
      // .filter(function(d) { return d["Hot 3P Att"] >= 250 && d["Hot 3P Att"] >= 40; })
      //.filter(function(d) { return d["Hot 3P Att"] >= 500; })
      .filter(function(d) { return d["Hot 3P Att"] >= 30 && d["Total 3P Att"] > 250; })
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) { return color(cValue(d));}) 
        .on("mouseover", function(d) {
            tooltip.transition()
                 .duration(200)
                 .style("opacity", .9);
            tooltip.html(d["Name"] + "<br/> (" + xValue(d).toFixed(2)
            + ", " + yValue(d).toFixed(2) + "%)")
                 .style("left", (d3.event.pageX + 5) + "px")
                 .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                 .duration(500)
                 .style("opacity", 0);
        });
  });
};

x();
y();

</script>
