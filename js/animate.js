var playing=false;
function play() {

    var startyr,
        endyr;
    if(playing){
      playing=false;
      setPlayIcon();
      return;
    }
    playing=true;
    setPauseIcon();
    if($('#preserveStart').is(':checked')){
        startyr=window_startyr;
    }else{
        startyr=xTM.ticks()[0].getFullYear();
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

        if (endyr>=xTM.ticks()[xTM.ticks().length-1].getFullYear() || !playing) {
            clearInterval(id);
            setPlayIcon();
            playing=false;
        } else {
            startyr++;
            endyr++;
        }

    }
}
