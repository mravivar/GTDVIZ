'use strict'
function addDropDownList() {
  $("#org").click(function(){
    $.ajax({
        url: 'getOrganization',
        type:"GET",
        dataType: "text",
        
        success: function(data) {
          console.log('Anitha success');

          var datas = data.split(',').join("\n");
          console.log(datas);
          $("#selectedAttribute").text(datas);
            
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
          console.log('Anitha success: Attack');

          var datas = data.split(',').join("\n");
          console.log(datas);
          $("#selectedAttribute").text(datas);
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
          console.log('Anitha success: Weapon');

          var datas = data.split(',').join("\n");
          console.log(datas);
          $("#selectedAttribute").text(datas);
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
          console.log('Anitha success: Target');

          var datas = data.split(',').join("\n");
          console.log(datas);
          $("#selectedAttribute").text(datas);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert('error ' + textStatus + " " + errorThrown);
        }
    });
  });
}