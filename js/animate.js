var playing=false;
function play() {
    xAxis.tickSize()
    var startyr,
        endyr;
    if(playing){
      playing=false;
      $('#playbut').html('Play!');
      return;
    }
    playing=true;
    $('#playbut').html('Pause');
    if($('#preserveStart').is(':checked')){
        startyr=window_startyr;
    }else{
        startyr=x.ticks()[0].getFullYear();
        //setStartyr(startyr);
        //setEndyr(endyr);
    }
    endyr=startyr+getWindowYear();
    var id = setInterval(frame, getTimeInterval()*1000);
    function frame() {
        setWindowLineStye(startline, yearPosMap[startyr]);
        setWindowLineStye(endline, yearPosMap[endyr]);
        setWindowStartEndyrs(startyr, endyr);
        partialUpdate(startyr, endyr);

        if (endyr>=x.ticks()[x.ticks().length-1].getFullYear() || !playing) {
            clearInterval(id);
            $('#playbut').html('Play!');
            playing=false;
        } else {
            startyr++;
            endyr++;
        }

    }
}
