var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

var lexruntime = new AWS.LexRuntime();



function getResponse(message,callback){
  var params = {
    botAlias: 'sam',
    botName: 'GetRestrauntInfo', /* required, the name of you bot */
    inputText: message, /* required, your text */
    userId: '1234', /* required, arbitrary identifier */
  };
  lexruntime.postText(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     {
      console.log(data);           // successful response
      callback(data.message);
    }
  });
}
exports.handler = (event, context, callback) => {
  var message = event.content;
  getResponse(message, function(responseText){
    callback(null, responseText);
  });
};
