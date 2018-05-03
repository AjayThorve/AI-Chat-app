import logging
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
from botocore.vendored import requests
import urllib
import json
import boto3

host = 'https://search-aat414-74g35x3ff5baw4ct7midgbdb7i.us-east-1.es.amazonaws.com' 
path = 'predictions/_search' # the Elasticsearch API endpoint

def lambda_handler(event, context):
    # TODO implement
    str_body = str(event['Body'])
    json_body = json.loads(str_body)
    slots = json_body['currentIntent']['slots']
    
    # slots = event['Body']['currentIntent']['slots']
    
    '''
    if city is in any other location than manhattan, 
    call yelp api, else continue with querying for 
    Amazon ML suggested restraunts in elastic search.
    '''
    city = str(slots['Location'])
    
    if(city.lower() != "manhattan"):
        logger.debug("calling yelp api for city other than manhattan")
        invokeWorkerLambda(event)
    else:
        logger.debug("calling elastic search to get ML suggested restraunts for manhattan")
        phone = slots['Phone']
        if len(phone) == 10:
            phone = "+1"+str(phone)
        receipt_handle = event['ReceiptHandle']
    
        result_list = queryElasticSearch(slots['Cuisine'])
        
        restraunts = importFromDynamo(result_list)
        
        message = getMessage(restraunts)
        
        payload = {
            "receipt_handle": receipt_handle,
            "Phone": phone,
            "message": message
        }
        task = json.dumps(payload)
        logger.debug(task)
        invokeSendSMSLambda(task)
    

def invokeSendSMSLambda(task):
    client = boto3.client('lambda')
    resp = client.invoke(
        FunctionName='arn:aws:lambda:us-east-1:878823813267:function:sendSMS',
        InvocationType='RequestResponse',
        Payload=task
    )
    logger.debug(resp)

def importFromDynamo(result_list):
    dynamo_client = boto3.client('dynamodb')
    
    response = dynamo_client.batch_get_item(
         RequestItems={
            'yelp-restraunts':{
                'Keys':[
                    {
                        'id':{
                            'S':result_list[0],
                        }
                    },
                    {
                        'id':{
                            'S':result_list[1],
                        }
                    },
                    {
                        'id':{
                            'S':result_list[2],
                        }
                    }
                ]
            }
        }
    )
    return response['Responses']['yelp-restraunts']
    
    
    
def invokeWorkerLambda(task):
    logger.debug("herllo")
    logger.debug(type(task))
    client = boto3.client('lambda')
    response = client.invoke(
        FunctionName='arn:aws:lambda:us-east-1:878823813267:function:CallYelpAPI',
        InvocationType='Event',
        Payload=json.dumps(task)
    )
    

def getMessage(restraunts):
    restraunt1 = str("1."+restraunts[0]["name"]["S"]+","+restraunts[0]["address"]["S"])
    restraunt2 = str("2."+restraunts[1]["name"]["S"]+","+restraunts[1]["address"]["S"])
    restraunt3 = str("3."+restraunts[2]["name"]["S"]+","+restraunts[2]["address"]["S"])
    
    message = str("hi user, the suggestions for you are: "+restraunt1+","+restraunt2+","+restraunt3)
    return message
    
    
def queryElasticSearch(cuisine):
    url = host +"/"+ path
    
    temp_dict = {'q':cuisine,"sort":"score:desc","from" : 0, "size" : 3}
    
    params = urllib.parse.urlencode(temp_dict)
    
    url = url+"?"+params
    
    r = requests.get(url)
    
    results = json.loads(r.text)
    
    result_list = []
    
    for i in results["hits"]["hits"]:
        result_list.append(i["_id"])
    
    return result_list