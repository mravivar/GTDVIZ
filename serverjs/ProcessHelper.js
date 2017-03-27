//change the data format , so that it can be used directly in UI
//remove the bracket
module.exports = {
  removeBrackets: function(data){
  data.forEach(function(row){
    for(var key in row){
      delete row._id
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
