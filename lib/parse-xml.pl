#!/usr/bin/perl

# use module
use XML::Simple;
use Data::Dumper;

# create object
$xml = new XML::Simple;
$data = $xml->XMLin($ARGV[0]);

foreach $e (@{$data->{Activities}->{Activity}->{Lap}->{Track}->{Trackpoint}})
{
    print $e->{Position}->{LatitudeDegrees}, "\n";
    print $e->{Position}->{LongitudeDegrees}, "\n";
}

# foreach $e (@{$data->{Activities}->{Activity}->{Lap}->{Track}->{Trackpoint}})
# {
#     print $e->{Extensions}->{TPX}->{Speed}, "\n";
# }
