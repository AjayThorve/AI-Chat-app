import boto3
import logging
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
# Create an SNS client
client = boto3.client("sns")
import json

test_queue_url = "https://sqs.us-east-1.amazonaws.com/878823813267/diningSuggestions"

def lambda_handler(event, context):
    # TODO implement
    # Send your sms message.
    logger.debug(event)
    message = event["message"]
    phone_number = event["Phone"]
    receipt_handle = event["receipt_handle"]
    
    
    logger.debug(message)
    logger.debug(phone_number)
    
    client.publish(
        PhoneNumber=phone_number,
        Message=message
    )
    deleteQueueElement(receipt_handle)
    

def deleteQueueElement(receipt_handle):
    client = boto3.client('sqs')
    client.delete_message(QueueUrl=test_queue_url,ReceiptHandle=receipt_handle)
