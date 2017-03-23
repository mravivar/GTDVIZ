function addSlider(){
  var html5Slider = document.getElementById('noUiSlider');
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
      		//inputNumber.value = value;
          $('#endyr').val(Math.round(value));
      	} else {
          $('#startyr').val(Math.round(value));
      		//select.value = Math.round(value);
      	}
      });
}
