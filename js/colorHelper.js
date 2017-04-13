'use strict';
//var colorScale = d3.scale.category10();//d3.scale.ordinal().range(colorrange);
var colorScale = d3_v4.scaleOrdinal(d3_v4.schemeCategory10)
var entityMap;
//updatING this with the category from the selected section

//to this function array also can be passed or hashmap(json object) can be passed
function updateEntity(entities){
  entityMap={};
  var itr=0;
  if(typeof entities=='object'){
      for(var k in entities){
        var v=entities[k];
      if(typeof v =='string'){
        entityMap[v]=itr;
      }else{
        entityMap[k]=itr;
      }
      itr++
    };
  }else{
    for(k in entities){
      entityMap[k]=itr;
      itr++;
    }
  }
  if(itr<=10){
    colorScale=d3_v4.scaleOrdinal(d3_v4.schemeCategory10);
  } else if(itr<=20){
    colorScale=d3_v4.scaleOrdinal(d3_v4.schemeCategory20);
  }else if(itr<=100){
    colorScale=d3_v4.scaleOrdinal(d3_v4.schemeCategory100);
  }else{
    alert("Coloring will be disabled! Please filter the selection.");
    colorScale='black';
  }
  //console.error(JSON.stringify(entityMap));
}
var separator = /\s|\//;
function getEntityColor(entity){
  //console.log(entity);
  if(typeof colorScale=='string'){
    return colorScale;//only one color
  }
  if(entity in entityMap){
    return colorScale(entityMap[entity])
  }else{
      var searchEntity=entity.trim();
    for(var k in entityMap){
      var v=entityMap[k];
      if(k.split(separator)[0]===searchEntity.split(separator)[0]){//hack for parallel coordinate coloring issue
        //entityMap[entity]=v;//duplicate it
        return colorScale(v);
      }
    }
    return colorScale(0);
  }
}
