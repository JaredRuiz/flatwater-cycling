"use strict"

function MapLine() {};

////////////////////////////////////////////////////////////////////////////////
// public
MapLine.prototype.process = function(linePoints, speedPoints) {
  return this._process(linePoints, speedPoints);
};

// TODO it would be good to pull these out into another class...
MapLine.prototype.makeRad = function(num) {
  var fourDecimalFloat = parseFloat(num).toFixed(4),
        finalFloat = (fourDecimalFloat === "-0.0000") ? "0.0000" : fourDecimalFloat;
  return finalFloat;
};

MapLine.prototype.cos = function(a) {
  return this.makeRad(Math.cos(a));
};

MapLine.prototype.acos = function(a) {
  var tempRad = this.makeRad(Math.acos(a));
  if (tempRad >= 2*this.pi) {
    tempRad = this.acos(tempRad + 2*this.pi);
  } else if (tempRad < 0) {
    tempRad = this.acos(tempRad - 2*this.pi);
  }
  return tempRad;
};

MapLine.prototype.sin = function(a) {
  return this.makeRad(Math.sin(a));
};

MapLine.prototype.asin = function(a) {
  return this.makeRad(Math.asin(a));
};

MapLine.prototype.pi = function() { 
  return this.makeRad(Math.PI) 
};

// helper functions for shifting points
MapLine.prototype.c = function(p1, p2, idx) { return p2[idx] - p1[idx]; }
MapLine.prototype.xc = function(p1, p2) { return c(p1, p2, 0); };
MapLine.prototype.yc = function(p1, p2) { return c(p1, p2, 1); };

MapLine.prototype.dist = function(p1, p2) { 
    return Math.sqrt(Math.pow(xc(p1, p2), 2) + Math.pow(yc(p1, p2), 2));
};

////////////////////////////////////////////////////////////////////////////////
// private
MapLine.prototype._process = function(linePoints, speedPoints) {
  var doublePoints      = this.generateDoublePoints(this.mainLine, this.speedPoints),
        polygonPoints    = this.makePolys(doublePoints);
  return polygonPoints;
};

MapLine.prototype._combinePositionAndSpeedPoints = function(posPoints, speedPoints) {
  if (posPoints.length !== speedPoints.length) {
    throw new Error("array lengths do not match");
  } else {
    var points = [];
    for (var j = 0, max = posPoints.length; j < max; j++) {
      points.push(
        { 
          xcoord: posPoints[j][0],
          ycoord: posPoints[j][1],
          speed: speedPoints[j]
        }
      );
    }
    return points;
  }
};

MapLine.prototype._makeParallelLines = function(point, scale) {
  var tail = point.ycoord,
        head = point.xcoord,
        diffPoint = [_xc(tail, head), _yc(tail, head)],  // shift points to origin
        rad = dist([0, 0], diffPoint), // distance of diffPoint to origin
        ang = diffPoint[0]/rad,
        theta = Math.acos(ang), //  x=rCos(theta) and y=rSin(theta)
        pLines = this._generateAboveAndBelowPoints(point, theta, scale);
  return pLines;
};

// TODO HOW WTO DO THIS!!??!!
MapLine.prototype._calculateScale = function(positionAndSpeedPoints) {
  // TODO calculate scale !!!
  return .0001;
}



MapLine.prototype._generateAboveAndBelowPoints = function(point, theta, scale) {
  // Add +/- pi to theta...this gives us new angles which are both perpendicular to theta
  var aboveAngle = parseFloat((theta + this.pi()/2)),
        belowAngle = parseFloat((theta - this.pi()/2));

  // TODO Compute points on this new line ???? made by above angles, at distance of scale from origin 
  var tempAbovePoint = [scale*this.cos(aboveAngle), scale*this.sin(aboveAngle)],
        tempBelowPoint = [scale*this.cos(belowAngle), scale*this.sin(belowAngle)];
  
  var abovePoint1 = [point1[0] + tempAbovePoint[0], point1[1] + tempAbovePoint[1]],
        abovePoint2 = [point2[0] + tempAbovePoint[0], point2[1] + tempAbovePoint[1]],
        belowPoint1 = [point1[0] + tempBelowPoint[0], point1[1] + tempBelowPoint[1]],
        belowPoint2 = [point2[0] + tempBelowPoint[0], point2[1] + tempBelowPoint[1]],
        returnPoints = [
          [abovePoint1, abovePoint2],
          [belowPoint1, belowPoint2]
        ];

  return returnPoints;
};

MapLine.prototype._process = function(mainLine, speedPoints) {




  MapLine.prototype._sanitizePoints = function(newPoints) {
    newPoints[0][0] = newPoints[0][0].filter(function(a) { return !isNaN(a); });
    newPoints[0][1] = newPoints[0][1].filter(function(a) { return !isNaN(a); });
    newPoints[1][0] = newPoints[1][0].filter(function(a) { return !isNaN(a); })
    newPoints[1][1] = newPoints[1][1].filter(function(a) { return !isNaN(a); });
    return newPoints;
  };

MapLine.prototype.generateDoublePoints = function() {
  
  var points = this._combinePositionAndSpeedPoints(mainLine, speedPoints),
        scale = this._calculateScale(points),
        doublePoints = { above: [], below: [] };

  for (var j = 0, max = this.points.length; j < max; j++) {
    if (j < this.points.length-1) {
      // TODO this is wrong...probably need to call with points[j], points[j+1]
      var aboveAndBelowPoints = this._makeParallelLines(points[j], scale),
            sanitizedPoints = this._sanitizePoints(aboveAndBelowPoints);

      // TODO what is going on here ???
      if (sanitizedPoints[0][0].length > 0 && sanitizedPoints[0][1].length > 0) {
        doublePoints.above = doublePoints.above.concat(newPoints[0]);
      }
      if (sanitizedPoints[1][0].length > 0 && sanitizedPoints[1][1].length > 0) {
        doublePoints.below = doublePoints.below.concat(newPoints[1]);
      }
     }
  }
  return doublePoints;
};

MapLine.prototype.makePolys = function(doublePoints) {
  var polys = [];
  for (var j = 0, max = this.doublePoints.length; j < max; j++) {
    if (j < this.doublePoints.length-1) {
      polys.push(
        [doublePoints.above[j], doublePoints.above[j+1],
         doublePoints.below[j+1], doublePoints.below[j]]
      );
    }
  }
  return polys;
};
