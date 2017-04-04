var playing=false;
var startyr = 1972, endyr=startyr+2;
function play() {
    if(playing){
      playing=false;
      $('#playbut').html('Play!');
      return;
    }
    playing=true;
    $('#playbut').html('Pause');
    if($('#preserveStart').is(':checked')){
        setStartyr(startyr);
        setEndyr(endyr);
    }else{
        startyr=getStartyr();
        endyr=getEndYr();
    }

    var id = setInterval(frame, Number($("#timeinterval option:selected" ).text())*1000);
    function frame() {
        if (getEndYr()==2015 || !playing) {
            clearInterval(id);
            $('#playbut').html('Play!');
            playing=false;
        } else {
          startyr++;
          endyr++;
          setStartyr(startyr);
          setEndyr(endyr);
          clearThemeRiver()
          //updateThemeRiver();

          groupUpdates();
        }
    }
}
