var html5Slider;
var prevStartYear=getStartyr(), prvEndYear=getEndYr();

function addSlider(){
  prevStartYear=getStartyr(); prvEndYear=getEndYr();
  html5Slider = document.getElementById('noUiSlider');
  noUiSlider.create(html5Slider, {
        start: [ 2013, 2015 ],
        connect: true,
        behaviour: "hover-snap",
      orientation: 'horizontal',
        range: {
            'min': 1970,
            'max': 2015
        },
        step:1,
        width:100,
        tooltips: true,
      });
  var i=1;
    html5Slider.noUiSlider.on('hover', function( value ){
        html5Slider.setAttribute('title',value);
    });
      html5Slider.noUiSlider.on('update', function( values, handle ) {
      	var value = values[handle];
      	if ( handle ) {
          $('#endyr').val(Math.round(value)).trigger("input");
      	} else {
          $('#startyr').val(Math.round(value)).trigger("input");
      	}

      });

      $('#startyr').on('input', function ( ) {
        var newVal=Number(this.value);
        if(newVal>=1970 && newVal<2017){
          prevStartYear=newVal;
            groupUpdates();
            clearThemeRiver();
        }
      });
      $('#endyr').on('input', function ( ) {
        var newVal=Number(this.value);
        if(newVal>=1970 && newVal<2017){
          prevStartYear=newVal;
          //html5Slider.noUiSlider.set([getStartyr(), newVal]);
          groupUpdates();
          clearThemeRiver();
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
