import logging
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
import boto3
import json
import time,datetime
from botocore.vendored import requests
import urllib
from urllib.error import HTTPError
from urllib.parse import quote
from urllib.parse import urlencode

test_queue_url = "https://sqs.us-east-1.amazonaws.com/XXXXXXXXXXXX/diningSuggestions"
api_key = "Yelp_api_key"
API_HOST = 'https://api.yelp.com'
SEARCH_PATH = '/v3/businesses/search'
BUSINESS_PATH = '/v3/businesses/'

def lambda_handler(event, context):
    str_body = str(event['Body'])
    json_body = json.loads(str_body)
    slots = json_body['currentIntent']['slots']
    # slots = event['Body']['currentIntent']['slots']

    receipt_handle = event['ReceiptHandle']
    time_req = str(slots['Date']+" "+slots['DiningTime'])
    time_stamp = datetime.datetime.strptime(time_req, "%Y-%m-%d %H:%M").timestamp()
    url_params = {
        "term": str(slots['Cuisine']+" food"),
        "location": slots['Location'],
        "sort_by": "rating",
        "open_at": int(time_stamp)
    }
    url = '{0}{1}'.format(API_HOST, quote(SEARCH_PATH.encode('utf8')))

    headers = {
        'Authorization': 'Bearer %s' % api_key,
    }

    logger.debug(u'Querying {0} ...'.format(url))
    logger.debug("url params:",url_params)
    response = requests.request('GET', url, headers=headers, params=url_params)
    phone = slots["Phone"]
    if len(phone) == 10:
        phone = "+1"+str(phone)

    logger.debug(response.text)
    data = response.text
    payload = {
        "receipt_handle": receipt_handle,
        "Phone": phone,
        "Data": data
    }
    task = json.dumps(payload)
    invokeWorkerLambda(task)


def invokeWorkerLambda(task):
    client = boto3.client('lambda')
    resp = client.invoke(
        FunctionName='arn:aws:lambda:us-east-1:XXXXXXXXXXXX:function:sendSMS',
        InvocationType='RequestResponse',
        Payload=task
    )
