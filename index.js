var express = require('express');
var exponentServerSDK = require('exponent-server-sdk');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.format({
    html: function(){
      response.json({
        title: '😄 Rmotrgram push notifications server',
        endpoints: [
          {
            url: '/welcome/:token',
            method: 'POST',
            description: 'Send push notification with welcome message to :token device'
          },
          {
            url: '/photo/:token',
            method: 'POST',
            description: 'Send push notification advising :token device photo is uploaded'
          }
        ]
      })
    }
  });
});

app.post('/welcome/:token', function(request, response) {
  var token = request.params.token;
  var message = 'Welcome to Rmotrgram!';
  var description = 'Push notification with welcome message to ' + token + ' device sent';

  sendPush(token, message, description, response);
});

app.post('/photo/:token', function(request, response) {
  var token = request.params.token;
  var message = 'Your photo has been successfully uploaded!';
  var description = 'Push notification advising' + token + ' device photo is uploaded sent';

  sendPush(token, message, description, response);
});

var sendPush = function(token, message, description, response) {
  exponentServerSDK.sendPushNotificationAsync({
    // The push token for the app user you want to send the notification to
    exponentPushToken: token,
    message: message,
    // data: {withSome: 'data'},
  })
  .then(function(res) {
    response.json({
        icon: '✅',
        message: message,
        description: description,
        token: token,
        status: 'sent',
        res: res
    });
  }, function() {
    response.json({
        icon: '❌',
        message: message,
        description: description,
        token: token,
        status: 'error'
    });
  });
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
