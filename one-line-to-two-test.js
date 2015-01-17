"use strict"

var oneLine = require('./one-line-to-two'),
     should   = require('chai').should(),
     _           = require('underscore');

describe("MapLine", function() {

  var ML = new oneLine.MapLine();

  it("#combinePositionAndSpeedPoints", function() {

    var linePoints = [ 
      [ 1.1, 2.1],
      [ 1.2, 2.2],
      [ 1.3, 2.3],
      [ 1.4, 2.4]
    ],
          // speedPoints = [ 
          //   [ 1 ],
          //   [ 2 ],
          //   [ 3 ],
          //   [ 4 ]
          // ];
    // TODO is this correct ????
      speedPoints = [ 1, 2, 3, 4 ];

    var comPoints = ML._combinePositionAndSpeedPoints(linePoints, speedPoints);
    comPoints.length.should.equal(4);
    _.pluck(comPoints, "xcoord").should.deep.equal( [1.1, 1.2, 1.3, 1.4]);
    _.pluck(comPoints, "ycoord").should.deep.equal( [2.1, 2.2, 2.3, 2.4]);
    _.pluck(comPoints, "speed").should.deep.equal( [1, 2, 3, 4]);
  });

  it("#xc", function() {
    var p1 = { xcoord: 1, ycoord: 0 },
          p2 = { xcoord: 2, ycoord: 0 };
    ML.xc(p1, p2).should.equal(1);
  });

  it("#yc", function() {
    var p1 = { xcoord: 1, ycoord: 100 },
          p2 = { xcoord: 2, ycoord: 150 };
    ML.yc(p1, p2).should.equal(50);
  });

it("#dist", function() {
    var p1 = { xcoord: 1, ycoord: 0 },
          p2 = { xcoord: 2, ycoord: 0 };
    ML.dist(p1, p2).should.equal(1);

    var p1 = { xcoord: 0, ycoord: 1 },
          p2 = { xcoord: 0, ycoord: 0 };
    ML.dist(p1, p2).should.equal(1);

    var p1 = { xcoord: 1, ycoord: 2 },
          p2 = { xcoord: 2, ycoord: 2 };
    ML.dist(p1, p2).should.equal(1);
  
  // TODO may want to add some more cases here...
  });
  
  it("#_makeParallelLines", function() {

    var tail = [0, 0],
    // head = [0, 1],
    head = [1, 0];

    // var tail = [1, 2],
    // head = [ 3, 4],
    var scale = 1;
    
    var pLines = ML._makeParallelLines(tail, head, scale);
    pLines.should.equal( [ 'a' ]);
  });

  it("#_generateAboveAndBelowPoint", function() {
    var point = { xcoord: 0, ycoord: 1, speedPoint: 1 },
          angle = ML.pi/2,
          scale = 1;
    
    var aAndBPoint = ML._generateAboveAndBelowPoint(point, angle, scale);
    aAndBPoint.above.should.deep.equal( { xcoord: -1, ycoord: 0 });
    aAndBPoint.below.should.deep.equal( { xcoord: 1, ycoord: 0 });
  });

  

  it("angles the coordinate axes should work correctly", function() {
    // var ang = 0;
    // var tempTheta = Math.acos(ang);
    // var theta = (tempTheta+Math.PI/2)*Math.PI/180;
    // theta.should.equal(1);e
    // correct

    ML.cos(0).should.equal(1.000);
	  ML.sin(0).should.equal(0);
    ML.acos(1).should.equal(0);
	  ML.asin(0).should.equal(0);

    ML.cos(ML.pi()/2).should.equal(0);
    ML.sin(ML.pi()/2).should.equal(1);
    ML.acos(0).should.equal(ML.pi()/2);
    ML.asin(1).should.equal(ML.pi()/2);

    // ML.cos(ML.pi).should.equal(-1);
    // ML.sin(ML.pi).should.equal(0);
    // ML.acos(-1).should.equal(ML.pi);
    // ML.asin(0).should.equal(ML.pi);

    // ML.cos(3*ML.pi/2).should.equal(0);
    // ML.sin(3*ML.pi/2).should.equal(-1);
    // ML.acos(0).should.equal(3*ML.pi/2);
    // ML.asin(-1).should.equal(3*ML.pi/2);
  });


});
