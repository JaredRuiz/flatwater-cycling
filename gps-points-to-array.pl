#!/usr/bin/perl

use strict;
use warnings;

my $file = 'correct-points';
open my $info, $file or die "Could not open $file: $!";

my $str="[";
while( my $line = <$info>)  {   
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

close $info;
