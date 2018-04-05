const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
  // TODO implement
  console.log(event.userName);
  var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  var params = {
    GroupName: 'AIChatAppUsers', /* required */
    UserPoolId: 'us-east-1_XXXXXXXXX', /* required */
    Username: String(event.userName) /* required */
  };

  cognitoidentityserviceprovider.adminAddUserToGroup(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

  callback(null, event);

};
