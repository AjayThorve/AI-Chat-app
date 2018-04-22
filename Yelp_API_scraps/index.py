# -*- coding: utf-8 -*-
from __future__ import print_function

import argparse
import json
import pprint
import requests
import sys
import urllib
from yelp_scrapper import YelpScrapper
import dill as pickle
import os.path

# This client code can run on Python 2.x or 3.x.  Your imports can be
# simpler if you only need one of those.
try:
    # For Python 3.0 and later
    from urllib.error import HTTPError
    from urllib.parse import quote
    from urllib.parse import urlencode
except ImportError:
    # Fall back to Python 2's urllib2 and urllib
    from urllib2 import HTTPError
    from urllib import quote
    from urllib import urlencode

 # Defaults for our simple example.
DEFAULT_TERM = 'chinese restaurants'
DEFAULT_LOCATION = 'manhattan'
DEFAULT_SEARCH_LIMIT = 1000

def main():
    parser = argparse.ArgumentParser()

    parser.add_argument('-q', '--term', dest='term', default=DEFAULT_TERM,
                        type=str, help='Search term (default: %(default)s)')
    parser.add_argument('-l', '--location', dest='location',
                        default=DEFAULT_LOCATION, type=str,
                        help='Search location (default: %(default)s)')
    parser.add_argument('-li', '--limit', dest='limit',
                        default=DEFAULT_SEARCH_LIMIT, type=int,
                        help='Search location (default: %(default)s)')
    input_values = parser.parse_args()
    filename = 'scrapped_restraunts.obj'
    
    scrapper = YelpScrapper()
    
    if os.path.isfile(filename):
        print("loading object...")
        filehandler = open(filename, 'rb')
        scrapper.set_of_rest = pickle.load(filehandler)
    else:
        print("creating new object...")

    
    print("scrapped",scrapper)
    print("Currently loaded restraunts:",len(scrapper.set_of_rest))
    try:
        print("querying yelp api for",input_values.term,"...")
        for i in range(0,input_values.limit+1,50):
            scrapper.search(input_values.term, input_values.location,i+1)
    except HTTPError as error:
        sys.exit(
            'Encountered HTTP error {0} on {1}:\n {2}\nAbort program.'.format(
                error.code,
                error.url,
                error.read(),
            )
        )
    file_pi = open(filename, 'wb')
    pickle.dump(scrapper.set_of_rest, file_pi)


if __name__ == '__main__':
    main()