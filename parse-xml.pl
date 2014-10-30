#!/usr/bin/perl

# use module
use XML::Simple;
use Data::Dumper;

# create object
$xml = new XML::Simple;

# read XML file
# $data = $xml->XMLin("first-info.xml");
$data = $xml->XMLin("sean_ride_2.xml");

foreach $e (@{$data->{Activities}->{Activity}->{Lap}->{Track}->{Trackpoint}})
{
	print $e->{Position}->{LatitudeDegrees}, "\n";
	print $e->{Position}->{LongitudeDegrees}, "\n";
}



