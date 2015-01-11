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
MapLine.prototype.c = function(p1, p2, idx) { 
  return p2[idx] - p1[idx]; 
};

MapLine.prototype.xc = function(p1, p2) { 
  return c(p1, p2, "xcoord"); 
};

MapLine.prototype.yc = function(p1, p2) { 
  return c(p1, p2, "ycoord"); 
};

MapLine.prototype.dist = function(p1, p2) { 
  return Math.sqrt(Math.pow(xc(p1, p2), 2) + Math.pow(yc(p1, p2), 2));
};

////////////////////////////////////////////////////////////////////////////////
// private
MapLine.prototype._process = function(linePoints, speedPoints) {
  var points = this._combinePositionAndSpeedPoints(mainLine, speedPoints),
       doublePoints = this.generateDoublePoints(points),
       polygonPoints = this.makePolys(doublePoints);
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

MapLine.prototype._makeParallelLines = function(tail, head, scale) {
  var diffPoint = {
    xcoord: this.xc(tail, head),
    ycoord: this.yc(tail, head),
    speed: tail.speed // TODO use tail's speed 
  },
        origin = { xcoord: 0, ycoord: 0 },
        rad = this.dist(origin, diffPoint), // distance of diffPoint to origin
        ang = diffPoint.xcoord/rad, // TODO: what is going on here??
         //  TODO should we use Math.acos or this.acos ??
         // theta = Math.acos(ang), //  x=rCos(theta) and y=rSin(theta)
         theta = this.acos(ang), //  x=rCos(theta) and y=rSin(theta)
         aAndBPoints = this._generateAboveAndBelowPoint(point, theta, scale),
         pLines = this._makeLinesThroughPoints(tail, head, aAndBPoints);
  return pLines;
};



MapLine.prototype._generateAboveAndBelowPoint = function(point, angle, scale) {
  var factor = tail.speedPoint * scale,
  // Add +/- pi to theta...this gives us new angles which are both perpendicular to theta
        aboveAngle = parseFloat((theta + this.pi()/2)),
        belowAngle = parseFloat((theta - this.pi()/2)),
        tempAbovePoint = {},
        tempBelowPoint = {};

  // TODO Compute points on this new line ???? made by above angles, at distance of scale from origin 
  tempAbovePoint = { 
    xcoord: scale*this.cos(aboveAngle),
    ycoord: scale*this.sin(aboveAngle)
  };
  tempBelowPoint = {
    xcoord: scale*this.cos(belowAngle),
    ycoord: scale*this.sin(belowAngle)
  };
  return { above: tempAbovePoint, below: tempBelowPoint };
};

MapLine.prototype._makeLinesThroughPoints = function(tail, head, points) {
  // TODO this may be good in itwo own function
  var pLines = {
    // group the above points into one line
    above: [
      { xcoord: tail.xcoord + points.above.xcoord,
        ycoord: tail.ycoord + points.above.ycoord, 
      },
      { xcoord: head.xcoord + points.above.xcoord,
        ycoord: head.ycoord + points.above.ycoord, 
      }
    ],
    // group the below points into another line
    below: [
      { xcoord: tail.xcoord + points.below.xcoord,
        ycoord: tail.ycoord + points.below.ycoord, 
      },
      { xcoord: head.xcoord + points.below.xcoord,
        ycoord: head.ycoord + points.below.ycoord, 
      }
    ]
  };
  return pLines;
};

// TODO HOW WTO DO THIS!!??!!
MapLine.prototype._calculateScale = function(positionAndSpeedPoints) {
  // TODO calculate scale !!!
  return .0001;
}

MapLine.prototype._sanitizePoints = function(points) {
    points.above = newPoints.above.filter(function(a) { 
      return !isNaN(a.xcoord) && !isNaN(a.ycoord); 
    });
    points.below = newPoints.below.filter(function(a) { 
      return !isNaN(a.xcoord) && !isNaN(a.ycoord); 
    });
    return points;
  };

MapLine.prototype.generateDoublePoints = function(points) {
  
  var scale = this._calculateScale(points),
        doublePoints = { above: [], below: [] };

  for (var j = 0, max = this.points.length; j < max; j++) {
    if (j < this.points.length-1) {
      var aboveAndBelowPoints = this._makeParallelLines(points[j], points[j+1], scale),
            sanitizedPoints = this._sanitizePoints(aboveAndBelowPoints);
      // if (sanitizedPoints.above.length > 0 && sanitizedPoints.below.length > 0) {
        doublePoints.above = doublePoints.above.concat(sanitizedPoints.above);
      // }
      // if (sanitizedPoints.below.length > 0 && sanitizedPoints.below.length > 0) {
        doublePoints.below = doublePoints.below.concat(sanitizedPoints.below);
      // }
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
