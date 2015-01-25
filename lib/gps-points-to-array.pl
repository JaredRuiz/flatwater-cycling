#!/usr/bin/perl

use strict;
use warnings;

my @slurp = <>; 

my $str = "[";
foreach my $line (@slurp) { 

    chomp($line);
    if ($. % 2 == 1) {
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
