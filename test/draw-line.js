"use strict"

var oneLine = require('../lib/draw-line'),
should = require('should');


describe("MapLine", function() {

  var pi = Math.PI,
       ml = new oneLine.MapLine();

  describe("#makeRad", function() {
    it("should round to no more than 4 digits", function() {
      ml.makeRad(0.12345).should.equal(0.1235);
    });

    it("should convert negative 0 to 0", function() {
      ml.makeRad(-0).should.equal(0.0000);
    });

    it("should do nothing to integers", function() {
      ml.makeRad(-1).should.equal(-1);
    });

  });

  it("cos", function() {
    ml.cos(0).should.equal(1);
    ml.cos(pi/2).should.equal(0);
    ml.cos(pi).should.equal(-1);
    ml.cos(3*pi/2).should.equal(0);

  });

  it("sin", function() {
	  Math.sin(0).should.equal(0);
    ml.sin(pi/2).should.equal(1);
    ml.sin(pi).should.equal(0);
    ml.sin(3*pi/2).should.equal(-1);
  });

  it("acos", function() {
    Math.acos(1).should.equal(0);
    ml.acos(0).should.equal(ml.makeRad(pi/2));
    ml.acos(-1).should.equal(ml.makeRad(pi));
  });

  describe("#dist", function() {
    it("should give zero for two identical points", function() {
      ml.dist( { x: 1, y: 1}, { x: 1, y: 1}).should.equal(0);
      ml.dist( { x: 2, y: 1}, { x: 2, y: 1}).should.equal(0);
    });

    it("should compute correct positive distances", function() {
      ml.dist( { x: 0, y: 0}, { x: 0, y: 1}).should.equal(1);
      ml.dist( { x: 0, y: 0}, { x: 1, y: 0}).should.equal(1);
      ml.dist( { x: 1, y: 1}, { x: 1, y: 20}).should.equal(19);
    });

    it("should compute correct negative distances", function() {
      ml.dist( { x: 0, y: 0}, { x: -1, y: 0}).should.equal(1);
      ml.dist( { x: 0, y: 0}, { x: 0, y: -1}).should.equal(1);
    });

  });

  describe("#makePolarPointFromCartesian", function() {
    it("should give the origin is (0, 0) is passed in", function() {
      var point = { x: 0, y: 0 },
            polar = ml.makePolarPointFromCartesian(point);
      
      polar.r.should.equal(0);
      polar.theta.should.equal(0);
    });

    it("should give r=1, theta=0 if (1, 0) is passed in", function() {
      var point = { x: 1, y: 0 },
            polar = ml.makePolarPointFromCartesian(point);
      
      polar.r.should.equal(1);
      polar.theta.should.equal(0);
    });

    it("should give r=1, theta=pi/2 if (0, 1) is passed in", function() {
      var point = { x: 0, y: 1 },
            polar = ml.makePolarPointFromCartesian(point);
      
      polar.r.should.equal(1);
      polar.theta.should.equal(ml.makeRad(pi/2));
    });

    it("should give r=1, theta=pi if (-1, 0) is passed in", function() {
      var point = { x: -1, y: 0 },
            polar = ml.makePolarPointFromCartesian(point);
      
      polar.r.should.equal(1);
      polar.theta.should.equal(ml.makeRad(pi));
    });

    it("should give r=1, theta=3pi/2 if (0, -1) is passed in", function() {
      var point = { x: 0, y: -1 },
            polar = ml.makePolarPointFromCartesian(point);
      
      polar.r.should.equal(1);
      polar.theta.should.equal(ml.makeRad(pi/2));
    });
  });

  describe("#getAbovePoint", function() {
    it("should rotate by pi/2 radians", function() {
      var initialPoint = { r: 1, theta: 0 },
            rotatedPoint = ml.getAbovePoint(initialPoint, 1);

      rotatedPoint.r.should.equal(1);
      rotatedPoint.theta.should.equal(ml.makeRad(pi/2));
    });
  });

  describe("#getBelowPoint", function() {
    it("should rotate by -pi/2 radians", function() {
      var initialPoint = { r: 1, theta: 0 },
            rotatedPoint = ml.getBelowPoint(initialPoint, 1);

      rotatedPoint.r.should.equal(1);
      rotatedPoint.theta.should.equal(ml.makeRad(-pi/2));
    });
  });

  describe("#addPoints", function() {
    it("should make a new point according to parallelogram law", function() {
      var point1 = { x: 1, y: 2 },
            point2 = { x: 3, y: 4 },
            newPoint = ml.addPoints(point1, point2);
      
      newPoint.x.should.equal(4);
      newPoint.y.should.equal(6);
    });
  });

  describe("#shiftCoordsToOrigin", function() {
    var point1 = { x: 1, y: 2 },
         point2 = { x: 2, y: 4 };
    it("should shift the x coordinates to origin", function() {
      ml.shiftCoordsToOrigin(point1, point2, 'x').should.equal(1);
    });

    it("should shift the y coordinates to origin", function() {
      ml.shiftCoordsToOrigin(point1, point2, 'y').should.equal(2);
    });
  });

  describe("#_shiftLineToOrigin", function() {
    var line = {
                      head: { x: 1, y: 2 },
                      tail: { x: 2, y: 4 }
                    },
          shiftedLine = ml._shiftLineToOrigin(line);

    it("gives a new line with tail at origin", function() {
      shiftedLine.tail.x.should.equal(0);
      shiftedLine.tail.y.should.equal(0);
    });

    it("gives a new line with head at difference", function() {
      shiftedLine.head.x.should.equal(-1);
      shiftedLine.head.y.should.equal(-2);
    });
  });
  
  describe("#_makeParallelLines", function() {
    it("should make two new lines, parallel to the first", function() {
      var line = {
                        tail: { x: 1, y: 2 },
                        head: { x: 2, y: 2 }
                      },
            scale = 1;

      var pLines = ml._makeParallelLines(line, scale);

      pLines.aboveLine.tail.x.should.equal(1);
      pLines.aboveLine.tail.y.should.equal(3);

      pLines.aboveLine.head.x.should.equal(2);
      pLines.aboveLine.head.y.should.equal(3);

      pLines.belowLine.tail.x.should.equal(1);
      pLines.belowLine.tail.y.should.equal(1);

      pLines.belowLine.head.x.should.equal(2);
      pLines.belowLine.head.y.should.equal(1);


    });

  });

});

