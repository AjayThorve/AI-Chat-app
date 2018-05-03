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

test_queue_url = "https://sqs.us-east-1.amazonaws.com/878823813267/diningSuggestions"
api_key = "JYBecCIDNufGfzq5BIYVfTrd5idsPjwY6RWbyTxkTWTZ7BZi9NQdawm2DGBGz3EwnQc2Wu8mM5uq1lHAG4Eby_T-ACe7uWU6Tr82FaCfgvKcHh5p3KhVIrfYQL--WnYx"
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
        
    
    data = response.text
    
    message = getMessage(data)
    
    payload = {
        "receipt_handle": receipt_handle,
        "Phone": phone,
        "message": message
    }
    task = json.dumps(payload)
    invokeWorkerLambda(task)


def invokeWorkerLambda(task):
    client = boto3.client('lambda')
    resp = client.invoke(
        FunctionName='arn:aws:lambda:us-east-1:878823813267:function:sendSMS',
        InvocationType='RequestResponse',
        Payload=task
    )

def getMessage(data):
    data = json.loads(data)
    rec1 = data["businesses"][0]
    rec2 = data["businesses"][1]
    rec3 = data["businesses"][2]
    
    restraunt1 = str("1."+rec1["name"]+","+rec1["location"]["address1"]+","+rec1["location"]["city"])
    restraunt2 = str("2."+rec2["name"]+","+rec2["location"]["address1"]+","+rec2["location"]["city"])
    restraunt3 = str("3."+rec3["name"]+","+rec3["location"]["address1"]+","+rec3["location"]["city"])
    
    message = str("hi user, the suggestions for you are: "+restraunt1+","+restraunt2+","+restraunt3)
    
    return message