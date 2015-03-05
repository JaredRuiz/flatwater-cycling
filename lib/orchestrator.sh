#!/bin/sh

## Shell script to coordinate workflow from retrieval to data preparation.

# INPUT_FILE= ???


./parse-xml-array.pl $INPUT_FILE | ./gps-points-to-array 

exit 0
