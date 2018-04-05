import boto3
import logging
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
# Create an SNS client
client = boto3.client("sns")
import json

test_queue_url = "https://sqs.us-east-1.amazonaws.com/XXXXXXXXXXXX/diningSuggestions"

def lambda_handler(event, context):
    # TODO implement
    # Send your sms message.
    logger.debug(event)
    data = json.loads(event["Data"])
    phone_number = event["Phone"]
    receipt_handle = event["receipt_handle"]

    rec1 = data["businesses"][0]
    rec2 = data["businesses"][1]
    rec3 = data["businesses"][2]

    restraunt1 = str("1."+rec1["name"]+","+rec1["location"]["address1"]+","+rec1["location"]["city"])
    restraunt2 = str("2."+rec2["name"]+","+rec2["location"]["address1"]+","+rec2["location"]["city"])
    restraunt3 = str("3."+rec3["name"]+","+rec3["location"]["address1"]+","+rec3["location"]["city"])

    message = str("hi user, the suggestions for you are: "+restraunt1+","+restraunt2+","+restraunt3)

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
