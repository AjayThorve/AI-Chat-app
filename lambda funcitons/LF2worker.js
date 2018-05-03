var TASK_QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/878823813267/diningSuggestions';
var AWS = require("aws-sdk");
var async = require('async');
var sqs = new AWS.SQS({region : 'us-east-1'});;
var lambda = new AWS.Lambda({region: 'us-east-1'});

function receiveMessages(callback) {
    console.log("here1");
    var params = {
        QueueUrl: TASK_QUEUE_URL,
        MaxNumberOfMessages: 10,
        VisibilityTimeout: 60, // seconds - how long we want a lock on this job
        WaitTimeSeconds: 3 // seconds - how long should we wait for a message?
    };
    sqs.receiveMessage(params, function(err, data) {
        if (err) {
            console.error(err, err.stack);
            callback(err);
        } else {
            callback(null, data.Messages);
        }
    });
}

function invokeWorkerLambda(task, callback) {
  var params = {
    FunctionName: "arn:aws:lambda:us-east-1:878823813267:function:RestrauntsSuggestionsLF2",
    InvocationType: 'Event',
    Payload: JSON.stringify(task)
  };
  lambda.invoke(params, function(err, data) {
    if (err) {
      console.error(err, err.stack);
      callback(err);
    } else {
      console.log(data);
      callback(null, data);
    }
  });
}

function handleSQSMessages(context, callback) {
    receiveMessages(function(err, messages) {
        if(err){
            console.log(err);
        }
        else if (messages && messages.length > 0) {
            var invocations = [];
            messages.forEach(function(message) {
                invocations.push(function(callback) {
                    invokeWorkerLambda(message, callback);
                });
            });
            async.parallel(invocations, function(err) {
                if (err) {
                    console.error(err, err.stack);
                    callback(err);
                } else {
                    if (context.getRemainingTimeInMillis() > 2000) {
                        handleSQSMessages(context, callback);
                    } else {
                        callback(null, 'PAUSE');
                    }
                }
            });
        } else {
            callback(null, 'DONE');
        }
    });
}

exports.handler = function(event, context, callback) {
    handleSQSMessages(context,callback);
};