'use strict';

var sg;
var count =1;

function selectChanged(){
   var historySelectList = $('select#attribute');
    var selectedValue = $('option:selected', historySelectList).val();
    category = $('option:selected', historySelectList)[0].id;
$.ajax({
        url: 'getUnique',
        type:"GET",
        dataType: "json",
         data: {
          attr: category
        },
        success: function(data) {
          loadscroll(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
}

function loadscroll(dataArray) {
    var rowcount = dataArray.length;
    var row = $('tr');
    var table = $('table');
    $("tr").remove();
    for (var i=0; i<dataArray.length; i++){
        dataArray[i] = dataArray[i].replace(/[\[\]\"]+/g, '');
        table.append('<tr onmousedown="RowClick(event, false);"><td></td><td></td></tr>');
    }
    table.find('tr').each(function(idx, elem){
        $(this).find('td:last').text(dataArray[idx]);
    });

}

var lastSelectedRow, table, trs, selected=[];


function RowClick(events, lock) {
  if (count ==1) {
  table = document.getElementById('tableid');
  trs = table.tBodies[0].getElementsByTagName('tr');
  selected = table.getElementsByClassName('itemselected');
  document.onselectstart = function() {
    return false;
  }
  count =2;
  }
      if (events.ctrlKey) {
        toggleRow(events);
    }
    
    if (events.button == 0) {
        if (!events.ctrlKey && !events.shiftKey) {
            clearAll();
            toggleRow(events);
        }
    
        if (events.shiftKey) {
            selectRowsBetweenIndexes([lastSelectedRow.target.parentNode.rowIndex, events.target.parentNode.rowIndex])
        }
    }
}


function toggleRow(row) {
    row.target.parentNode.className = row.target.parentNode.className == 'itemselected' ? '' : 'itemselected';
    row.className = row.className == 'itemselected' ? '' : 'itemselected';
    lastSelectedRow = row;
}

function clearAll() {

    for (var i = 0; i < trs.length; i++) {
        trs[i].parentNode.className = '';
        trs[i].className = '';
    }
}


function selectRowsBetweenIndexes(indexes) {
    indexes.sort(function(a, b) {
        return a - b;
    });

    for (var i = indexes[0]; i <= indexes[1]; i++) {
        trs[i-1].parentNode.className = 'itemselected';
        trs[i-1].className = 'itemselected';
    }
}


function plot(){
    selectedAttribute=[];
    for (var i =0,j=0; i < selected.length;i++,j++){
      if (selected[i].tagName=="TBODY") continue;
      selectedAttribute[i] = selected[i].cells[1].textContent;
    }

    if(selectedAttribute.length>0){
        groupUpdates();
    }
}