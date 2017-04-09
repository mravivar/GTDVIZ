//change the data format , so that it can be used directly in UI
//remove the bracket
var d3=require('d3');
module.exports = {
    cleanString: function(str){
        var start=str.indexOf('(');
        if(start!='-1'){
            str=str.slice(0,start);
        }
        start=str.indexOf('/');
        if(start!='-1'){
            str=str.slice(0,start);
        }
        return str;
    },
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
            row[key]=module.exports.cleanString(row[key]);
        }
      }
    })
  },
    preProcessArray: function(data){
        for(var itr=0;itr<data.length;itr++){
            data[itr]=module.exports.cleanString(data[itr]);
        }
        return data;
    },
//Reference: http://stackoverflow.com/questions/14713503/how-to-handle-layers-with-missing-data-points-in-d3-layout-stack
    convertJsonTo2dArray:function  (data){
        var uniqueContinents={};
        for(var i=0;i<data.length;i++)
        {
            //TODO if we dont want this much data then only get only those data that is needed
            data[i]['key']=data[i]._id.valname;
            uniqueContinents[data[i]._id.valname]=true;
            data[i]['date']=data[i]._id.year;
            delete data[i]['_id'];
            delete data[i]['nkill'];
            delete data[i]['nperps'];
            delete data[i]['nkillter'];
            delete data[i]['nwound'];
            //delete data[i]['__proto__'];
        }
        //updateEntity(uniqueContinents);
        // console.log(data);
    function assignmissing (dataset)
    {
        if(dataset.length==0){
            return [];
        }
        var defaultValue=0;
        var uniquekeys =  d3.nest()
            .key(function(d) { return d.key; })
            .entries(dataset);
        var uniquekis=[]
        uniquekeys.forEach(function(row){
            uniquekis.push(row.key)
        });
        //  console.log(uniquekeys);
        //  console.log(uniquekis.length);
        var keys = uniquekis.sort(sortByNames);
        //  console.log(keys);
        var newData = [];
        var sortByDate = function(a,b){
            return d3.ascending(a.date, b.date) ||d3.ascending(a.key, b.key);}
        //console.log(a); console.log(a.date);
        //console.log(b); console.log(b.date);
        //return a.date > b.date ? 1 : -1; };
        dataset.sort(sortByDate);
        //console.log(dataset);
        //var sortByName = function(a,b){
        //  if((a.key >= b.key) && (a.date>=b.date)){ return 1; }
        //  else {return -1;}
        //};
        var sortByNames= function(a,b){
            return d3.ascending(a,b);
        }
        var startingyear = dataset[0].date;
        //dataset.sort(sortByName);
        //console.log("Fixing missing data");
        var iyear=startingyear;
        var j=0;
        dataset.forEach(function(row){
            //console.log(row.key);
            //console.log(keys[j]);
            while(row.key!=keys[j]){
                newData.push( { key: keys[j],
                    numEvents: +defaultValue,
                    date: iyear })
                j=j+1;
                if(j==uniquekis.length){
                    j=0;
                    iyear=iyear+1;
                }
            }
            j=j+1;
            if(j==uniquekis.length){
                j=0;
                iyear=iyear+1;
            }
        });
        console.log("Fixed Missing data");
        return dataset.concat(newData).sort(sortByDate);
    }
        assigneddata=assignmissing(data);
        return assigneddata;
    },

    deleteEmptyFields:function (event) {
        for(key in event){
            if((typeof event[key])=='string'){
                if(event[key].length==0){
                    delete event[key];
                }
            }
        }
        return event;
    },

};
