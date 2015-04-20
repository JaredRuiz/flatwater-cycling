"use strict"

// TODO: figure out how to include file...browserify???

function MapLine() { };

////////////////////////////////////////////////////////////////////////////////
// public
MapLine.prototype.drawLine = function(data, scaleMeasure) {
  return this._drawLine(data, scaleMeasure);
};

//////////////////////////////////////
// private

MapLine.prototype._drawLine = function(dataPoints, scaleMeasure) {
  var finalLine = [];
  
  for (var j = 0, max = dataPoints.length; j < max-1; j++) {

    // determine scale for this set of data points
    var scale = this._determineScale(dataPoints[j], dataPoints[j+1], scaleMeasure),
          // make a line between long/lat of points
          line = this._combinePointsIntoLine(dataPoints[j], dataPoints[j+1]),
          // make two new lines, both parallel to line, both lines at a distance
          // of scale
          pLines = this._makeParallelLines(line, scale),
          // turn those two lines into a polygon
          polygon = [
            pLines.aboveLine.tail,
            pLines.aboveLine.head,
            pLines.belowLine.tail,
            pLines.belowLine.head
          ];

    finalLine.push( { polygon: polygon, scale: scale } );
  }

  return finalLine;
};

MapLine.prototype._combinePointsIntoLine = function(point1, point2) {
  return {
    tail: { x: point1.lat, y: point1.lon },
    head: { x: point2.lat, y: point2.lon }
  };
};

MapLine.prototype._determineScale = function(point1, point2, scaleFactor) {
  
  var scale;

  if (scaleFactor === 'speed') {

      ///////////////////////////////////////
      // Haversine function logic:
      var ldPoint = point1;
      var oldTime = new Date();
      oldTime.setHours(ldPoint.hour, ldPoint.minute, ldPoint.second);
      var newTime = new Date();
      var dPoint = point2;
      newTime.setHours(dPoint.hour, dPoint.minute, dPoint.second);

      // divide by 1000 for ms --> s and by for s --> min
      var time = ((newTime.getTime() - oldTime.getTime())/(1000*60));

      // constant to convert haversine to miles
      var R = 3958.755866; 

      var dLat = this.makeRad(point2.lat-point1.lat);
      var dLon = this.makeRad(point2.lon-point1.lon);
      var lat1 = this.makeRad(point1.lat);
      var lat2 = this.makeRad(point2.lat);

      // var dLat = tmakeRad(point2.lat-point1.lat);
      // var dLon = makeRad(point2.lon-point1.lon);
      // var lat1 = makeRad(point1.lat);
      // var lat2 = makeRad(point2.lat);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      var speed = d/time;
      ///////////////////////////////////////////////////////
    
    scale = speed;
  }

  return scale;
};

MapLine.prototype._makeParallelLines = function(line, scale) {
  // shift line to origin
  var shiftedLine = this._shiftLineToOrigin(line),
        // convert head of shifted line to polar coordinates
        polarCoord = this.makePolarPointFromCartesian(shiftedLine.head),
        // scale polarCoord by scale and rotate by pi/2
        abovePolar = this.getAbovePoint(polarCoord, scale),
        // scale polarCoord by scale and rotate by -pi/2
        belowPolar = this.getBelowPoint(polarCoord, scale),
        // convert polar coordinates back to cartesian
        abovePoint = this.makeCartesianPointFromPolar(abovePolar),
        belowPoint = this.makeCartesianPointFromPolar(belowPolar);
  
  return {
    aboveLine: {
                        tail: this.addPoints(abovePoint, line.tail),
                        head: this.addPoints(abovePoint, line.head)
                      },
    belowLine: {
                        tail: this.addPoints(belowPoint, line.tail),
                        head: this.addPoints(belowPoint, line.head)
                      }
  };
};

MapLine.prototype._shiftLineToOrigin = function(line) {
  return { tail: { x: 0, y: 0 },
                head: { x: this.shiftCoordsToOrigin(line.tail, line.head, 'x'),
                            y: this.shiftCoordsToOrigin(line.tail, line.head, 'y')
                      }
         };
};

MapLine.prototype.shiftCoordsToOrigin = function(p1, p2, part) {
  return p2[part] - p1[part];
};

MapLine.prototype.addPoints = function(p1, p2) {
  return {
    x: p1.x + p2.x,
    y: p1.y+p2.y
  };
};

////////////////////////////
/////////////////
/////// Math and Geometry functions

MapLine.prototype.makeCartesianPointFromPolar = function(point) {
  return { 
    x: point.r*this.cos(point.theta),
    y: point.r*this.sin(point.theta)
  };
};

MapLine.prototype.makePolarPointFromCartesian = function(point) {
  var origin = { x: 0, y: 0},
        r = this.dist(origin, point),
        polarPoint;

  if (r !== 0) {
    polarPoint = this.plotPolarPoint(r, this.acos(point.x/r));
  } else {
    polarPoint = { r: 0, theta: 0 };
  }
  return polarPoint;
};

MapLine.prototype.plotPolarPoint = function(r, theta) {
  return { r: r, theta: theta };
};

// TODO figure out the pi stuff here...
MapLine.prototype.getAbovePoint = function(polarPoint, scaleFactor) {
  var scale = scaleFactor ? scaleFactor : 1;
  return this.plotPolarPoint(scale*polarPoint.r, polarPoint.theta+this.pi()/2);
};

MapLine.prototype.getBelowPoint = function(polarPoint, scaleFactor) {
  var scale = scaleFactor ? scaleFactor : 1;
  return this.plotPolarPoint(scale*polarPoint.r, polarPoint.theta-this.pi()/2);
};

MapLine.prototype.dist = function(p1, p2) { 
  return Math.sqrt(
    Math.pow(this.shiftCoordsToOrigin(p1, p2, 'x'), 2) + 
    Math.pow(this.shiftCoordsToOrigin(p1, p2, 'y'), 2));
};

MapLine.prototype.makeRad = function(num) {
  num = parseFloat(num).toFixed(4);
  num = (num === "-0.0000") ? "0.0000" : num;
  return parseFloat(num);
};

// TODO it would be good to pull these out into another class...
MapLine.prototype.cos = function(a) {
  return this.makeRad(Math.cos(a));
};

MapLine.prototype.sin = function(a) {
  return this.makeRad(Math.sin(a));
};

MapLine.prototype.pi = function() { return this.makeRad(Math.PI) };

// this always gives a number between [0, pi]
MapLine.prototype.acos = function(a) {
  return this.makeRad(Math.acos(a));
};

// exports.MapLine = MapLine;
