#!/usr/bin/perl

# use module
use XML::Simple;
use Data::Dumper;
use strict;
use warnings;

# create xml object
my $xml = new XML::Simple;

# read raw XML file
# my $data = $xml->XMLin("raw-data.xml");
my $data = $xml->XMLin($1);


# TODO we may want to create a file here and now open an existing one...
my $pos_file = '../position-points';
my $speed_file = '../speed-points';
open (my $p_file, '>', $pos_file) or die "Could not open $pos_file: $!";
open (my $s_file, '>', $speed_file) or die "Could not open $speed_file: $!";


# TODO check to see if Lap is singular or an array print $file "[ \n";
# if (ref @{$data->{Activities}->{Activity}->{Lap}  eq 'ARRAY') {
# # do something different
#     }

print $p_file "[ \n";
print $s_file "[ \n";
my $pos_line; 
my $speed_line; 
foreach my $e (@{$data->{Activities}->{Activity}->{Lap}[0]->{Track}->{Trackpoint}}) {
    $pos_line = "[ "; 

    # longitude is x coordinate
    $pos_line = $pos_line . $e->{Position}->{LongitudeDegrees}; 
    $pos_line = $pos_line . ", "; 
    # latitude is y coordinate
    $pos_line = $pos_line .  $e->{Position}->{LatitudeDegrees};
    $pos_line = $pos_line . " ], \n"; 
    print $p_file $pos_line; 

    $speed_line = "[ "; 
    $speed_line = $speed_line . $e->{Extensions}->{TPX}->{Speed};
    $speed_line = $speed_line . " ], \n"; 
    print $s_file $speed_line; 
} 
print $p_file "];";
print $s_file "];";

close $p_file;
close $s_file;
