#!/usr/bin/perl

# use module
use XML::Simple;
use Data::Dumper;

# create object
$xml = new XML::Simple;

# open my $ride_data, $ARGV[0] or die "Could not open $1";

# read XML file
$data = $xml->XMLin("sean_ride.xml");
# $data = $xml->XMLin($ride_data);

foreach $e (@{$data->{Activities}->{Activity}->{Lap}->{Track}->{Trackpoint}})
{
    print $e->{Position}->{LatitudeDegrees}, "\n";
    print $e->{Position}->{LongitudeDegrees}, "\n";
}

foreach $e (@{$data->{Activities}->{Activity}->{Lap}->{Track}->{Trackpoint}})
{
    print $e->{Extensions}->{TPX}->{Speed}, "\n";
}

close $ride_data;
