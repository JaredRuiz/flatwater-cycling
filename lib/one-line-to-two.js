"use strict"

  // helper functions
  var makeRad = function(num) { return parseFloat(num).toFixed(5); }
  var _c = function(p1, p2, idx) { return p2[idx] - p1[idx]; }
  var _xc = function(p1, p2) { return _c(p1, p2, 0); } 
  var _yc = function(p1, p2) { return _c(p1, p2, 1); }
  var dist = function(p1, p2) { 
    return Math.sqrt(Math.pow(_xc(p1, p2), 2) + Math.pow(_yc(p1, p2), 2));
  }

var toRad = function(deg) {
  return deg*Math.PI/180;
};


function MapLine(data) {
  this.mainLine = []; 
  this.speedPoints = [];

  for (var j = 0, max = data.length; j < max; j++) {
    var dPoint = data[j];
    var arr = [ dPoint.lat, dPoint.lon ];
    this.mainLine.push(arr);
    
    if (j >=1) {

      // console.log(JSON.stringify(data[j]));
      
      ///////////////////////////////////////
      // Haversine function logic:
      var ldPoint = data[j-1];
      var oldTime = new Date();
      oldTime.setHours(ldPoint.hour, ldPoint.minute, ldPoint.second);
      var newTime = new Date();
      newTime.setHours(dPoint.hour, dPoint.minute, dPoint.second);

      // TODO divide by 1000 for ms --> s and by for s --> min
      var time = ((newTime.getTime() - oldTime.getTime())/(1000*60));

      // constant to convert haversine to miles
      var R = 3958.755866; 

      // var dLat = this.makeRad(data[j].lat-data[j-1].lat);
      // var dLon = this.makeRad(data[j].lon-data[j-1].lon);
      // var lat1 = this.makeRad(data[j-1].lat);
      // var lat2 = this.makeRad(data[j].lat);

      var dLat = makeRad(data[j].lat-data[j-1].lat);
      var dLon = makeRad(data[j].lon-data[j-1].lon);
      var lat1 = makeRad(data[j-1].lat);
      var lat2 = makeRad(data[j].lat);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      var speed = d/time;
      ///////////////////////////////////////////////////////

      // console.log('speed: ' + speed);

      this.speedPoints.push(speed);
    } else {
      this.speedPoints.push(0);
    }
    
  }

  var minSpeed = Math.min.apply(null, this.speedPoints),
        maxSpeed = Math.max.apply(null, this.speedPoints);

  this.doublePoints = this.generateDoublePoints(minSpeed, maxSpeed);
  this.aboveLinePoints = this.doublePoints.above;
  this.belowLinePoints = this.doublePoints.below;

  this.polygonPoints = this.makePolys();

}; // MapLine

MapLine.prototype.makeRad = function(num) {
  num = parseFloat(num).toFixed(4);
  num = (num === "-0.0000") ? "0.0000" : num;
  return parseFloat(num);
} // makeRad

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

MapLine.prototype.pi = function() { return this.makeRad(Math.PI) }

MapLine.prototype.makeOnePointTwo = function(point1, point2, speedPoint, scaleFactor) {

  // // take difference betwen points in order to shift to origin
  var diffPoint = [_xc(point1, point2), _yc(point1, point2)];

  /////////////////////////////////////////////////////
  // main

  // TODO: comment throughout on what step in the process you're in..

  // compute distance of diffPoint to origin (ie. length of diffPoint as a vector)
  var rad = dist([0, 0], diffPoint);

  // var ang = rad/diffPoint[0];
  var ang = diffPoint[0]/rad;

  /// Since x=rCos(a) and y=rSin(a) (for an angle a) and we know x, y, and r, we compute theta
  var theta = Math.acos(ang);

  /// Add +/- pi tp theta...this gives us new angles which are both perpendicular to theta
  var aboveAngle = parseFloat((theta + this.pi()/2));
  var belowAngle = parseFloat((theta - this.pi()/2));

  // TODO need to determine how to calculate the scale!!!!
  var scale = speedPoint * .00005;
  // var scale = speedPoint * .00009;
  // var scale = speedPoint * .0003;
  // var scale = scaleFactor(speedPoint);
  // console.log(scale);
    
  /// Compute points on this new line made by above angles, at
  /// distance 1 from origin
  var tempAbovePoint = [scale*this.cos(aboveAngle), scale*this.sin(aboveAngle)];
  var tempBelowPoint = [scale*this.cos(belowAngle), scale*this.sin(belowAngle)];

  var abovePoint1 = [point1[0] + tempAbovePoint[0], point1[1] + tempAbovePoint[1]];
  var abovePoint2 = [point2[0] + tempAbovePoint[0], point2[1] + tempAbovePoint[1]];
  var belowPoint1 = [point1[0] + tempBelowPoint[0], point1[1] + tempBelowPoint[1]];
  var belowPoint2 = [point2[0] + tempBelowPoint[0], point2[1] + tempBelowPoint[1]];

  var returnPoints = [
    [abovePoint1, abovePoint2],
    [belowPoint1, belowPoint2]
  ];
  
  return returnPoints;
} // makeOnePointTwo

