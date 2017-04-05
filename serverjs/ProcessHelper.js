//change the data format , so that it can be used directly in UI
//remove the bracket
module.exports = {
    preProcessData: function(data){
  data.forEach(function(row){
    if(row.nkill=="")
       row.nkill=+0;
    else
       row.nkill=+row.nkill;
    if(row.nwound=="")
      row.nwound=+0;
    else {
      row.nwound=+row.nwound;
    }
    if(row.nkillter==""){
      row.nkillter=0;
    }else{
      row.nkillter=+row.nkillter;
    }
    if(row.nperps==''){
      row.nperps=0;
    }else{
      row.nperps=+row.nperps;
    }
    delete row._id;
    for(var key in row){
      if(typeof row[key]=='string'){
        var start=row[key].indexOf('(');
        if(start!='-1'){
          row[key]=row[key].slice(0,start);
          }
          start=row[key].indexOf('/');
          if(start!='-1'){
              row[key]=row[key].slice(0,start);
          }
        }
      }
    })
  }
}
