'use strict';

var sg;
var count =1, checkedIndex=[], checkedAttributes=[];

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
        var checkbox = document.createElement('input');
        checkbox.type ="checkbox";
        checkbox.name = dataArray[i];
        checkbox.value = dataArray[i];
        checkbox.id = "id"+ i;
        table.append('<tr style="border-bottom: thin solid;  border-color: #cebcbc"> ' +
            '<td style="padding-left: 10px;padding-top:.1em; padding-bottom: .1em"> <input type="checkbox" id="'+i+'"'+'value="'+checkbox.value+'"></td>' +
            '<td><label style="padding-left: 10px; padding-bottom: .1em;padding-top:.1em;" for="'+i+'">'+checkbox.value+'</label></td></tr>');
    }
    checkedAttributes=[];
    checkedIndex=[];
    checkboxHandlers();
}


function checkboxHandlers() {
var e1 = document.getElementById('selectedAttribute');
var tops = e1.getElementsByTagName('input');
for (var i=0, len=tops.length; i<len; i++){
  if(tops[i].type == 'checkbox'){
    tops[i].onclick = updatecheckEntry;
  }
}
}


function updatecheckEntry(e) {
  
  var i = checkedAttributes.length;
  var form = this.form;
  if (this.checked){
    checkedAttributes[i] = this.value;
    checkedIndex[i] = e.currentTarget.id;
  } else {
    var found = checkedAttributes.indexOf(this.value);
    if (found != -1){
      checkedAttributes.splice(found,1);
      checkedIndex.splice(found,1);
    }
  }
}


var lastSelectedRow, table, trs, selected=[];


function plot(){
    progressBar.set(0);
    var length = selectedAttribute.length;
    var table=document.getElementById("tableid");
    for (var i=0; i<length; i++){
      table.rows[i].style.background="white";
    }
    selectedAttribute = checkedAttributes.slice(0);

    if(checkedAttributes.length>0){
        var len = checkedAttributes.length;
        
        for (var i =0; i< len; i++){
             swapText(table, checkedIndex[i],i);
        }
        checkboxHandlers();
        updateEntity(selectedAttribute);
    
        //lets color the update
        colorMyAttributes(table);
    
        //scroll to first row - to make the selection visible
        var rowpos = $('#tableid tr:first').position();
        $('#selectedAttribute').scrollTop(rowpos.top);
        groupUpdates();        
        checkedAttributes = [];
        checkedIndex =[];
    }
}
function swapText(table,y,x){
  var text = table.rows[x].cells[1].textContent;
  var selectedtext = table.rows[y].cells[1].textContent;

   table.rows[x].cells[1].children[0].textContent=selectedtext;
   //table.rows[x].cells[1].children[0].textContent=selectedtext;
   document.getElementById(x).value=selectedtext;

   table.rows[y].cells[1].children[0].textContent=text;
   //table.rows[y].cells[1].children[0].textContent=text;
   document.getElementById(y).value=text;
   document.getElementById(y).checked = false;

}

function colorMyAttributes(table){
    var length = selectedAttribute.length;
    for (var i = 0; i<length ; i++) {
        var index=$.inArray(table.rows[i].cells[1].textContent, selectedAttribute);
        if(index !== -1) {
          table.rows[i].style.background = getEntityColor(table.rows[i].cells[1].textContent);
        }
    }
}
