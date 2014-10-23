"use strict"

function MapLine(arr) {
  this.mainLine = arr.map(function(a) { return a; });
  this.doublePoints = this.generateDoublePoints(this.mainLine);
  this.aboveLinePoints = this.doublePoints.above;
  this.belowLinePoints = this.doublePoints.below;
};  

MapLine.prototype.makeOnePointTwo = function(point1, point2) {
  // helper functions
  var _c = function(p1, p2, idx) { return p2[idx] - p1[idx]; }
  var _xc = function(p1, p2) { return _c(p1, p2, 0); } 
  var _yc = function(p1, p2) { return _c(p1, p2, 1); }
  var dist = function(p1, p2) { 
    return Math.sqrt(Math.pow(_xc(p1, p2), 2) + Math.pow(_yc(p1, p2), 2));
  }

  // take difference betwen points in order to shift to origin
  var diffPoint = [_xc(point1, point2), _yc(point1, point2)];
  
  // compute distance of diffPoint to origin (ie. length of diffPoint as a vector)
  var rad = dist([0, 0], diffPoint);

  // var ang = rad/diffPoint[0];
  var ang = diffPoint[0]/rad;

  /// Since x=rCos(a) and y=rSin(a) (for an angle a) and we know x, y, and r, we compute theta
  var theta = Math.acos(ang);

  /// Add +/- pi tp theta...this gives us new angles which are both perpendicular to theta TODO WRONG
  var aboveAngle = (theta + Math.PI/2)*Math.PI/180;
  var belowAngle = (theta - Math.PI/2)*Math.PI/180;

  /// Compute points on this new line made by above angles, at distance 1 from origin 
  var tempAbovePoint = [Math.cos(aboveAngle), Math.sin(aboveAngle)];
  var tempBelowPoint = [Math.cos(belowAngle), Math.sin(belowAngle)];

  /// Shift these new points back to where point1 and point2 initially began
  var abovePoint1 = [point1[0] + tempAbovePoint[0], point1[1] + tempAbovePoint[1]];
  var belowPoint1 = [point1[0] + tempBelowPoint[0], point1[1] + tempBelowPoint[1]];
  var abovePoint2 = [point2[0] + tempAbovePoint[0], point2[1] + tempAbovePoint[1]];
  var belowPoint2 = [point2[0] + tempBelowPoint[0], point2[1] + tempBelowPoint[1]];

  var returnPoints = [
    [abovePoint1, abovePoint2],
    [belowPoint1, belowPoint2]
  ];
  
  return returnPoints;
} // makeOnePointTwo

MapLine.prototype.generateDoublePoints = function(lineArr) {
  var doublePoints = { above: [], below: [] };
  for (var j = 0; j < lineArr.length; j++) {
    if (j < lineArr.length-1) {
      var newPoints = this.makeOnePointTwo(lineArr[j], lineArr[j+1]);
      // console.log(JSON.stringify(newPoints[0]));
      newPoints[0][0] = newPoints[0][0].filter(function(a) { return !isNaN(a); });
      newPoints[0][1] = newPoints[0][1].filter(function(a) { return !isNaN(a); });
      newPoints[1][0] = newPoints[1][0].filter(function(a) { return !isNaN(a); })
      newPoints[1][1] = newPoints[1][1].filter(function(a) { return !isNaN(a); });
      if (newPoints[0][0].length > 0 && newPoints[0][1].length > 0) {
        doublePoints.above = doublePoints.above.concat(newPoints[0]);
      }
      if (newPoints[1][0].length > 0 && newPoints[1][1].length > 0) {
        doublePoints.below = doublePoints.below.concat(newPoints[1]);
      }
      // console.log(doublePoints.above);
    }

    // else {
    //   doublePoints.above.concat(newPoints[0]);
    //   doublePoints.below.concat(newPoints[1]);
    // }
  } // for

        // doublePoints.above = doublePoints.above.filter(function(a) { return isNaN
        // doublePoints.below = doublePoints.below.concat(newPoints[1]);

  return doublePoints;
}

// TODO: comment this out...
// exports.MapLine = MapLine;
