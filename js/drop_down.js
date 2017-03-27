'use strict'

var sg;
var count =1;
 
  
function addDropDownList() {
  $("#org").click(function(){
    $.ajax({
        url: 'getOrganization',
        type:"GET",
        dataType: "text",
        
        success: function(data) {
          loadscroll(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
  });


  $("#attack").click(function(){
    $.ajax({
        url: 'getAttackType',
        type:"GET",
        dataType: "text",
        
        success: function(data) {
         loadscroll(data);
     },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
  });

  $("#weapon").click(function(){
    $.ajax({
        url: 'getWeaponType',
        type:"GET",
        dataType: "text",
        
        success: function(data) {
          loadscroll(data);
          },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
  });



  $("#target").click(function(){
    $.ajax({
        url: 'getTargetType',
        type:"GET",
        dataType: "text",
        
        success: function(data) {
          
        loadscroll(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
  });

}

function loadscroll(data) {

var dataArray = data.split(",");
var rowcount = dataArray.length;
var row = $('tr');
var table = $('table');
$("tr").remove();
  for (var i=0; i<dataArray.length; i++){
        dataArray[i] = dataArray[i].replace(/[\[\]\"]+/g, '');
        table.append('<tr> <td> </td> <td> </td> </tr');
  }
table.find('tr').each(function(idx, elem){
    $(this).find('td:first').text(idx+1).end().find('td:last').text(" "+dataArray[idx]);
});

}
