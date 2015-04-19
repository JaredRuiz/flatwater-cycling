"use strict"

// TODO: figure out how to include file...browserify???

function MapLine() { };

////////////////////////////////////////////////////////////////////////////////
// public
MapLine.prototype.drawLine = function(data, scaleMeasure) {
  return this._drawLine(data, scaleMeasure);
};

MapLine.prototype._drawLine = function(dataPoints, scaleMeasure) {

  var finalLine = [];
  
  for (var j = 0, max = dataPoints.length; j < max-1; j++) {

    // determine scale for this set of data points
    var scale = determineScale(dataPoints[j], dataPoints[j+1], scaleMeasure),
          // make a line between long/lat of points
          line = this._combinePointsIntoLine(dataPoints[j], dataPoints[j+1]),
          // make two new lines, both parallel to line, both lines at a distance
          // of scale
          pLines = this._makeParallelLines(line),
          // turn those two lines into a polygon
          polygon = [pLines.aboveLine.tail,
                            pLines.aboveLine.head,
                            pLines.belowLine.tail,
                            pLines.belowLine.head
                    ];

    finalLine.push( { polygon: polygon, scale: scale } );
  }

  return finalLine;
};

MapLine.prototype._makeParallelLines = function(line, scale) {
  // shift line to origin
  var shiftedLine = this._shiftLineToOrigin(line),
        // convert tail of shifted line to polar coordinates
        polarCoord = makePolarPointFromCartesian(shiftedLine.head),
        // scale polarCoord by scale and rotate by 90 degrees counter-clockwise
        abovePoint = getAbovePoint(polarCoord, scale),
        // scale polarCoord by scale and rotate by 90 degrees clockwise
        belowPoint = getBelowPoint(polarCoord, scale);

  return {
    aboveLine: drawParallelLineByPoint(line, abovePoint),
    belowLine: drawParallelLineByPoint(line, belowPoint),
  };
};

MapLine.prototype._shiftLineToOrigin = function(line) {
  return { tail: shiftCoordsToOrigin(line.tail, line.head, 'x'),
                head: shiftCoordsToOrigin(line.tail, line.head, 'y')
         };
};

var shiftCoordsToOrigin = function(p1, p2, part) {
  return p2[part] - p1[part];
};


var addPoints = function(p1, p2) {
  return {
    x: p1.x + p2.x,
    y: p1.y+p2.y
  };
};

////////////////////////////
/////////////////
/////// Math and Geometry functions


var makePolarPointFromCartesian = function(point) {
  var origin = { x: 0, y: 0},
        r = distance(origin, point);

  return plotPolarPoint(r, arcCos(point.x/r));
};

var plotPolarPoint = function(r, theta) {
  return { r: r, theta: theta };
};

// TODO figure out the pi stuff here...
var getAbovePoint = function(polarPoint, scaleFactor) {
  var scale = scaleFactor ? scaleFactor : 1;
  return plotPolarPoint(scale*polarPoint.r, polarPoint.theta+pi/2);
};

var getBelowPoint = function(polarPoint, scaleFactor) {
  var scale = scaleFactor ? scaleFactor : 1;
  return plotPolarPoint(scale*polarPoint.r, polarPoint.theta-pi/2);
};


// helper functions
var makeRad = function(num) { return parseFloat(num).toFixed(5); }

var dist = function(p1, p2) { 
  return Math.sqrt(
    Math.pow(shiftCoordsToOrigin(p1, p2, 'x'), 2) + 
    Math.pow(shiftCoordsToOrigin(p1, p2, 'y'), 2));
};



