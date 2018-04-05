import logging
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def lambda_handler(event, context):
    # TODO implement
    intent_name = event['currentIntent']['name']

    logger.debug(event)

    if(str(intent_name) == "ThankYouIntent"):
        message = "Bubye, have a good one. If you need me, I will be right here!"
    elif(intent_name == "GreetingIntent"):
        message = "Hi there, How can I help?"

    val = {
      "dialogAction": {
        "type": "Close",
        "fulfillmentState": "Fulfilled",
        "message": {
          "contentType": "PlainText",
          "content": message
        }
      }
    }
    return val
