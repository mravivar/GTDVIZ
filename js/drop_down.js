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
        table.append('<tr onmousedown="RowClick(event, false);"><td></td></tr>');
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
        trs[i].style="";
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
    progressBar.set(0);
    selectedAttribute=[];
    var selectedAttibutesLen=0;
    for (var i =0,j=0; i < selected.length;i++,j++){
      if (selected[i].tagName=="TBODY")
          continue;
      selectedAttribute[i] = selected[i].cells[0].textContent;
      selectedAttibutesLen++;
    }

    if(selectedAttribute.length>0){
        clearAll();
        var table=document.getElementById("tableid");
        swapSelectedAttributes(table, selectedAttibutesLen);
        updateEntity(selectedAttribute);
        //lets color the update
        colorMyAttributes(table);
        //scroll to first row - to make the selection visible
        var rowpos = $('#tableid tr:first').position()
        $('#selectedAttribute').scrollTop(rowpos.top)
        groupUpdates();
    }
}
//color sync between themeriver and parallel coordinate
function colorMyAttributes(table){
    for (var i = 0, row; row = table.rows[i]; i++) {
        //if (selected[i].tagName=="TBODY") continue;
        var index=$.inArray(table.rows[i].cells[0].textContent, selectedAttribute);
        if(index !== -1) {
            row.style = "background:" + getEntityColor(table.rows[i].cells[0].textContent);
        }
    }
}

function swapSelectedAttributes(table, selectedAttibutesLen){
    //TODO:make scroll table to scroll to top
    var selectedArrayIndex=[];
    for (var i = 0, row; row = table.rows[i]; i++) {
        var index=$.inArray(row.cells[0].textContent, selectedAttribute);
        if(index!==-1){
            selectedArrayIndex[selectedArrayIndex.length]=(i);
        }
    }
    for(var i=0;i<selectedAttibutesLen;i++){
        swapText(table, selectedArrayIndex[i], i);
    }
}
function swapText(table, x, y){

    var tmp=table.rows[x].cells[0].textContent;
    table.rows[x].cells[0].textContent=table.rows[y].cells[0].textContent;
    table.rows[y].cells[0].textContent=tmp;
}