"use strict"

var oneLine = require('./one-line-to-two'),
should = require('should');

var pi = Math.PI;

describe("MapLine", function() {


  var _c = function(p1, p2, idx) { return p2[idx] - p1[idx]; }
  var _xc = function(p1, p2) { return _c(p1, p2, 0); } 
  var _yc = function(p1, p2) { return _c(p1, p2, 1); }
  var dist = function(p1, p2) { 
    return Math.sqrt(Math.pow(_xc(p1, p2), 2) + Math.pow(_yc(p1, p2), 2));
  }
 //  var roundToTwo =  function(num) {    
//     num = parseFloat(num+"e+2");
 
//   return +(Math.round(num)  + "e-2");
// }


  describe("makeOnePointTwo", function() {
    
    // it("should shift points correctly", function() {
    //   var point1 = [0, 1];
    //   var point1 = [0, 2];
    //   var diffPoint =  [_xc(point1, point2), _yc(point1, point2)];
    //   var abovePoint1 = [point1[0] + tempAbovePoint[0] -1, point1[1] + tempAbovePoint[1]];
    //   var belowPoint1 = [point1[0] + tempBelowPoint[0]-1, point1[1] + tempBelowPoint[1]];
    // });


    it("angles the coordinate axes should work correctly", function() {

      // var ang = 0;
      // var tempTheta = Math.acos(ang);

      // var theta = (tempTheta+Math.PI/2)*Math.PI/180;
      // theta.should.equal(1);

      // correct
      Math.cos(0).should.equal(1);
      Math.sin(0).should.equal(0);

      // have to do some rounding and fudge the numbers a bit for cos(pi/2)
      var num = parseFloat(Math.cos(Math.PI/2))
      num.toFixed(5).should.equal('0.00000');
      Math.sin(Math.PI/2).should.equal(1);

      Math.cos(pi).should.equal(-1);
      parseFloat(Math.sin(pi)).toFixed(5).should.equal("0.00000");

      parseFloat(Math.cos(3*pi/2)).toFixed(5).should.equal("0.00000");
      Math.sin(3*pi/2).should.equal(-1);
      

    });

  });

});
