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

  describe("#_determineScale", function() {

    // TODO make better tests here..
    it('should return a value', function() {

      // var p = { lat: 40.804801220074296,
      //           lon: -96.71633628197014,
      //           hour: 13,
      //           minute: 28,
      //           second: 16
      //         },
      //       q = { lat: 40.804806081578135,
      //             lon: -96.7161178495735,
      //             hour: 13,
      //             minute: 28,
      //             second: 19
      //           }, 

var p ={ lat: 40.80435957759619,
lon: -96.719063334167,
hour: 13,
minute: 26,
second: 48
},
q = { lat: 40.80436117015779,
lon: -96.71903030946851,
hour: 13,
minute: 26,
second: 50
},
      scale = ml._determineScale(p, q, 'speed');

      should.exist(scale);
      isNaN(scale).should.equal(false);
      scale.should.equal(3.5605273941626887);
    });

  });

describe("#_combnePointsIntoLine", function() {
    it('should return a value', function() {
      var p = { lat: 40.804801220074296,
                lon: -96.71633628197014,
                hour: 13,
                minute: 28,
                second: 16
              },
            q = { lat: 40.804806081578135,
                  lon: -96.7161178495735,
                  hour: 13,
                  minute: 28,
                  second: 19
                },
           line = ml._combinePointsIntoLine(p, q, 'speed');

      line.tail.x.should.equal(p.lat);
      line.tail.y.should.equal(p.lon);
      line.head.x.should.equal(q.lat);
      line.head.y.should.equal(q.lon);
    });
  });


  describe("#_drawLine", function() {
    it('should return polygons and a scale', function() {
      var data =  [ 
        { lat: 40.804886212572455,
          lon: -96.71719626523554,
          hour: 13,
          minute: 27,
          second: 59
        },
        { lat: 40.80485017038882,
          lon: -96.71713256277144,
          hour: 13,
          minute: 28,
          second: 1
        },
        { lat: 40.804840195924044,
          lon: -96.71710590831935,
          hour: 13,
          minute: 28,
          second: 2
        },
        { lat: 40.80482234247029,
          lon: -96.71701974235475,
          hour: 13,
          minute: 28,
          second: 5
        }
      ],
      lineObject = ml._drawLine(data, 'speed');

      should.exist(lineObject);
      lineObject.length.should.equal(3);
      lineObject.forEach(function(line) {
        line.poly.length.should.equal(4);
        should.exist(line.scale);
      });

    });
  });

});
