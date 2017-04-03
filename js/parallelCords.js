var gtdParacords;
// color scale for zscores
var zcolorscale = d3.scale.linear()
  .domain([-2,2])
  .range(["brown", "#999", "#999", "steelblue"])
  .interpolate(d3.interpolateLab);
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
  gtdParacords = d3.parcoords()("#gtdParacords")
    .data(data).detectDimensions().hideAxis(['iyear','gname', 'country_txt', 'eventid', 'latitude', 'longitude', 'target1', 'i', '_id'])
    .mode('queue').color(function(d){
      return getEntityColor(d[selection]);
    })
    //.color(function(d){
      //  return blue_to_brown(d.numEvents);
    //})//.alpha(0.2)//Change the opacity of the polylines, also the foreground context's globalAlpha.
    .render().createAxes().brushMode("1D-axes").on("brush",processSelected)
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
  else if(dimension==selection){
    gtdParacords.color(function(d){
      return getEntityColor(d[selection]);
    }).render();
  } else{
    var pcolorMap={};
    var curSelection=dimension;
    var itr=0;
    var colorScale = d3_v4.scaleOrdinal(d3_v4.schemeCategory20);
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
};

// color by zscore
function zscore(col) {
  var n = col.length,
      mean = _(col).mean(),
      sigma = _(col).stdDeviation();
  return function(d) {
    return (d-mean)/sigma;
  };
};


var brushedData;
function processSelected(data){
  updateWorldMapPoints(data);
  loadDataIntoDetailsView(data);
  //update the table
}
var blue_to_brown = d3.scale.linear()
  .domain([0, 4000])
  .range(["steelblue", "brown"])
  .interpolate(d3.interpolateLab);

var orgParcoords, orgData;
var countryParcoords, countryData;
function updatePrallelCords(){
  //parallel-coordinates-
  //TODO set different domain for coubtry and org

  //aggregate by organisation
  //examples/table.html highlightioing corresponding org and country with this sample
  //veterans.html, examples/setterForBrushes.html filtering through this
  $("document").ready(function(){
    $.ajax({
        url: 'getDataAggOrg',
        type:"GET",
        dataType: "json",
        data: {
          startyr:$('#startyr').val(),
          endyr:$('#endyr').val()
        },
        success: function(data) {
          var dimensions = {"org_name":{orient: 'left',type: 'string',tickPadding: 0,innerTickSize: 8}};
          orgData=convertJsonObjectsTo2dArray(data);
          orgParcoords = d3.parcoords()("#organisation")
            .data(orgData).hideAxis(['gname', 'nperps'])
            .color(function(d){
                return blue_to_brown(d.numEvents);
            })//.alpha(0.2)//Change the opacity of the polylines, also the foreground context's globalAlpha.
            .render().createAxes().brushMode("1D-axes").on("brush",processSelected) ;
            //1D-axes,1D-axes-multi,2D-strums,angular
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
  });
  //aggregate by country
  $("document").ready(function(){
    $.ajax({
        url: 'getDataAggCountry',
        type:"GET",
        dataType: "json",
        data: {
          startyr:$('#startyr').val(),
          endyr:$('#endyr').val()
        },
        success: function(data) {
          data.forEach(function(ob){
            ob['country_txt']=ob._id['country_txt']
            delete ob._id;
            //delete ob['__proto__'];
          });
          countryData=data;
          countryParcoords = d3.parcoords()("#country")
          .data(data).hideAxis(['country_txt', 'nperps'])
          .color(function(d){
              return blue_to_brown(d.numEvents);
          })
          .render()
          .createAxes().reorderable().brushMode("1D-axes");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
  });
}

function convertJsonObjectsTo2dArray(data){
  for (var i = 0; i < data.length; i++){
    data[i]['gname']=data[i]._id.gname;
    delete data[i]['_id'];
  }
  return data;
}
