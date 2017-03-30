var gtdParacords;
//TODO see nullValues.html
function updateParallelCordsEvents(data){
  //clears prevoius graph is any
  if(gtdParacords){
      gtdParacords.removeAxes()
      gtdParacords.brushReset()
  }
  gtdParacords = d3.parcoords()("#gtdParacords")
    .data(data).detectDimensions().hideAxis(['iyear','gname', 'country_txt', 'eventid', 'latitude', 'longitude', 'target1', 'i'])
    .mode('queue').color(function(d){
      return getEntityColor(d[selection]);
    })
    //.color(function(d){
      //  return blue_to_brown(d.numEvents);
    //})//.alpha(0.2)//Change the opacity of the polylines, also the foreground context's globalAlpha.
    .render().createAxes().brushMode("1D-axes").on("brush",processSelected)
    .reorderable()
  //  gtdParacords.updateAxes()
    //gtdParacords.brushReset()
    //.alphaOnBrushed(0.1).smoothness(.2);
    //1D-axes,1D-axes-multi,2D-strums,angular
}
var brushedData;
function processSelected(data){
  updateWorldMapPoints(data);
  loadDataIntoDetailsView(data);
  //update the table
}
var orgParcoords, orgData;
var countryParcoords, countryData;
function updatePrallelCords(){
  //parallel-coordinates-
  //TODO set different domain for coubtry and org
  var blue_to_brown = d3.scale.linear()
    .domain([0, 4000])
    .range(["steelblue", "brown"])
    .interpolate(d3.interpolateLab);
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
