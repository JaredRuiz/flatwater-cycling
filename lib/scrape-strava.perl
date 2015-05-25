#!/bin/env perl

# scrape-strava

use 5.010;
use open qw(:locale);
use strict;
use utf8;
use warnings qw(all);
use Mojo::UserAgent;

## general functions...

sub make_user_agent {
    my $ua = Mojo::UserAgent->new;

    if (scalar @_ == 1) {
        my $url = shift @_;
        $ua = $ua->get($url);
    }
    
    return $ua;
};

sub get_url_host {
    my $ua = shift @_;
    my $host = $ua->req->url->to_abs->host;
    return $host;
};

sub get_url_path {
    my $ua = shift @_;
    my $path = $ua->req->url->to_abs->path;
    return $path;
};

sub get_url {
    my $ua = shift @_;
    my $host = get_url_host($ua);
    my $path = get_url_host($ua);
    my $url = $host.$path;
    return $url;
};

sub list_page_title {
    my $ua = shift @_;
    return $ua->res->dom->at('html title')->text;
};

# Form POST (application/x-www-form-urlencoded) with exception handling
# my $ua = make_user_agent('http://www.math.unl.edu/~s-jruiz8/');
my $ua = make_user_agent('https://www.strava.com/login');
say list_page_title($ua);









# my $tx = $ua->post('https://www.strava.com/login' => form => {email => 'jedr05@hotmail.com', password => 'rose44', });



# my $tx = $ua->get('https://www.strava.com/login?email=jedr05@hotmail.com&password=rose44');
# if (my $res = $tx->success) { say $res->body }
# else {
#     my $err = $tx->error;
#     die "$err->{code} response: $err->{message}" if $err->{code};
#     die "Connection error: $err->{message}";
# }


# my $tx = $ua->get('https://www.strava.com/login')->res->dom->at('html title')->text;

