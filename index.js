var express = require('express');
var exponentServerSDK = require('exponent-server-sdk');

var app = express();
var delayPushNotification = 3000;

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.format({
    html: function(){
      response.json({
        title: '😄 Rmotr push notifications server',
        url: 'https://rmotr.com/',
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
          },
          {
            url: '/sendyo/:token/:from',
            method: 'POST',
            description: 'Send push notification with a YO to :token device'
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

app.post('/sendyo/:token/:from', function(request, response) {
  var token = request.params.token;
  var from = request.params.from;
  var message = 'YOmotr!';
  var description = from + ' send yo a YOmotr';

  sendPush(token, message, description, response);
});

var sendPush = function(token, message, description, response) {
  setTimeout(function() {
    exponentServerSDK.sendPushNotificationAsync({
      // The push token for the app user you want to send the notification to
      exponentPushToken: token,
      message: message,
      data: {
        response: message
      },
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
  }, delayPushNotification);
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
