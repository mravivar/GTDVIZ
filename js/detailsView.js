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
      var column={}
      column['id']=key
      column['name']=key
      column['field']=key
      column['sortable']=true
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
                  alert(JSON.stringify(data, null, 2));
              },
              error: function(jqXHR, textStatus, errorThrown) {
                  alert('error ' + textStatus + " " + errorThrown);
              }
          });
          // or dataView.getItem(args.row);
      });
  }
}
