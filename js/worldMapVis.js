'use strict';
//DEFINE YOUR VARIABLES UP HERE
var chart, vis;
var height = 500;
var width = 900;
var margin = {top: 20, right: 50, bottom: 30, left: 30};
var previous=0;
//Gets called when the page is loaded.
function init(){
  chart = d3_v4.select('#worldMap').append('svg:svg')
          //.attr("width", width + margin.left + margin.right)
          //.attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(30,30)")
          .call(d3_v4.zoom().on("zoom", function () {
              chart.attr("transform", d3_v4.event.transform)
          }));
  //vis = chart.append("g");
  update_worldMap();
// themeriver("../data/data.csv");
}





var path, projection, countries,events;
function update_worldMap(){
d3_v4.queue()
  .defer(d3_v4.json, "../data/world-countries.topojson")
  .await(ready);
//function ready(error,data,capitals) {
function ready(error,data) {
  countries = topojson.feature(data, data.objects.countries1).features
  projection = d3_v4.geoMercator()
                     .translate([width/2,height/2])
                     .scale(150)

  path = d3_v4.geoPath()
  .projection(projection)

  chart.selectAll(".country")
     .data(countries)
     .enter().append("path")
     .attr("class", "country")
     .attr("d",path);
     groupUpdates();
       function highlightParrallelCoordinate(countryName, orgName){
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
   }
}
//this fuction gets the events from the DB and updates world map,parallelCords and details view
var groupUpdates=function(){
  //buildquery here
  $.ajax({
      url: 'getAllDatayr',
      type:"GET",
      dataType: "json",
      data: {
        startyr:$('#startyr').val(),
        endyr:$('#endyr').val()
      },
      success: function(data) {
        //clearThemeRiver();
        //themeriver();
        loadDataIntoDetailsView(data);
        updateParallelCordsEvents(data);
        updateWorldMapPoints(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.log('error ' + textStatus + " " + errorThrown);
      }
  });



  
}

function updateWorldMapPoints(data){
    var maxy=1500;
     var rvalue = d3_v4.scaleSqrt()
          .domain([0,maxy])
           .range([1,20])

    //bind data
    events=chart.selectAll("circle").data(data)

    //enter + update
    events.enter().append("svg:circle")
        .attr("r",function(d){
          return rvalue(d.nkill);
        })
    .attr("cx",function(d){
        var coords = projection([d.longitude, d.latitude])
        return coords[0];
    })
    .attr("cy",function(d){
        var coords = projection([d.longitude, d.latitude])
        return coords[1];
     })
     .on('mouseover', function(d){
        d3_v4.select(this).classed("selected", true)
        //highlight parallelCords
        gtdParacords.highlight([d]);
        grid.scrollRowToTop(dataView.getRowById(d.eventid));
        grid.flashCell(dataView.getRowById(d.eventid), grid.getColumnIndex("country_txt"));
      })
      .on('mouseout', function(d){
        d3_v4.select(this).classed("selected", false)
        gtdParacords.unhighlight();
      });

     //remove elements
    events.exit().remove();
}
