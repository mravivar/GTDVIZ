'use strict';
async function loadDataIntoDetailsView(data){
  var table_id="#detailsView", array_of_columns, array_of_data, dimensions;
    array_of_columns=[];
    //TODO give proper table headings for the table header
    //TODO table header and data are not alligning properly
  for(var key in data[0]){
    if(key!='_id'){
      array_of_columns.push({"text":key, "sort_column":false});
    }
  }
  array_of_data=[]
  for(var event in data){
    var row=[]
    for(var key in data[event]){
      if(key!='_id'){
        row.push(data[event][key])
      }
    }
    array_of_data.push({"id":'e'+data[event].eventid, "data":row});
  }
  dimensions={ width: $( window ).width()-30, height: '700px' }
  TableSort(
          table_id,
          array_of_columns,
          array_of_data,
          dimensions
          );

}
