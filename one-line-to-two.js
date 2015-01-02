"use strict"

function MapLine() {};

////////////////////////////////////////////////////////////////////////////////
// public
MapLine.prototype.process = function(linePoints, speedPoints) {
  return this._process(linePoints, speedPoints);
};

////////////////////////////////////////////////////////////////////////////////
// private
MapLine.prototype._process = function(linePoints, speedPoints) {
  var scale
  var doublePoints      = this.generateDoublePoints(this.mainLine, this.speedPoints),
        aboveLinePoints = this.doublePoints.above,
        belowLinePoints = this.doublePoints.below,
        polygonPoints    = this.makePolys();
  return polygonPoints;
}; 

MapLine.prototype._makeRad = function(num) {
  var fourDecimalFloat = parseFloat(num).toFixed(4);
  fourDecimalFloat = (fourDecimalFloat === "-0.0000") ? "0.0000" : fourDecimalFloat;
  return fourDecimalFloat;
};

// TODO it would be good to pull these out into another class...
MapLine.prototype.cos = function(a) {
  return this.makeRad(Math.cos(a));
} // cos

MapLine.prototype.acos = function(a) {
  var tempRad = this.makeRad(Math.acos(a));
  if (tempRad >= 2*this.pi) {
    tempRad - 2*this.pi;
    return this.acos(tempRad);
  } else if (tempRad < 0) {
    tempRad + 2*this.pi;
    return this.acos(tempRad);
  } else {
    return tempRad;
  }
} // acos

MapLine.prototype.sin = function(a) {
  return this.makeRad(Math.sin(a));
} // sin

MapLine.prototype.asin = function(a) {
  return this.makeRad(Math.asin(a));
} // asin

MapLine.prototype.pi = function() { return this.makeRad(Math.PI) };

MapLine.prototype._c = function(p1, p2, idx) { return p2[idx] - p1[idx]; }
MapLine.prototype._xc = function(p1, p2) { return _c(p1, p2, 0); };
MapLine.prototype._yc = function(p1, p2) { return _c(p1, p2, 1); };

MapLine.prototype.dist = function(p1, p2) { 
    return Math.sqrt(Math.pow(_xc(p1, p2), 2) + Math.pow(_yc(p1, p2), 2));
};

MapLine.prototype._makeParallelLines = function(points, scale) {
  var tail = points.position
  var diffPoint = [_xc(tail, head), _yc(tail, head)],  // shift points to origin
        rad = dist([0, 0], diffPoint), // distance of diffPoint to origin
        ang = diffPoint[0]/rad,
        theta = Math.acos(ang), //  x=rCos(theta) and y=rSin(theta)
        _generateAboveAndBelowPoints(theta, scale)
  
};


// TODO HOW WTO DO THIS!!??!!
MapLine.prototype._calculateScale = function(positionAndSpeedPoints) {
  // TODO calculate scale !!!
  return .0001;
}



MapLine.prototype._generateAboveAndBelowPoints = function(theta, scale) {
  // Add +/- pi tp theta...this gives us new angles which are both perpendicular to theta
  var aboveAngle = parseFloat((theta + this.pi()/2)),
        belowAngle = parseFloat((theta - this.pi()/2)),
        // Compute points on this new line ???? made by above angles, at distance of scale from origin 
        tempAbovePoint = [scale*this.cos(aboveAngle), scale*this.sin(aboveAngle)],
        tempBelowPoint = [scale*this.cos(belowAngle), scale*this.sin(belowAngle)],
        abovePoint1 = [point1[0] + tempAbovePoint[0], point1[1] + tempAbovePoint[1]],
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

MapLine.prototype._combinePositionAndSpeedPoints = function(mainLine, speedPoints) {
  if (this.mainLine.length !== this.speedPoints.length) {
    throw new Error("array lengths do not match");
  } else {
    var points = [];
    for (var j = 0, max = mainLine.length; j < max; j++) {
      points.push(
        { 
          xcoord: mainLine[j][0],
          ycoord: mainLine[j][1],
          speed: speedPoints[j]
        }
      );
    }
    return points;
  }
};


  MapLine.prototype._sanitizePoints = function(newPoints) {
    newPoints[0][0] = newPoints[0][0].filter(function(a) { return !isNaN(a); });
    newPoints[0][1] = newPoints[0][1].filter(function(a) { return !isNaN(a); });
    newPoints[1][0] = newPoints[1][0].filter(function(a) { return !isNaN(a); })
    newPoints[1][1] = newPoints[1][1].filter(function(a) { return !isNaN(a); });
    return newPoints;
  };

MapLine.prototype.generateDoublePoints = function() {
  
  var points = this._combinePositionAndSpeedPoints(mainLine, speedPoints);
        scale = this._calculateScale(points);

  var doublePoints = { above: [], below: [] };
  for (var j = 0, max = this.points.length; j < max; j++) {
    if (j < this.points.length-1) {
      var aboveAndBelowPoints = this.makeOnePointTwo(points[j], scale);
            sanitizedPoints = this._sanitizePoints(newPoints);

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

MapLine.prototype.makePolys = function() {
  var polys = [];
  for (var j = 0, max = this.aboveLinePoints.length; j < max; j++) {
    if (j < this.aboveLinePoints.length-1) {
      polys.push([this.aboveLinePoints[j], this.aboveLinePoints[j+1],
                  this.belowLinePoints[j+1], this.belowLinePoints[j]]);
    }
  }
  return polys;
};
