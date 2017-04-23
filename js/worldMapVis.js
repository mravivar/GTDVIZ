var groupUpdates, updateWorldMapPoints;
var category = 'gname';
var selectedAttribute = ["Unknown"];
var path, projection, countries, events, circlesSVG, backup_data, panCanvas;
//hoover variables
var oldCircle,oldColor;
var totalWidth;
var totalHeight;
var hoveredEventid;

function init(){
	d3.demo = {};

d3.demo = {};
d3.demo.canvas = function() {

    "use strict";

    var _width           = document.getElementById('worldMap').clientWidth*0.98,
        _height          = document.getElementById('worldMap').clientHeight - 35,
        zoomEnabled     = true,
        dragEnabled     = true,
        scale           = 1,
        translation     = [0,0],
        base            = null,
        wrapperBorder   = 1,
        minimap         = null,
        minimapPadding  = 20,
        minimapScale    = 0.25,
        nodes           = [],
        circles         = [],
        rectW           = 50,
        rectH           = 20;

    function canvas(selection) {

        base = selection;

        var xScale = d3.scale.linear()
            .domain([-_width / 2, _width / 2])
            .range([0, _width]);

        var yScale = d3.scale.linear()
            .domain([-_height / 2, _height / 2])
            .range([_height, 0]);

        var zoomHandler = function(newScale) {
            if (!zoomEnabled) { return; }
            if (d3.event) {
                scale = d3.event.scale;
            } else {
                scale = newScale;
            }
            if (dragEnabled) {
                var tbound = -_height * scale,
                    bbound = _height  * scale,
                    lbound = -_width  * scale,
                    rbound = _width   * scale;
                // limit translation to thresholds
                translation = d3.event ? d3.event.translate : [0, 0];
                translation = [
                    Math.max(Math.min(translation[0], rbound), lbound),
                    Math.max(Math.min(translation[1], bbound), tbound)
                ];
            }

            d3.select(".panCanvas, .panCanvas .bg")
                .attr("transform", "translate(" + translation + ")" + " scale(" + scale + ")");

            minimap.scale(scale).render();
        }; // startoff zoomed in a bit to show pan/zoom rectangle

        var zoom = d3.behavior.zoom()
            .x(xScale)
            .y(yScale)
            .scaleExtent([0.5, 50])
            .on("zoom.canvas", zoomHandler);

        var svg = selection.append("svg")
            .attr("class", "svg canvas")
            .attr("width",  _width  + (wrapperBorder*2) + minimapPadding*2 + (_width*minimapScale))
            .attr("height", _height + (wrapperBorder*2) + minimapPadding*2)
            .attr("shape-rendering", "auto");
        svg.append("text").attr({
            x: totalWidth*58,
            y:totalHeight*15,
        }).attr("font-weight", 'bold')
            .attr({
                'data-toggle':"tooltip",
                'title':"Legend for world map",
            })
        .text(function () {
            return "# killings: 1.19 people per pixel";
        })
        /*
        svg.append("svg")
            .attr({
                x: totalWidth*58,
                y:totalHeight*17,
            }).attr("id", "progressBar1")
            .attr("height", totalHeight*2)
            .attr("width", totalWidth*15)
*/
        //below code is from http://progressbarjs.readthedocs.io/en/latest/#full-examples
        progressBar = new ProgressBar.Line('#progressBar1', {
                strokeWidth: 5,
                easing: 'easeInOut',
                duration: 700,
                trailColor: '#eee',
                trailWidth: 1,
                svgStyle: {width: totalWidth*22, height:'2%', 'padding-left': totalWidth*8},
                text: {
                    style: {
                        // Text color.
                        // Default: same as stroke color (options.color)
                        color: 'black',
                        position: 'absolute',
                        right: '0',
                        top: '0',
                        padding: 0,
                        margin: 0,
                        transform: null,
                        'font-weight':'bold',
                    },
                    autoStyleContainer: false
                },
                color: 'black',
                from: {color: '#bdc9e1', a:0},
                to: {color: '#045a8d', a:1},
                step: (state, bar) => {
                bar.path.setAttribute('stroke', state.color);
                bar.setText(Math.round(bar.value() * 100) + ' %');
            }
        });

        var svgDefs = svg.append("defs");

        svgDefs.append("clipPath")
            .attr("id", "wrapperClipPathDemo01")
            .attr("class", "wrapper clipPath")
            .append("rect")
            .attr("class", "background")
            .attr("width", _width)
            .attr("height", _height);

        svgDefs.append("clipPath")
            .attr("id", "minimapClipPath")
            //.attr("class", "minimap clipPath")
            .attr("width", _width)
            .attr("height", _height)
            .attr("transform", "translate(" + (_width + minimapPadding) + "," + (minimapPadding/2) + ")")
            .append("rect")
            .attr("class", "background")
            .attr("width", _width)
            .attr("height", _height);

        var filter = svgDefs.append("svg:filter")
            .attr("id", "minimapDropShadow")
            .attr("x", "-20%")
            .attr("y", "-20%")
            .attr("width", "150%")
            .attr("height", "150%");

        filter.append("svg:feOffset")
            .attr("result", "offOut")
            .attr("in", "SourceGraphic")
            .attr("dx", "1")
            .attr("dy", "1");

        filter.append("svg:feColorMatrix")
            .attr("result", "matrixOut")
            .attr("in", "offOut")
            .attr("type", "matrix")
            .attr("values", "0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.1 0 0 0 0 0 0.5 0");

        filter.append("svg:feGaussianBlur")
            .attr("result", "blurOut")
            .attr("in", "matrixOut")
            .attr("stdDeviation", "10");

        filter.append("svg:feBlend")
            .attr("in", "SourceGraphic")
            .attr("in2", "blurOut")
            .attr("mode", "normal");

        var minimapRadialFill = svgDefs.append("radialGradient")
            .attr({
                id:"minimapGradient",
                gradientUnits:"userSpaceOnUse",
                cx:"500",
                cy:"500",
                r:"400",
                fx:"500",
                fy:"500"
            });
        minimapRadialFill.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#FFFFFF");
        minimapRadialFill.append("stop")
            .attr("offset", "40%")
            .attr("stop-color", "#EEEEEE");
        minimapRadialFill.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#E0E0E0");

        var outerWrapper = svg.append("g")
            .attr("class", "wrapper outer")
            .attr("transform", "translate(0, " + minimapPadding + ")");

        outerWrapper.append("rect")
            .attr("class", "background")
            .attr("width", _width + wrapperBorder*2)
            .attr("height", _height + wrapperBorder*2);

        var innerWrapper = outerWrapper.append("g")
            .attr("class", "wrapper inner")
            .attr("clip-path", "url(#wrapperClipPathDemo01)")
            .attr("transform", "translate(" + (wrapperBorder) + "," + (wrapperBorder) + ")")
            .call(zoom);

        innerWrapper.append("rect")
            .attr("class", "background")
            .attr("width", _width)
            .attr("height", _height);

        panCanvas = innerWrapper.append("g")
            .attr("class", "panCanvas")
            .attr("width", _width)
            .attr("height", _height)
            .attr("transform", "translate(0,0)");

        panCanvas.append("rect")
            .attr("class", "background")
            .attr("width", _width)
            .attr("height", _height);

        minimap = d3.demo.minimap()
            .zoom(zoom)
            .target(panCanvas)
            .minimapScale(minimapScale)
            .x(_width + minimapPadding)
            .y(minimapPadding);

        svg.call(minimap);

        // startoff zoomed in a bit to show pan/zoom rectangle
        zoom.scale(1.5);
        zoomHandler(1);

        /** ADD SHAPE **/
        canvas.addItem = function(item) {
            panCanvas.node().appendChild(item.node());
            minimap.render();
        };

        canvas.loadTree = function() {
			//----------------------------------------------------------------------------
	queue()
    .defer(d3.json, "../data/world-countries.topojson")
	.await(ready)
	//.defer(d3.csv, "../data/capitals1.csv")
    //.await(ready)

			//function ready(error,data,capitals) {
			function ready(error,data) {

				//console.log(data);
				var height = _height;
				var width = _width;
				//var margin = {top: 20, right: 50, bottom: 30, left: 30};
				countries = topojson.feature(data, data.objects.countries1).features
				//console.log(countries)
				projection = d3.geo.mercator()
									.translate([width/2,height/2])
									.scale(60)

				path = d3.geo.path()
								.projection(projection)

				panCanvas.selectAll(".country")
					.data(countries)
					.enter().append("path")
					.attr("class", "country")
					.attr("d",path)
					groupUpdates();
   			       function highlightParrallelCoordinate(countryName, orgName){
   			       for(var i=0;i<countryData.length;i++){
   			         if(countryData[i].country_txt==countryName){
   			           console.log(countryData[i]);
   			           countryParcoords.highlight([countryData[i]]);
   			           break;
   			         }
   			       }
   			       for(var i=0;i<orgData.length;i++){
   			         if(orgData[i].gname==orgName){
   			           console.log(orgData[i]);
   			           orgParcoords.highlight([orgData[i]]);
   			           break;
   			         }
   			       }
   			     }
			}
		}


		//this fuction gets the events from the DB and updates world map,parallelCords and details view
		groupUpdates=function(){

          if(startline)
          startline.style("left",  0+ "px" );
          if(endline)
          endline.style("left",  0+ "px" );
          if(selectedAttribute.length==0)
              return;
          updateEntity(selectedAttribute);
		//buildquery here
		  $.ajax({
		      url: 'plotSelectedData',
		      type:"GET",
		      dataType: "json",
		      data: {
		        startyr:$('#startyr').val(),
		        endyr:$('#endyr').val(),
                cat: category,
                attr:selectedAttribute
		      },
		      success: function(data) {
				//clearThemeRiver();
				//themeriver();
                  backup_data=data;
                  setNumberOfDocuments(data.length);
                  progressBar.animate(.25)
                clearThemeRiver();
                  progressBar.animate(.50);
		        loadDataIntoDetailsView(data);
                  progressBar.animate(.65);
		        updateParallelCordsEvents(data);
                  progressBar.animate(.85);
		        updateWorldMapPoints([]);
		        updateWorldMapPoints(data);
		        progressBar.animate(1)
		      },
		      error: function(jqXHR, textStatus, errorThrown) {
		          console.log('error ' + textStatus + " " + errorThrown);
		      }
		  });
		};

        updateWorldMapPoints=function(data){
            setNumDocsWorld(data.length);
		    var maxy=1500;
		     var rvalue = d3.scale.sqrt()
		          .domain([0,maxy])
		           .range([1,20]);
		    //bind data
		    events=panCanvas.selectAll("circle").data(data);
		    //enter + update
		    circlesSVG=events.enter().append("svg:circle")
		        .attr("r",function(d){
		          return rvalue(d.nkill);
		        })
		    .attr("cx",function(d){
		        var coords = projection([d.longitude, d.latitude]);
		        return coords[0];
		    })
		    .attr("cy",function(d){
		        var coords = projection([d.longitude, d.latitude]);
		        return coords[1];
		     })
		     .on('mouseover', function(d){
		        //d3.select(this).classed("selected", true);
		        if(oldColor){
                    oldCircle.style('fill', oldColor);
                    oldColor.style('opacity', 0.3);
                    oldColor=null;
                }
		        var newCircle=d3.select(this);
		        //copy its properties
                oldCircle=newCircle;
                oldColor=oldCircle.style('fill');
                newCircle.style('fill','black');
                newCircle.style('opacity',1);

		        //highlight parallelCords
		        gtdParacords.highlight([d]);
		        var rowId=dataView.getRowById(d.eventid);
                 hoveredEventid=d.eventid;
                 grid.scrollRowToTop(rowId);
                 grid.getColumns().forEach(function(col){
                     grid.flashCell(rowId, grid.getColumnIndex(col.id));
                 })

                //dataView.updateItem(d.eventid, dataView.getItem(rowId));
		      })
		      .on('mouseout', function(d){
                  if(oldColor){
                      oldCircle.style('fill', oldColor);
                      oldCircle.style('opacity', 0.3);
                      oldColor=null;
                  }
                  hoveredEventid=null;
		        //d3.select(this).classed("selected", false);
		        gtdParacords.unhighlight();
		      }).style("fill", function(d, i) {
		          if(pcSelectedAttribute){
                      getSyncedColor(d);
                  }
                return getEntityColor(d[category]);
            });
		     //remove elements
		    events.exit().remove();
            oldColor=null;
		};

        /** RENDER **/
        canvas.render = function() {
            svgDefs
                .select(".clipPath .background")
                .attr("width", _width)
                .attr("height", _height);

            svg
                .attr("width",  _width  + (wrapperBorder*2) + minimapPadding*2 + (_width*minimapScale))
                .attr("height", _height + (wrapperBorder*2));

            outerWrapper
                .select(".background")
                .attr("width", _width + wrapperBorder*2)
                .attr("height", _height + wrapperBorder*2);

            innerWrapper
                .attr("transform", "translate(" + (wrapperBorder) + "," + (wrapperBorder) + ")")
                .select(".background")
                .attr("width", _width)
                .attr("height", _height);

            panCanvas
                .attr("width", _width)
                .attr("height", _height)
                .select(".background")
                .attr("width", _width)
                .attr("height", _height);

            minimap
                .x(_width + minimapPadding)
                .y(minimapPadding)
                .render();
        };

        canvas.zoomEnabled = function(isEnabled) {
            if (!arguments.length) { return zoomEnabled; }
            zoomEnabled = isEnabled;
        };

        canvas.dragEnabled = function(isEnabled) {
            if (!arguments.length) { return dragEnabled; }
            dragEnabled = isEnabled;
        };

        canvas.reset = function() {
            d3.transition().duration(750).tween("zoom", function() {
                var ix = d3.interpolate(xScale.domain(), [-_width  / 2, _width  / 2]),
                    iy = d3.interpolate(yScale.domain(), [-_height / 2, _height / 2]),
                    iz = d3.interpolate(scale, 1);
                return function(t) {
                    zoom.scale(iz(t)).x(x.domain(ix(t))).y(y.domain(iy(t)));
                    zoomed(iz(t));
                };
            });
        };

		canvas.reset1 = function() {
                svg.call(zoom.event);
                zoom.scale(1);
                zoom.translate([0,0]);
                svg.transition().duration(750).call(zoom.event);
            };
    }


    //============================================================
    // Accessors
    //============================================================


    canvas.width = function(value) {
        if (!arguments.length) return _width;
        _width = parseInt(value, 10);
        return this;
    };

    canvas.height = function(value) {
        if (!arguments.length) return _height;
        _height = parseInt(value, 10);
        return this;
    };

    canvas.scale = function(value) {
        if (!arguments.length) { return scale; }
        scale = value;
        return this;
    };

    canvas.nodes = function(value) {
        if (!arguments.length) { return nodes; }
        nodes = value;
        return this;
    };

    return canvas;
};




/** MINIMAP **/
d3.demo.minimap = function() {

    "use strict";

    var minimapScale    = 0.1,
        scale           = 1,
        zoom            = null,
        base            = null,
        target          = null,
        width           = 0,
        height          = 0,
        x               = 0,
        y               = 0,
        frameX          = 0,
        frameY          = 0;

    function minimap(selection) {

        base = selection;

        var container = selection.append("g")
            .attr("class", "minimap")
            .call(zoom);

        zoom.on("zoom.minimap", function() {
            scale = d3.event.scale;
        });


        minimap.node = container.node();

        var frame = container.append("g")
            .attr("class", "frame");

        frame.append("rect")
            .attr("class", "background")
            .attr("width", width)
            .attr("height", height)
            .attr("filter", "url(#minimapDropShadow)");

        var drag = d3.behavior.drag()
            .on("dragstart.minimap", function() {
                var frameTranslate = d3.demo.util.getXYFromTranslate(frame.attr("transform"));
                frameX = frameTranslate[0];
                frameY = frameTranslate[1];
            })
            .on("drag.minimap", function() {
                d3.event.sourceEvent.stopImmediatePropagation();
                frameX += d3.event.dx;
                frameY += d3.event.dy;
                frame.attr("transform", "translate(" + frameX + "," + frameY + ")");
                var translate =  [(-frameX*scale),(-frameY*scale)];
                target.attr("transform", "translate(" + translate + ")scale(" + scale + ")");
                zoom.translate(translate);
            });

        frame.call(drag);

        /** RENDER **/
        minimap.render = function() {
            scale = zoom.scale();
            container.attr("transform", "translate(" + x + "," + y + ")scale(" + minimapScale + ")");
            var node = target.node().cloneNode(true);
            node.removeAttribute("id");
            base.selectAll(".minimap .panCanvas").remove();
            minimap.node.appendChild(node);
            var targetTransform = d3.demo.util.getXYFromTranslate(target.attr("transform"));
            frame.attr("transform", "translate(" + (-targetTransform[0]/scale) + "," + (-targetTransform[1]/scale) + ")")
                .select(".background")
                .attr("width", width/scale)
                .attr("height", height/scale);
            frame.node().parentNode.appendChild(frame.node());
            d3.select(node).attr("transform", "translate(1,1)");
        };
    }


    //============================================================
    // Accessors
    //============================================================


    minimap.width = function(value) {
        if (!arguments.length) return width;
        width = parseInt(value, 10);
        return this;
    };


    minimap.height = function(value) {
        if (!arguments.length) return height;
        height = parseInt(value, 10);
        return this;
    };


    minimap.x = function(value) {
        if (!arguments.length) return x;
        x = parseInt(value, 10);
        return this;
    };


    minimap.y = function(value) {
        if (!arguments.length) return y;
        y = parseInt(value, 10);
        return this;
    };


    minimap.scale = function(value) {
        if (!arguments.length) { return scale; }
        scale = value;
        return this;
    };


    minimap.minimapScale = function(value) {
        if (!arguments.length) { return minimapScale; }
        minimapScale = value;
        return this;
    };


    minimap.zoom = function(value) {
        if (!arguments.length) return zoom;
        zoom = value;
        return this;
    };


    minimap.target = function(value) {
        if (!arguments.length) { return target; }
        target = value;
        width  = parseInt(target.attr("width"),  10);
        height = parseInt(target.attr("height"), 10);
        return this;
    };

    return minimap;
};



/** UTILS **/
d3.demo.util = {};
d3.demo.util.getXYFromTranslate = function(translateString) {
    var split = translateString.split(",");
    var x = split[0] ? ~~split[0].split("(")[1] : 0;
    var y = split[1] ? ~~split[1].split(")")[0] : 0;
    return [x, y];
};


var circleCount = 0;
var canvas = d3.demo.canvas();
d3.select("#worldMap").call(canvas);


d3.select("#resetButton").on("click", function() {
        canvas.reset1();
    });

canvas.loadTree();

}

function partialUpdate(cur_startyr, cur_endyr){
    //buildquery here
    $.ajax({
        url: 'plotSelectedData',
        type:"GET",
        dataType: "json",
        data: {
            startyr:cur_startyr,
            endyr:cur_endyr,
            cat: category,
            attr:selectedAttribute
        },
        success: function(data) {
            //clearThemeRiver();
            //themeriver();
            progressBar.animate(.3);
            loadDataIntoDetailsView(data);
            progressBar.animate(.6);
            updateParallelCordsEvents(data);
            progressBar.animate(.8);
            updateWorldMapPoints([]);
            updateWorldMapPoints(data);
            progressBar.animate(1);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('error ' + textStatus + " " + errorThrown);
        }
    });

}
