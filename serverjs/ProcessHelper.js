//change the data format , so that it can be used directly in UI
//remove the bracket
module.exports = {
  removeBrackets: function(data){
  data.forEach(function(row){
     if(row.nkill=="")
       row.nkill=+0;
     else
       row.nkill=+row.nkill;
    delete row._id;
    for(var key in row){
      if(typeof row[key]=='string'){
        var start=row[key].indexOf('(');
        if(start!='-1'){
          row[key]=row[key].slice(0,start);
          }
        }
      }
    })
  }
}