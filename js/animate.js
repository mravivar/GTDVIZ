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
    var maxYear=getThemeRiverEndyr();
    var id = setInterval(frame, getTimeInterval()*1000);
    function frame() {
        setWindowLineStye(startline, yearPosMap[startyr]);
        setWindowLineStye(endline, yearPosMap[endyr]);
        setWindowStartEndyrs(startyr, endyr);
        progressBar.set(.10);
        partialUpdate(startyr, endyr);

        if (endyr>=maxYear || !playing) {
            clearInterval(id);
            setPlayIcon();
            playing=false;
        } else {
            startyr++;
            endyr++;
        }

    }
}
