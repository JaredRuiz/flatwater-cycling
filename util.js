"use strict";

var fs = require('fs');

var fetchMapArray = function(date, rider, onArrayFetched) {
  var formattedDate = formatDateForPath(date),
        path = "./" + rider + "/" + formattedDate;

  fs.readFile(path.toString(), function(err, mapArray) {
    onArrayFetched(err, mapArray);
  });  
};


