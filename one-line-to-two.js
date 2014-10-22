"use strict"

function mapLine() {
  if (arr) {
    this.mainLine = arr.map(function(a) { return a; });
  } else {
    this.mainLine = [];
  }
    this.aboveLinePoints = [];
    this.belowLinePoints = [];
    
    this.makeOnePointTwo = function(point1, point2) {
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
        [abovePoint1, abovePoint2]
      ];
      
      return returnPoints;
    } // makeOnePointTwo

};  




    exports.mapLine = mapLine;
