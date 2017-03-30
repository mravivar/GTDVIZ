//var colorScale = d3.scale.category10();//d3.scale.ordinal().range(colorrange);
var colorScale = d3_v4.scaleOrdinal(d3_v4.schemeCategory10)
var entityMap;
//TODO update this with the category from the selected section
var selection="region_txt";//default

//to this function array also can be passed or hashmap(json object) can be passed
function updateEntity(entities){
  entityMap={};
  var itr=0;
  if(typeof entities!='object'){
    entities.forEach(function(k,v){
      if(typeof v =='string'){
        entityMap[v]=itr;
      }else{
        entityMap[k]=itr;
      }
      itr++
    });
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
}

function getEntityColor(entity){
  if(typeof colorScale=='string'){
    return colorScale;//only one color
  }
  return colorScale(entityMap[entity]);
}
