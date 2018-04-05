import logging
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def lambda_handler(event, context):
    return dispatch(event)


def dispatch(intent_request):
    intent_name = intent_request['currentIntent']['name']
    source = intent_request['invocationSource']
    phone = intent_request['currentIntent']['slots']['Phone']
    location = intent_request['currentIntent']['slots']['Location']

    if intent_name == "DiningSuggestionsIntent" and source == "DialogCodeHook":
        slots = intent_request['currentIntent']['slots']
        validate = validate_slots(phone, location)
        if validate == True:
            return delegate(intent_request['sessionAttributes'],intent_request['currentIntent']['slots'])
        else:
            slot_to_elicit = str(validate)
            logger.debug(validate)
            slots[slot_to_elicit] = None #violated slot
            return elicitSlot(intent_request['sessionAttributes'],slots,intent_name,slot_to_elicit)

def validate_slots(phone,location):

    if phone is None and location is None:
        return True
    if location is not None:
        if len(location) <= 2:
            logger.debug("m here")
            return "Location"
    if phone is not None:
        if len(phone) < 10 and phone is not None:
            return "Phone"
        elif len(phone) > 10 and phone[0] != "+" and phone is not None:
            return "Phone"
    return True

def validate_cuisine(value):
    cuisine_types = ['indian','chinese','japanese','thai','italian','asian','mediterranean']
    if value.lower() in cuisine_types:
        return True
    return False

def delegate(sessionAttributes,slots):
    ret_val = {
            "sessionAttributes": sessionAttributes,
            "dialogAction": {
                "type": "Delegate",
                "slots": slots
            }
        }
    return ret_val

def elicitSlot(sessionAttributes,slots,intent_name,slot_to_elicit):
    if slot_to_elicit == "Phone":
        message = "Invalid phone number, please enter again (10 digit number), if any other country than US, please enter country code with +"
    else:
        message = "invalid city name, please try again"
    ret_val = {
            "sessionAttributes": sessionAttributes,
            "dialogAction": {
                "type": "ElicitSlot",
                "intentName":intent_name,
                "slots": slots,
                "slotToElicit":slot_to_elicit,
                "message": {
                    "contentType": "PlainText",
                    "content": message
                }
            }
        }
    return ret_val