MapLine.prototype.generateDoublePoints = function(min, max) {

  // console.log(max);
  
  if (this.mainLine.length !== this.speedPoints.length) {
    throw new Error("array lengths do not match");
  }

  var doublePoints = { above: [], below: [] };
  for (var j = 0, max = this.mainLine.length; j < max; j++) {
    
    // console.log(j);


    if (j < this.mainLine.length-1) {



      var newPoints = this.makeOnePointTwo(this.mainLine[j], this.mainLine[j+1], this.speedPoints[j]);

      // console.log(doublePoints.above.length);

      newPoints[0][0] = newPoints[0][0].filter(function(a) { return !isNaN(a); });
      newPoints[0][1] = newPoints[0][1].filter(function(a) { return !isNaN(a); });
      newPoints[1][0] = newPoints[1][0].filter(function(a) { return !isNaN(a); })
      newPoints[1][1] = newPoints[1][1].filter(function(a) { return !isNaN(a); });
      
      if (newPoints[0][0].length > 0 && newPoints[0][1].length > 0) {

        // console.log(newPoints[0]);

        doublePoints.above = doublePoints.above.concat(newPoints[0]);

        console.log(doublePoints);


      }

      if (newPoints[1][0].length > 0 && newPoints[1][1].length > 0) {
        doublePoints.below = doublePoints.below.concat(newPoints[1]);
      }

     }
  } // for
  
  console.log(doublePoints.above.length);


  return doublePoints;
}

MapLine.prototype.makePolys = function() {
  var polys = {
    pos: [],
    speed: []
  };
  for (var j = 0, max = this.aboveLinePoints.length; j < max; j++) {
    if (j < this.aboveLinePoints.length-1) {

      // console.log(j);
      // console.log(this.aboveLinePoints[j]);


      polys.pos.push([this.aboveLinePoints[j], this.aboveLinePoints[j+1],
                  this.belowLinePoints[j+1], this.belowLinePoints[j]]);
      var speedIdx = Math.floor(j/2);
      polys.speed.push(this.speedPoints[speedIdx]);
    }
  }
  return polys;
};

MapLine.prototype.west = function() {
  var latPoints = this.getLatPoints();
  var i = latPoints.indexOf(Math.min.apply(Math, latPoints));
  return latPoints[i];
};

MapLine.prototype.east = function() {
  var latPoints = this.getLatPoints();
  var i = latPoints.indexOf(Math.max.apply(Math, latPoints));
  return latPoints[i];
};

MapLine.prototype.south = function() {
  var longPoints = this.getLongPoints();
  var i = longPoints.indexOf(Math.min.apply(Math, longPoints));
  return longPoints[i];
};

MapLine.prototype.north = function() {
  var longPoints = this.getLongPoints();
  var i = longPoints.indexOf(Math.max.apply(Math, longPoints));
  return longPoints[i];
};

MapLine.prototype.getLatPoints = function() {
  var arr = this.mainLine.map(function(a) {
    return a[1];
  });
  return arr;
};

MapLine.prototype.getLongPoints = function() {
  var arr = this.mainLine.map(function(a) {
    return a[0];
  });
  return arr;
};

///////////////
// TODO Color stuff

// 'rgb(120, 120, 240)'
// function colorToHex(color) {
//     if (color.substr(0, 1) === '#') {
//         return color;
//     }
//     var digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);

//     var red = parseInt(digits[2]);
//     var green = parseInt(digits[3]);
//     var blue = parseInt(digits[4]);

//     var rgb = blue | (green << 8) | (red << 16);
//     return digits[1] + '#' + rgb.toString(16);
// };
