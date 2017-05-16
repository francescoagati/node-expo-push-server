var express = require('express');
var Expo = require('exponent-server-sdk');

// Create a new Expo SDK client
let expo = new Expo();

var app = express();
var delayPushNotification = 3000;

app.set('port', (process.env.PORT || 5000));

app.get('/', (request, response) => {
  response.format({
    html: () => {
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

app.post('/welcome/:token', (request, response) => {
  var token = request.params.token;
  var message = 'Welcome to Rmotrgram!';
  var description = 'Push notification with welcome message to ' + token + ' device sent';

  let isPushToken = Expo.isExponentPushToken(token);

  if (isPushToken) {
    sendPush(token, message, description, response);
  } else {
    response.json({
        icon: '❌',
        message: 'Your token is invalid',
        token: token,
        status: 'error'
    });
  }
});

app.post('/photo/:token', (request, response) => {
  var token = request.params.token;
  var message = 'Your photo has been successfully uploaded!';
  var description = 'Push notification advising' + token + ' device photo is uploaded sent';

  if (isPushToken) {
    sendPush(token, message, description, response);
  } else {
    response.json({
        icon: '❌',
        message: 'Your token is invalid',
        token: token,
        status: 'error'
    });
  }
});

app.post('/sendyo/:token/:from', (request, response) => {
  var token = request.params.token;
  var from = request.params.from;
  var message = 'YOmotr! from ' + from;
  var description = from + ' send yo a YOmotr';

  if (isPushToken) {
    sendPush(token, message, description, response);
  } else {
    response.json({
        icon: '❌',
        message: 'Your token is invalid',
        token: token,
        status: 'error'
    });
  }
});

var sendPush = (token, message, description, response) => {
  setTimeout(() => {
    expo.sendPushNotificationAsync({
      // The push token for the app user you want to send the notification to
      to: token,
      sound: 'default',
      body: message,
      data: {
        response: message
      },
    })
    .then((res) => {
      response.json({
            icon: '✅',
            message: message,
            description: description,
            token: token,
            status: 'sent',
            res: res
        });
    }, err => {
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

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'));
});
