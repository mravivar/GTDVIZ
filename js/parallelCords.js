var gtdParacords;
// color scale for zscores
var zcolorscale = d3.scale.linear()
  .domain([-2,2])
  .range(["brown", "#999", "#999", "steelblue"])
  .interpolate(d3.interpolateLab);
var marigin={
    top: 20,
    left: 100,
    right: 90,
    bottom: 20
};
var height=$('#gtdParacords').height()-marigin.bottom-marigin.top;
var scale=d3.scale.linear().domain([0,1500]).range([0,height]);
var dimensions={
    "region_txt":{"title":"Region", "orient":"left", "type":"string"},
    "nperps":{"title":"Perpetrators","orient":"left","type":"number"},
    "weaptype1_txt":{"title":"Weapon", "orient":"left", "type":"string"},
    "nkillter":{"title":"Prep. Killed", "orient":"left","type":"number"},
    "nkill":{"title":"Killed","orient":"left","type":"number"},
    "nwound":{"title":"Wounded", "orient":"left", "type":"number"},
    "attacktype1_txt":{"title":"Attack Type", "orient":"left", "type":"number"},
    "targtype1_txt":{"title":"Target","orient":"right", "type":"string"},
};

var hideAxes=['iyear', 'country_txt', 'eventid', 'latitude', 'longitude', 'target1', 'gname'];
  //TODO assign ordinal color - for respective attribets
//TODO see nullValues.html
function updateParallelCordsEvents(data){
  //clears prevoius graph is any
  if(gtdParacords){
      try{
          gtdParacords.removeAxes();
          gtdParacords.brushReset();
          gtdParacords.render();
      } catch(err){
          console.log("Ignored:"+err);
      }
  }
/*
  if(category=='gname' || selectedAttribute==''){
      dimensions['gname']={"title":"Organisation","orient":"left", index:0};
      if(hideAxes.length==7){
          hideAxes.append('gname');
      }
  }else{
      delete dimensions['gname'];
      if(hideAxes.length==8){
          delete hideAxes[7];
      }
  }*/
    var mode="queue";
    if(data.length<100 || !($('#isQueuing').is(':checked'))){
        mode="default";
    }//.dimensions(dimensions)
    //.detectDimensions().dimensions(dimensions).hideAxis(hideAxes)

  gtdParacords = d3.parcoords()("#gtdParacords").composite("darker")
      .data(data).dimensions(dimensions)
    .mode(mode).color(function(d){
      return getEntityColor(d[category]);
    }).margin(marigin)//.smoothness(.2)
    //.alpha(0.2)//Change the opacity of the polylines, also the foreground context's globalAlpha.
    .render().shadows().createAxes().brushMode("1D-axes-multi").on("brush",processSelected)
    .reorderable().interactive(); // command line mode
  //  gtdParacords.updateAxes()
    //gtdParacords.brushReset()
    //.alphaOnBrushed(0.1).smoothness(.2);
    //1D-axes,1D-axes-multi,2D-strums,angular
    //adding color dynamically

    gtdParacords.svg.selectAll(".dimension")
        .on("click", change_color)
        .selectAll(".label")
        .style("font-size", "14px");
}

//Below code is borrowed from http://syntagmatic.github.io/parallel-coordinates/
// update color
function change_color(dimension) {
  gtdParacords.svg.selectAll(".dimension")
    .style("font-weight", "normal")
    .filter(function(d) { return d == dimension; })
    .style("font-weight", "bold")
  if(dimension=='nkill' || dimension=='nwound' || dimension=='nkillter' || dimension=='nperps'){

    gtdParacords.color(zcolor(gtdParacords.data(),dimension)).render()
  }
  else if(dimension==category){
    gtdParacords.color(function(d){
      return getEntityColor(d[category]);
    }).render();
  } else{
    var pcolorMap={};
    var curSelection=dimension;
    var itr=0;
    var colorScale;

    if(gtdParacords.dimensions()[dimension].ticks>10)
        colorScale = d3_v4.scaleOrdinal(d3_v4.schemeCategory20);
    else
        colorScale = d3_v4.scaleOrdinal(d3_v4.schemeCategory10);
    gtdParacords.color(function(d){
      if(d[curSelection] in pcolorMap){
        //
      } else{
        pcolorMap[d[curSelection]]=itr;
        itr++;
      }
      return colorScale(d[curSelection]);
    }).render();
  }
}

// return color function based on plot and dimension
function zcolor(col, dimension) {
  var z = zscore(_(col).pluck(dimension).map(parseFloat));
  return function(d) {
    return zcolorscale(z(d[dimension]))
  }
}

// color by zscore
function zscore(col) {
  var n = col.length,
      mean = _(col).mean(),
      sigma = _(col).stdDeviation();
  return function(d) {
    return (d-mean)/sigma;
  };
}

var brushedData;
function processSelected(data){
  updateWorldMapPoints(data);
  loadDataIntoDetailsView(data);
  //update the table
}