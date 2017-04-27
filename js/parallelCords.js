//some part of this file is got from
//http://syntagmatic.github.io/parallel-coordinates/
//and are referenceed within the code

var gtdParacords;
// color scale for zscores
var zcolorscale = d3.scale.linear()
  .domain([-2,2])
  .range(["brown", "#999", "#999", "steelblue"])
  .interpolate(d3.interpolateLab);
var pcMarigin;
var height;
var scale;
var dimensions={
    "region_txt":{"title":"Region", "orient":"left", "type":"string"},
    "nperps":{"title":"Perpetrators","orient":"left","type":"number"},
    "weaptype1_txt":{"title":"Weapon", "orient":"left", "type":"string"},
    "nkillter":{"title":"Prep. Killed", "orient":"left","type":"number"},
    "nkill":{"title":"Killed","orient":"left","type":"number"},
    //"nkill":undefined,
    "nwound":{"title":"Wounded", "orient":"left", "type":"number"},
    "attacktype1_txt":{"title":"Attack Type", "orient":"left", "type":"string"},
    "targtype1_txt":{"title":"Target","orient":"right", "type":"string", "index":"20"},
};

var hideAxes=['iyear', 'country_txt', 'eventid', 'latitude', 'longitude', 'target1', 'gname'];
  //TODO assign ordinal color - for respective attribets
//TODO see nullValues.html
function updateParallelCordsEvents(data){
    setNumDocsPC(data.length);
  //clears prevoius graph is any
  if(gtdParacords){
      try{
          //gtdParacords.removeAxes();
          gtdParacords.brushReset();
          //gtdParacords.render();
      } catch(err){
          console.log("Ignored:"+err);
      }
  }else{
      height = $('#gtdParacords').height() - pcMarigin.bottom - pcMarigin.top;
      scale = d3.scale.linear().domain([0, 1500]).range([0, height]);
      gtdParacords = d3.parcoords()("#gtdParacords").composite("darker");
  }
    var mode="queue";
    if(data.length<100 || !($('#isQueuing').is(':checked'))){
        mode="default";
    }//.dimensions(dimensions)
    //.detectDimensions().dimensions(dimensions).hideAxis(hideAxes)

    //gtdParacords.rate=100;
    gtdParacords.data(data).dimensions(dimensions).hideAxis(hideAxes)
    .mode(mode).color(function(d){
      return getEntityColor(d[category]);
    }).margin(pcMarigin).smoothness(.2).bundlingStrength(.9)
    .alpha(0.4).alphaOnBrushed(1)//Change the opacity of the polylines, also the foreground context's globalAlpha.
    .render().shadows().createAxes()
    .reorderable()//.interactive() // command line mode
  //  gtdParacords.updateAxes()
    //gtdParacords.brushReset()
    //.alphaOnBrushed(0.1).smoothness(.2);
    //1D-axes,1D-axes-multi,2D-strums,angular
    //adding color dynamically
        .brushMode("1D-axes-multi").on("brush",processSelected)
    .svg.selectAll(".dimension")
    .on("click", change_color)
    .selectAll(".label")
    .style("font-size", "14px")
    .style("cursor", "pointer")
    ;
    pcSelectedAttribute=null;
    //moving all the label up a bit
    d3.select('#gtdParacords').selectAll(".label").attr("dy", -5);

}
var pcSelectedAttribute;
var pcolorMap={};
var curSelection;
var itr=0;
var colorScale;
//Below code till the end of the file is borrowed from http://syntagmatic.github.io/parallel-coordinates/
// update color
function change_color(dimension) {
  pcSelectedAttribute=dimension;
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
    pcolorMap={};
    curSelection=dimension;
    itr=0;
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
    syncTheColorPC_world_map();
}

function syncTheColorPC_world_map(){
    //sync the world map colors
    panCanvas.selectAll("circle")
        .style("fill", function(d, i) {
            if(pcSelectedAttribute){
                return getSyncedColor(d);
            }
            return getEntityColor(d[category]);
        });
}
function getSyncedColor(event){

    if(pcSelectedAttribute=='nkill' || pcSelectedAttribute=='nwound' || pcSelectedAttribute=='nkillter' || pcSelectedAttribute=='nperps'){
        //return zcolor(gtdParacords.data(),dimension)
        //return nothing so default color will be used - which is red
        return zMagicFunction(event);
    }
    else if(pcSelectedAttribute==category){
        return getEntityColor(d[category]);
    } else {
        return colorScale(event[pcSelectedAttribute]);
    }
}
var z,zMagicFunction;
//below function is got from http://syntagmatic.github.io/parallel-coordinates/
// return color function based on plot and dimension
function zcolor(col, dimension) {
  z = zscore(_(col).pluck(dimension).map(parseFloat));
  return (zMagicFunction=function(d) {
    return zcolorscale(z(d[dimension]))
  })
}
//below function is got from http://syntagmatic.github.io/parallel-coordinates/
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
    progressBar.set(.3);
    updateWorldMapPoints([]);
    updateWorldMapPoints(data);
    syncTheColorPC_world_map();
    progressBar.animate(.6);
    //update the table
    loadDataIntoDetailsView(data);
    progressBar.animate(1);
}