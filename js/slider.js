var html5Slider;
var prevStartYear=getStartyr(), prvEndYear=getEndYr();

function addSlider(){
  prevStartYear=getStartyr(); prvEndYear=getEndYr();
  html5Slider = document.getElementById('noUiSlider');
  noUiSlider.create(html5Slider, {
      	start: [ 2015, 2016 ],
      	connect: true,
      	range: {
      		'min': 1972,
      		'max': 2016
      	},
        step:1,
        width:100,
        tooltips: true,
      });
      html5Slider.noUiSlider.on('update', function( values, handle ) {
      	var value = values[handle];
      	if ( handle ) {
          $('#endyr').val(Math.round(value));
      	} else {
          $('#startyr').val(Math.round(value));
      	}
        if(ready){
          //groupUpdates();//12
        }
      });

      $('#startyr').on('input', function ( ) {
        var newVal=Number(this.value);
        if(newVal>=1972 && newVal<2017){
          prevStartYear=newVal;
          html5Slider.noUiSlider.set([newVal, getEndYr()]);
          groupUpdates();
        }
      });
      $('#endyr').on('input', function ( ) {
        var newVal=Number(this.value);
        if(newVal>=1972 && newVal<2017){
          prevStartYear=newVal;
          html5Slider.noUiSlider.set([getStartyr(), newVal]);
          groupUpdates();
        }
      });
}

function getStartyr(){
  return Number($('#startyr').val());
}
function getEndYr(){
  return Number($('#endyr').val());
}

function setStartyr(yr){
  $('#startyr').val(Math.round(Number(yr)));
  html5Slider.noUiSlider.set([getStartyr(), getEndYr()]);
}

function setEndyr(yr){
  $('#endyr').val(Math.round(Number(yr)));
  html5Slider.noUiSlider.set([getStartyr(), getEndYr()]);
}
