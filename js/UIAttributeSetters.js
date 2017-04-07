/**
 * Created by Aravind on 4/6/2017.
 */
function setWindowStartEndyrs(startyr, endyr){
    if(startyr){
        window_startyr=startyr
        $('#window_startyr').html(window_startyr)
    }
    if(endyr){
        window_endyr=endyr;
        $('#window_endyr').html(window_endyr);
    }
}

function setWindowArrowDirection(style_direction){
    $('#window_arrow').removeClass();
    $('#window_arrow').addClass(style_direction)
}

function setWindowLineStye(line, mousex) {
    line.style("left",  mousex+margin.left+10 +"px" );
    //line.style("top", $("#themeriver").offset().top+"px")
}

function getTimeInterval(){
    return Number($("#timeinterval option:selected").text().split(' ')[0])
}

function getWindowYear(){
    return Number($("#yearterval option:selected").text().split(' ')[0])
}