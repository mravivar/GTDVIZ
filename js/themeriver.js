//Reference: http://bl.ocks.org/WillTurman/4631136

var strokerange,format,strokecolor,margin,widthTM,heightTM,xTM,yTM;
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
// Part of the code in this function is used from http://bl.ocks.org/WillTurman/4631136
function themeriver() {


strokerange = ["FFFFFF"]
strokecolor = strokerange[0];
format = d3.time.format("%m/%d/%Y");
margin = {top: 20, right: totalWidth*3, bottom: 30, left: totalWidth*3};
widthTM = totalWidth*99 - margin.left - margin.right;
heightTM = $('.themeriver').height() - margin.top - margin.bottom;

xTM = d3.time.scale()
    .range([0, widthTM]);
yTM = d3.scale.linear()
    .range([heightTM, 0]);

svg = d3.select(".themeriver").append("svg:svg")
    .attr("width", widthTM + margin.left + margin.right)//TODO make sure this width does not affect the arrangements
    .attr("height", heightTM + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    startline = d3.select(".themeriver")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "19")
        .style("width", "3px")
        .style("height", heightTM+"px")
        .style("bottom", margin.bottom+"px")
        .style("left", "0px")
        .style("background", "white");

    endline = d3.select(".themeriver")
        .append("div")
        .attr("class", "remove")
        .style("position", "absolute")
        .style("z-index", "19")
        .style("width", "3px")
        .style("height", heightTM+"px")
        .style("bottom", margin.bottom+"px")
        .style("left", "0px")
//updateThemeRiver();
}

// Part of the code in this function is used from http://bl.ocks.org/WillTurman/4631136
function themecall(data){
//console.log(data);
xAxis = d3.svg.axis()
    .scale(xTM)
    .orient("bottom")
    .ticks(d3.time.years);
yAxis = d3.svg.axis()
    .orient("left")
    .scale(yTM);
stack = d3.layout.stack()
    .offset("zero")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.numEvents; });
//console.log(stack);
nest = d3.nest().key(function(d) {  return d.key; })
area = d3.svg.area()
    .interpolate("basis")
    .x(function(d) { return xTM(d.date); })
    .y0(function(d) { return yTM(d.y0); })
    .y1(function(d) { return yTM(d.y0 + d.y); });

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
  xTM.domain(d3.extent(data, function(d) { return d.date; }));
  yTM.domain([0, d3.max(data, function(d) { return d.y0 + d.y; })]);

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
      .attr("transform", "translate(20," + heightTM + ")")
      .call(xAxis);
  svg.append("g")
      .attr("class", "yaxis")
      .attr("transform", "translate( 20 , 0)")
      .call(yAxis.orient("left"));
      
//Reference : http://bl.ocks.org/phoebebright/3061203
svg.append("text")
            .attr("text-anchor", "middle")  
            .attr("transform", "translate(-35"+","+(heightTM/2)+")rotate(-90)")
            .attr("font-weight", 'bold')
            .text("# Events");
            //.text(""+d3.select("#attribute").node().value +"");
  svg.append("text")
            .attr("text-anchor", "middle")  
            .attr("transform", "translate("+ ((widthTM/2)+17.5) +","+(heightTM+30)+")")
            .attr("font-weight", 'bold')
            .text("Year");
startline.style("left", "0px")
        .style("background", "white");
    endline.style("left", "0px")
        .style("background", "white");

svg.selectAll(".layer")
    .attr("opacity", 1)
    .on("mouseover", function(d, i) {
      svg.selectAll(".layer").transition()
      .attr("opacity", function(d, j) {
        return j != i ? 0.1 : 1;
    })
  //    console.log(d.values);
       var x0 = d3.mouse(this);
       var x1= xTM.invert(x0[0])
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
            }).attr({
                    x: totalWidth*40,
                })
                    .attr("font-weight", 'bold')
                    .attr("font-style", 'italic')
            .text(function() {
              var yeartoarry=xyear-mindate;
  //            console.log(d.values[yeartoarry].numEvents);
              return [d.key,xyear +' -> '+ d.values[yeartoarry].numEvents + ' Events'] ;  // Value of the text
            })
    })
    .on("mouseout",function(d,i){
      svg.selectAll(".layer").transition()

      .attr("opacity",1);
      d3.select("#t-abs" ).remove();
    }).on("click", function(){
        progressBar.set(0);
        mousex = d3.mouse(this);
        mousex=mousex[0];
        var curyr=xTM.invert(mousex).getFullYear();
        var newMouseX=yearPosMap[curyr];
        updatedStart=!updatedStart;
        if(updatedStart){
            window_endyr=curyr;
            setWindowLineStye(endline, newMouseX);
            setWindowArrowDirection(LEFT_ARROW);
        }else{
            window_startyr=curyr;
            setWindowLineStye(startline, newMouseX);
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


    recordTickPositions(xTM,xAxis);
}
var xTickPosTransform=0;
var yearPosMap={};
function recordTickPositions(x, xAxis){
    maxYear=1969;
    var svg = d3.select(".xaxis");
    //gives total number of ticks - x.ticks().length-1].getFullYear()-x.ticks()[0].getFullYear() +1
    //x.ticks().length has so extra ticks
    var tmp=xAxis.ticks(x.ticks()[x.ticks().length-1].getFullYear()-x.ticks()[0].getFullYear() +1 );
    var itrYear, styr=null, enyr;
    var prv=0;
    svg.call(tmp).selectAll(".tick").each(function(d){
        var tk=d3.select(this);
        itrYear=+tk.select('text').html();
        if(!styr){
            xTickPosTransform=d3.transform(d3.select(this.parentNode.parentNode).attr("transform")).translate[0]
            +d3.transform(d3.select(this.parentNode).attr("transform")).translate[0]+15;//d3 padding
            styr=itrYear;
        }
        yearPosMap[itrYear]=d3.transform(tk.attr("transform")).translate[0];
        console.log(maxYear);
        enyr=itrYear;
        diffPosXaxis=yearPosMap[itrYear]-prv;
        prv=yearPosMap[itrYear]
        itrYear++;
    });
    maxYear=enyr;
    setWindowStartEndyrs(styr, maxYear);
}

var startline, endline, window_startyr, window_endyr,updatedStart=false, maxYear=1969, diffPosXaxis=0;


function clearThemeRiver()
{
    if(selectedAttribute.length==0)
        return;
  console.log("Clearing");
  svg.selectAll(".layer").remove();
  svg.selectAll("g").remove();
  updateThemeRiver();
}
