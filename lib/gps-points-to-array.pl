#!/usr/bin/perl

use strict;
use warnings;

my $str = "[";

my @slurp = <>; 
foreach my $line (@slurp) { 
    chomp($line);
    if ($. % 2 == 1) {
    # if ($. % 2 == 0) {
        $str = $str . $line . ", ";
    }
    else {
        $str = $str . $line . "],";
        print $str;
        print "\n";
        $str="[";       
    }
}

# close $info;
