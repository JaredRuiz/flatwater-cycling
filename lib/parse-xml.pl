#!/usr/bin/perl

# use module
use XML::Simple;
use Data::Dumper;

# create object
$xml = new XML::Simple;
$data = $xml->XMLin($ARGV[0]);

## use this for .tcx data
# foreach $e (@{$data->{Activities}->{Activity}->{Lap}->{Track}->{Trackpoint}})
# {
#     print $e->{Position}->{LatitudeDegrees}, "\n";
#     print $e->{Position}->{LongitudeDegrees}, "\n";
# }

## this gives speed of .tcx data...
# foreach $e (@{$data->{Activities}->{Activity}->{Lap}->{Track}->{Trackpoint}})
# {
#     print $e->{Extensions}->{TPX}->{Speed}, "\n";
# }

## use this for .gpx data
print "var dataArray1 = [", "\n";
foreach $e (@{$data->{trk}->{trkseg}->{trkpt}}) 
{
    print "{ ";
    print "lat: '", $e->{lat}, "',", "\n";
    print "lon: '", $e->{lon}, "',", "\n";

    # regexp to get hour:minute:second out of time
    my $time = $e->{time};
    my ($year, $month, $day, $hour, $min, $sec) = $time =~ /^(\d\d\d\d)-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)/;

    # use some regexp to just get the seconds portion
    print "hour: '", $hour, "',", "\n";
    print "minute: '", $min, "',", "\n";
    print "second: '", $sec, "'\n";
    print "},", "\n";
}
print "];", "\n";
