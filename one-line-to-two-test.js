"use strict"

var oneLine = require('./one-line-to-two'),
should = require('should');

describe("MapLine", function() {
  }
  // TODO: converts a number to a radian???
  var makeRad = function(num) {
    num = parseFloat(num).toFixed(4);
    num = (num === "-0.0000") ? "0.0000" : num;
    return num;
  } // makeRad

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
      // theta.should.equal(1);e

      // correct
      var ml = new oneLine.MapLine([0]);
      ml.cos(0).should.equal(1);
	    Math.sin(0).should.equal(0);
      Math.acos(1).should.equal(0);
	    Math.asin(0).should.equal(0);

      ml.cos(pi/2).should.equal(0);
      ml.sin(pi/2).should.equal(1);
      ml.acos(0).should.equal(pi/2);
      ml.asin(1).should.equal(pi/2);

      ml.cos(pi).should.equal(-1);
      ml.sin(pi).should.equal(0);
      ml.acos(-1).should.equal(pi);
      ml.asin(0).should.equal(pi);

      ml.cos(3*pi/2).should.equal(0);
      ml.sin(3*pi/2).should.equal(-1);
      ml.acos(0).should.equal(3*pi/2);
      ml.asin(-1).should.equal(3*pi/2);

    });

  });

});
