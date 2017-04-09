//Reference: http://bl.ocks.org/WillTurman/4631136
//var datearray = [];
//var colorrange = [];

var strokerange,format,strokecolor,margin,width,height,x,y;
var xAxis,yAxis,stack,nest,area,svg,layers;

function updateThemeRiver(){
      $.ajax({
          url: 'SelectedDataplot',
          type:"GET",
          dataType: "json",
          data: {
            startyr:$('#startyr').val(),
            endyr:$('#endyr').val(),
                cat: category,
                attr:selectedAttribute
          },
          success: function(data) {
              if(data.length>0){
                  //regData=convertJsonTo2dArray(data);
                  themecall(data);
                  //themeriver();
                  //  console.log(data);
              }
          },
          error: function(jqXHR, textStatus, errorThrown) {
              console.log('error ' + textStatus + " " + errorThrown);
          }
      });
    }
/*function updateThemeRiver(){
  $("document").ready(function(){
    $.ajax({
        url: 'getDatayr',
        type:"GET",
        dataType: "json",
        data: {
          startyr:$('#startyr').val(),
          endyr:$('#endyr').val()
        },
        success: function(data) {
          regData=convertJsonTo2dArray(data);
          themecall(regData);

        },
    });
  });
  //end
}
*/

function themeriver() {

//no longer used, code moved to colorHelper.js
//colorrange = ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#ff7f00","#6600cc","#66ff99"];
//["#B30000", "#78C679", "#FC8D59", "#FDBB84", "#CC4C02", "#FEF0D9","#980043", "#DD1C77", "#DF65B0", "#02F4C7","#238443","#EFFFFF"];

strokerange = ["FFFFFF"]
strokecolor = strokerange[0];
format = d3.time.format("%m/%d/%Y");
margin = {top: 20, right: 40, bottom: 30, left: 50};
width = document.body.clientWidth - margin.left - margin.right;
height = $('.themeriver').height() - margin.top - margin.bottom;

x = d3.time.scale()
    .range([0, width]);
y = d3.scale.linear()
    .range([height, 0]);

svg = d3.select(".themeriver").append("svg:svg")
    .attr("width", width + margin.left + margin.right)//TODO make sure this width does not affect the arrangements
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//updateThemeRiver();
}

function themecall(data){
xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.years);
yAxis = d3.svg.axis()
    .orient("left")
    .scale(y);
stack = d3.layout.stack()
    .offset("zero")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.numEvents; });
//console.log(stack);
nest = d3.nest().key(function(d) {  return d.key; })
area = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y(d.y0); })
    .y1(function(d) { return y(d.y0 + d.y); });

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
  //console.log(data);
layers = stack(nest.entries(data));
  //console.log(layers);
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

  svg.selectAll(".layer")
      .data(layers)
    .enter().append("path")
      .attr("transform", "translate(20, 0)")
      .attr("class", "layer")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", function(d, i) {
         return getEntityColor(d['key']);
       });
  svg.append("g")
      .attr("class", "xaxis")
      .attr("transform", "translate(20," + height + ")")
      .call(xAxis);
  svg.append("g")
      .attr("class", "yaxis")
      .attr("transform", "translate( 20 , 0)")
      .call(yAxis.orient("left"));
//Reference : http://bl.ocks.org/phoebebright/3061203
svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate(-40"+","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
    .text("# Events");
            //.text(""+d3.select("#attribute").node().value +"");
  svg.append("text")
            .attr("text-anchor", "middle")  
            .attr("transform", "translate("+ ((width/2)+17.5) +","+(height+30)+")")  
            .text("Year");


svg.selectAll(".layer")
    .attr("opacity", 1)
    .on("mouseover", function(d, i) {
      svg.selectAll(".layer").transition()
      .attr("opacity", function(d, j) {
        return j != i ? 0.1 : 1;
    })
  //    console.log(d.values);
       var x0 = d3.mouse(this);
       var x1= x.invert(x0[0])
       var xyear=x1.getFullYear();
  //     var xdate="01/01/"+xyear;
   //    var fmat = d3.time.format("%m/%d/%Y").parse;
       //var newxdate=fmat(xyear);
       var mindate=getStartyr();
//       console.log(d);
  //     var y0=Math.round(y.invert(x0[1]))
       //console.log(y0)
                svg.append("text").attr({
               id: "t-abs",  
            })
            .text(function() {
              var yeartoarry=xyear-mindate;
  //            console.log(d.values[yeartoarry].numEvents);
              return [d.key,xyear, d.values[yeartoarry].numEvents];  // Value of the text
            })
    })
    .on("mouseout",function(d,i){
      svg.selectAll(".layer").transition()

      .attr("opacity",1);
      d3.select("#t-abs" ).remove();
    }).on("click", function(){
        mousex = d3.mouse(this);
        mousex=mousex[0];
        var curyr=x.invert(mousex).getFullYear();

        updatedStart=!updatedStart;
        if(updatedStart){
            window_endyr=curyr;
            setWindowLineStye(endline, mousex);
            setWindowArrowDirection(LEFT_ARROW);
        }else{
            window_startyr=curyr;
            setWindowLineStye(startline, mousex);
            setWindowArrowDirection(RIGHT_ARROW);
        }
        if(window_endyr<window_startyr){
            setWindowStartEndyrs(window_endyr, window_startyr);
        }else{
            setWindowStartEndyrs(window_startyr, window_endyr);
        }
        console.log(window_startyr+":"+window_endyr);
        partialUpdate(window_startyr, window_endyr);
    });

    startline = d3.select(".themeriver")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "19")
        .style("width", "3px")
        .style("height", height+"px")
        .style("bottom", margin.bottom+"px")
        .style("left", "0px")
        .style("background", "#fff");

    endline = d3.select(".themeriver")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "19")
        .style("width", "3px")
        .style("height", height+"px")
        .style("bottom", margin.bottom+"px")
        .style("left", "0px")
        .style("background", "#fff");
    recordTickPositions(x,xAxis);
}
var yearPosMap={};
function recordTickPositions(x, xAxis){
    var svg = d3.select(".xaxis");
    //gives total number of ticks - x.ticks().length-1].getFullYear()-x.ticks()[0].getFullYear() +1
    //x.ticks().length has so extra ticks
    var tmp=xAxis.ticks(x.ticks()[x.ticks().length-1].getFullYear()-x.ticks()[0].getFullYear() +1 );
    var itrYear=x.ticks()[0].getFullYear(), styr=itrYear, enyr=styr;

    svg.call(tmp).selectAll(".tick").each(function(d){
        var tk=d3.select(this);
        yearPosMap[itrYear]=d3.transform(tk.attr("transform")).translate[0];
        enyr=itrYear;
        itrYear++;
    });
    setWindowStartEndyrs(styr, enyr);
}

var startline, endline, window_startyr, window_endyr,updatedStart=false;


function clearThemeRiver()
{
  console.log("Clearing");
  svg.selectAll(".layer").remove();
  svg.selectAll("g").remove();
  updateThemeRiver();
}
