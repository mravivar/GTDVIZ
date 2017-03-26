'use strict';
var grid, dataView;
//TODO if the user clicks on a certain row then display that full column in details
function loadDataIntoDetailsView(data){

  if(dataView){
    dataView.beginUpdate();
    dataView.setItems(data, ['eventid']);
    dataView.endUpdate();
  } else{
    dataView = new Slick.Data.DataView();
    var columns=[]
    for (var key in data[0]){
      if(key!='_id'){
        var column={}
        column['id']=key
        column['name']=key
        column['field']=key
        column['sortable']=true
        columns.push(column);
      }
    }
    var options = {
      enableCellNavigation: true,
      editable: true,
      enableAddRow: true,
      enableColumnReorder: false
    };
    grid = new Slick.Grid("#detailsTable", dataView, columns, options);

    // Make the grid respond to DataView change events.
    dataView.onRowCountChanged.subscribe(function (e, args) {
      grid.updateRowCount();
      grid.render();
    });

    dataView.onRowsChanged.subscribe(function (e, args) {
      grid.invalidateRows(args.rows);
      grid.render();
    });

    dataView.beginUpdate();
    dataView.setItems(data, ['eventid']);
    dataView.endUpdate();
}
/*
  $(function () {
    var data = [];
    for (var i = 0; i < 500; i++) {
      data[i] = {
        title: "Task " + i,
        duration: "5 days",
        percentComplete: Math.round(Math.random() * 100),
        start: "01/01/2009",
        finish: "01/05/2009",
        effortDriven: (i % 5 == 0)
      };
    }

    grid = new Slick.Grid("#detailsView", data, columns, options);
  })
*/
  /*
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
*/
}
