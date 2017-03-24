'use strict';
//DEFINE YOUR VARIABLES UP HERE
var chart, vis;
var height = 500;
var width = 900;
var margin = {top: 20, right: 50, bottom: 30, left: 30};
var previous=0;
//Gets called when the page is loaded.
function init(){
  chart = d3_v4.select('#vis').append('svg')
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(30,30)")
          .call(d3_v4.zoom().on("zoom", function () {
              chart.attr("transform", d3_v4.event.transform)
          }))

  vis = chart.append("g");
  update_worldMap();
// themeriver("../data/data.csv");
  //console.log(store);
}
var datearray = [];
var colorrange = [];


function themeriver(data) {

colorrange = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#ff7f00","#6600cc","#66ff99"];
//["#B30000", "#78C679", "#FC8D59", "#FDBB84", "#CC4C02", "#FEF0D9","#980043", "#DD1C77", "#DF65B0", "#02F4C7","#238443","#EFFFFF"];
var strokerange = ["FFFFFF"]
var strokecolor = strokerange[0];

var format = d3.time.format("%m/%d/%Y");

var margin = {top: 20, right: 40, bottom: 30, left: 30};
var width = document.body.clientWidth - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var z = d3.scale.ordinal()
    .range(colorrange);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.years);

var yAxis = d3.svg.axis()
    .scale(y);

var stack = d3.layout.stack()
    .offset("zero")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.numEvents; });
//console.log(stack);
var nest = d3.nest().key(function(d) {  return d.key; })

var area = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

var svg = d3.select(".themeriver").append("svg")
    .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  data.forEach(function(d) {
    var mdate = "01/01/"+d.date
    d.date = format.parse(mdate);
    if(isNaN(d.numEvents)){
      d.numEvents=+0;
    }
    else{
    d.numEvents = +d.numEvents;
  }
  });
 // console.log(data); 
  var layers = stack(nest.entries(data));
//  console.log(layers);
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

  svg.selectAll(".layer")
      .data(layers)
    .enter().append("path")
      .attr("class", "layer")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d, i) { return z(i); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ", 0)")
      .call(yAxis.orient("right"));


}


function update_worldMap(){
d3_v4.queue()
  .defer(d3_v4.json, "../data/world-countries.topojson")
  .await(ready);
//function ready(error,data,capitals) {
function ready(error,data) {
  //console.log(data);

  var countries = topojson.feature(data, data.objects.countries1).features
  //console.log(countries)

  var projection = d3_v4.geoMercator()
                     .translate([width/2,height/2])
                     .scale(150)

  var path = d3_v4.geoPath()
  .projection(projection)

  chart.selectAll(".country")
     .data(countries)
     .enter().append("path")
     .attr("class", "country")
     .attr("d",path);/*
     .on('mouseover', function(d){
       d3_v4.select(this).classed("selected", true)

     })
     .on('mouseout', function(d){
       d3_v4.select(this).classed("selected", false)
     })*/
       $.ajax({
           url: 'getAllDatayr',
           type:"GET",
           dataType: "json",
           data: {
             startyr:$('#startyr').val(),
             endyr:$('#endyr').val()
           },
           success: function(capitals) {
               loadDataIntoDetailsView(capitals);
               chart.selectAll(".city-circle").data(capitals)
               .enter().append("circle")
               .attr("r",2)
               .attr("cx",function(d){
                   var coords = projection([d.longitude, d.latitude])
                   //console.log(coords)
                   return coords[0];
               })
               .attr("cy",function(d){
                   var coords = projection([d.longitude, d.latitude])
                   //console.log(coords)
                   return coords[1];
                 }).on('mouseover', function(d){
                                  d3_v4.select(this).classed("selected", true)
                                  //call the highlighter here
                                  console.log(d.eventid);
                                  if(previous!=0){
                                    //d3.select("tr[chosen='true']").attr('chosen', false);
                                    d3.select("#e"+previous).attr('bgcolor', 'white');
                                  }
                                  previous=d.eventid;
                                  d3.select("#e"+d.eventid).attr('bgcolor', 'yellow');
                                  //d3.select("#e"+d.eventid).attr('chosen', true);
                                  //lets scroll to the highlighted row
                                  //'.scroll-table' is the class name used inside the d3-tablesort
                                  console.log($('#e'+d.eventid).position().top-$('.scroll-table').position().top);
                                  $('.scroll-table').scrollTop(0);
                                  $('.scroll-table').scrollTop($('#e'+d.eventid).position().top-$('.scroll-table').position().top);
                                 //highlight the things in parallel-coordinates
                                 //query the data from the server and highlight
                                 //countryParcoords.clear("highlight");
                                 highlightParrallelCoordinate(d.country_txt, d.gname)
                                 //parcoords.highlight([[0,-0,0,0,0,1]]);
                                })
                                .on('mouseout', function(d){
                                  d3_v4.select(this).classed("selected", false)
               })
           },
           error: function(jqXHR, textStatus, errorThrown) {
               console.log('error ' + textStatus + " " + errorThrown);
           }
       });
       async function highlightParrallelCoordinate(countryName, orgName){
       for(var i=0;i<countryData.length;i++){
         if(countryData[i].country_txt==countryName){
           console.log(countryData[i]);
           countryParcoords.highlight([countryData[i]]);
           break;
         }
       }
       for(var i=0;i<orgData.length;i++){
         if(orgData[i].gname==orgName){
           console.log(orgData[i]);
           orgParcoords.highlight([orgData[i]]);
           break;
         }
       }
     }
/*
     console.log(capitals)
     chart.selectAll(".city-circle").data(capitals)
     .enter().append("circle")
     .attr("r",2)
     .attr("cx",function(d){
         var coords = projection([d.long, d.lat])
         console.log(coords)
         return coords[0];
     })
     .attr("cy",function(d){
         var coords = projection([d.long, d.lat])
         console.log(coords)
         return coords[1];
     })
     */

}
}
