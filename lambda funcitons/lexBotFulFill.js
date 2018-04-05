var QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/XXXXXXXXXXXX/diningSuggestions';
var AWS = require('aws-sdk');
var sqs = new AWS.SQS({region : 'us-east-1'});

exports.handler = function(event, context, callback) {

  console.log("javascript version");
  var message = event.currentIntent.slots;
  console.log(message);
  var params = {
    MessageBody: JSON.stringify(event),
    QueueUrl: QUEUE_URL
  };
  sqs.sendMessage(params, function(err,data){
    if(err) {
      console.log('error:',"Fail Send Message" + err);
      context.done('error', "ERROR Put SQS");  // ERROR with message
    }else{
      console.log('data:',data.MessageId);
      context.done(null,'');  // SUCCESS
    }
  });

  var responseText = {
    "sessionAttributes": {
    },
    "dialogAction": {
      "type": "Close",
      "fulfillmentState": "Fulfilled",
      "message": {
        "contentType": "PlainText",
        "content": "Thanks, I have noted your request. If your request is valid, You will get an SMS soon. (If you do not receive an SMS within a couple of minutes, please retry)"
      }
    }
  }
  callback(null, responseText);
}
