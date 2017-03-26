var playing=false;
var startyr = 1972, endyr=startyr;
function play() {
    if(playing){
      playing=false;
      $('#playbut').html('Play!');
      return;
    }
    playing=true;
    $('#playbut').html('Pause');
    setStartyr(startyr);
    setEndyr(endyr);
    var id = setInterval(frame, Number($("#timeinterval option:selected" ).text())*1000);
    function frame() {
        if (getEndYr()==2016 || !playing) {
            clearInterval(id);
            $('#playbut').html('Play!');
            playing=false;
        } else {
          startyr++;
          endyr++;
          setStartyr(startyr);
          setEndyr(endyr);
          groupUpdates();
        }
    }
}
