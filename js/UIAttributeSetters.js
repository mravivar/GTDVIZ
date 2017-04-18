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
function setPlayIcon(){
    $('#playbutIcon').removeClass();
    $('#playbutIcon').addClass(PLAY_ICON);
}
function setPauseIcon(){
    $('#playbutIcon').removeClass();
    $('#playbutIcon').addClass(PAUSE_ICON)
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

function setNumberOfDocuments(numEvents){
    setValue('numberofDocsTheme', numEvents)
}

function setNumDocsPC(numEvents){
    setValue('numberofDocsPC', numEvents)
}

function setNumDocsWorld(numEvents){
    setValue('numberofDocsWorld', numEvents)
}

function setValue(id, value){
    $(('#'+id)).val(value);
}

function loadTheEventIntoThedialog(event){
    $('#individualDetailsDiv').html()
    delete event['_id']
    for(key in event){
        if((event[key]+'').length>0 && event[key]!='.'){
            var str='<b>'+key+'</b>:'+event[key]+"<br\>";
            $('#individualDetailsDiv').html($('#individualDetailsDiv').html()+str);
        }
    }
}