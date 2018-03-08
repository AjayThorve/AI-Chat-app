function getResponse(message,callback){
  if(message.toLowerCase().indexOf("hi") != -1 || message.toLowerCase().indexOf("hello") != -1){
    callback("Hi User");
  }else if(message.toLowerCase().indexOf("gm") != -1 || message.toLowerCase().indexOf("good morning") != -1 || message.toLowerCase().indexOf("gd morning") != -1){
    callback("Good Morning!");
  }else if(message.toLowerCase().indexOf("gn") != -1 || message.toLowerCase().indexOf("good night") != -1 || message.toLowerCase().indexOf("gd night") != -1){
    callback("Good night, sleep tight!");
  }else if(message.toLowerCase().indexOf("gd") != -1 || message.toLowerCase().indexOf("good day") != -1 || message.toLowerCase().indexOf("gd day") != -1){
    callback("Good day!");
  }else if(message.toLowerCase().indexOf("bye") != -1 || message.toLowerCase().indexOf("cya") != -1 || message.toLowerCase().indexOf("later") != -1 ||  message.toLowerCase().indexOf("bubyee") != -1 || message.toLowerCase().indexOf("see you") != -1){
    callback("Bubye, have a good time!");
  }else if(message.toLowerCase().indexOf("hru") != -1 || message.toLowerCase().indexOf("hows you") != -1 || message.toLowerCase().indexOf("how's u") != -1 ||  message.toLowerCase().indexOf("bubyee") != -1 || message.toLowerCase().indexOf("how are you") != -1){
    callback("I am good, thank you. I hope you are doing well!");
  }else{
    callback("I am sorry, I don't understand. I am still under development");
  }
}
exports.handler = (event, context, callback) => {
  var message = event.content;
  getResponse(message, function(responseText){
    callback(null, responseText);
  });
};
