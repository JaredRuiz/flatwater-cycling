#!/usr/bin/perl

# use module
use XML::Simple;
use Data::Dumper;

# create object
$xml = new XML::Simple;

# read XML file
$data = $xml->XMLin("first-info.xml");

foreach $e (@{$data->{Activities}->{Activity}->{Lap}->[0]->{Track}->{Trackpoint}})
{
	print $e->{Position}->{LatitudeDegrees}, "\n";
	print $e->{Position}->{LongitudeDegrees}, "\n";
}



