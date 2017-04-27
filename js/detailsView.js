'use strict';
var grid, dataView;
//TODO if the user clicks on a certain row then display that full column in details
//some codes in this file are referred from https://github.com/mleibman/SlickGrid/wiki/DataView
function loadDataIntoDetailsView(data){
    // following 10 lines of code https://github.com/mleibman/SlickGrid/wiki/DataView
  if(dataView){
    dataView.beginUpdate();
    dataView.setItems(data, ['eventid']);
    dataView.endUpdate();
  } else{
    dataView = new Slick.Data.DataView();
      dataView.beginUpdate();
      dataView.setItems(data, ['eventid']);
      dataView.endUpdate();
    var columns=[];
    for (var key in data[0]){
      var column={};
      column['id']=key;
      column['name']=key.toUpperCase();
      column['field']=key;
      column['sortable']=true;
      column['cssClass']="mousePointer";
      columns.push(column);
    }
    var options = {
      enableCellNavigation: true,
      editable: true,
      enableAddRow: true,
      enableColumnReorder: false,
      cellFlashingCssClass: "flashMe",
    };
    grid = new Slick.Grid("#detailsTable", dataView, columns, options);
//following 8 lines of code is got from https://github.com/mleibman/SlickGrid/wiki/DataView
    // Make the grid respond to DataView change events.
    dataView.onRowCountChanged.subscribe(function (e, args) {
      grid.updateRowCount();
      grid.render();
    });

    dataView.onRowsChanged.subscribe(function (e, args) {
      grid.invalidateRows(args.rows);
      grid.render();
    });


    grid.onClick.subscribe(function(e, args) {
      var rowIndex = args.row;
      var eventID=dataView.getItemByIdx(rowIndex).eventid;
      $.ajax({
          url: 'getEventDetails',
          type:"GET",
          dataType: "json",
          data: {
              eventid:eventID
          },
          success: function(data) {
              //alert(JSON.stringify(data, null, 2));
              loadTheEventIntoThedialog(data)
              $( "#individualDetailsDiv" ).dialog( "open" );
          },
          error: function(jqXHR, textStatus, errorThrown) {
              alert('error ' + textStatus + " " + errorThrown);
          }
      });
      // or dataView.getItem(args.row);
    });
    //the below 5 lines of code is got from https://github.com/mleibman/SlickGrid/wiki/DataView
    grid.onSort.subscribe(function(e, args) {
          var comparer = function(a, b) {
              return (a[args.sortCol.field] > b[args.sortCol.field]) ? 1 : -1;
          }
        dataView.sort(comparer, args.sortAsc);
      });
  }
}
