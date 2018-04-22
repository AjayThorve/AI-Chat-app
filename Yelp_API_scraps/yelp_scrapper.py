from __future__ import print_function

import json
import pprint
import requests
import sys
import os.path
import boto3
import datetime
import time
from decimal import Decimal
import config
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

class YelpScrapper():
    '''
    class for scrapping data from yelp fusion api
    '''
    API_KEY= config.api_key
    
    # API constants, you shouldn't have to change these.
    API_HOST = 'https://api.yelp.com'
    SEARCH_PATH = '/v3/businesses/search'
    BUSINESS_PATH = '/v3/businesses/'  # Business ID will come after slash.

    set_of_rest = set()
    
    #to store data to dynamodb
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
    table = dynamodb.Table('yelp-restraunts')
    
    def request(self,host, path, api_key, url_params=None):
        """Given your API_KEY, send a GET request to the API.
        Args:
            host (str): The domain host of the API.
            path (str): The path of the API after the domain.
            API_KEY (str): Your API Key.
            url_params (dict): An optional set of query parameters in the request.
        Returns:
            dict: The JSON response from the request.
        Raises:
            HTTPError: An error occurs from the HTTP request.
        """
        url_params = url_params or {}
        url = '{0}{1}'.format(host, quote(path.encode('utf8')))
        headers = {
            'Authorization': 'Bearer %s' % api_key,
        }
        # print(u'Querying {0} ...'.format(url))

        response = requests.request('GET', url, headers=headers, params=url_params)
        return response.json()
    
    def search(self, term, location, offset):
        """Query the Search API by a search term and location.
        Args:
            term (str): The search term passed to the API.
            location (str): The search location passed to the API.
        Returns:
            dict: The JSON response from the request.
        """
        url_params = {
            'term': term.replace(' ', '+'),
            'location': location.replace(' ', '+'),
            'offset': offset,
            'limit': 50
        }
        a = self.request(self.API_HOST, self.SEARCH_PATH, self.API_KEY, url_params=url_params).get('businesses')
        filepath = 'FILE_1.csv'
        if a is not None:
            if not os.path.isfile(filepath):
                with open(filepath, 'w') as f:
                    f.write('RestrauntID,Cuisine,Rating,NumberOfReviews\n')
            fd = open(filepath,'a')
            for i in a:
                if i['id'] not in self.set_of_rest:
                    if self.insertDynamo(i):
                        temp_str = str(str(i['id'])+","+str(term.split(' ')[0])+","+str(i['rating'])+","+str(i['review_count'])+"\n")
                        fd.write(temp_str)
                        self.set_of_rest.add(i['id'])
                    else:
                        print("caught error row, skipping")
            fd.close()
    
    def processItem(self,item):
        ts = time.time()
        requested_keys = [ "id", "name", "coordinates","review_count", "rating"]
        updated_item = { temp_key: item[temp_key] for temp_key in requested_keys }
        try:
            updated_item['address'] = item['location']['address1'] +","+ item['location']['city']
            updated_item['zip_code'] = item['location']['zip_code']
            updated_item['coordinates']['latitude'] = Decimal(str(updated_item['coordinates']['latitude']))
            updated_item['coordinates']['longitude'] = Decimal(str(updated_item['coordinates']['longitude']))
            updated_item['rating'] = Decimal(str(updated_item['rating']))
            updated_item["insertedAtTimestamp"] = datetime.datetime.fromtimestamp(ts).strftime('%Y-%m-%d %H:%M:%S')
        except TypeError:
            return False
        updated_item = {k: v for k, v in updated_item.items() if v!=''}
        return updated_item
        
    def insertDynamo(self,item):
        updated_item = self.processItem(item)
        if not updated_item:
            return False
        response = self.table.put_item(Item=updated_item)
        return True