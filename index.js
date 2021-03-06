var express = require('express');
var bodyParser = require('body-parser');
var Expo = require('exponent-server-sdk');

// Create a new Expo SDK client
let expo = new Expo();

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// set port
app.set('port', (process.env.PORT || 5000));

app.get('/', (request, response) => {

  console.log(request)

  response.format({
    html: () => {
      response.json({
        title: '😄 Rmotr push notifications server',
        url: 'https://rmotr.com/',
        endpoints: [
          {
            url: '/notification',
            method: 'POST',
            description: 'Send push notification. Configured by the body object received { token, title, description, delay }.'
          },
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

app.post('/notification', (request, response) => {
  const { token, title, description, delay } = request.body;


  console.log(request)

  let isPushToken = Expo.isExponentPushToken(token);

  if (isPushToken) {
    sendPush(token, title, description, response, delay);
    setInterval(function() {
      sendPush(token, title, description, response, 0);
    },20 * 1000);

  } else {
    response.json({
        icon: '❌',
        message: 'Your token is invalid',
        token: token,
        status: 'error'
    });
  }
});

app.post('/welcome/:token', (request, response) => {

  console.log(request)

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

  console.log(request)

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


  console.log(request)

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

var sendPush = (token, title, description, response, delay) => {
  var delayPushNotification = delay || 0;

  var random = parseInt(Math.random() * 3);

  var pages = ['page-1','page-2','page-3']


  setTimeout(() => {
    expo.sendPushNotificationAsync({
      // The push token for the app user you want to send the notification to
      to: token,
      sound: 'default',
      //title: title || 'Push notification title',
      title: 'stesso titolo',
      body: description || 'Push notification description',
      data: {
        title,
        description,
        page:pages[random]
      },
    })
    .then((res) => {


      console.log(res)

      response.json({
            icon: '✅',
            message: title,
            description: description,
            token: token,
            status: 'sent',
            res: res
        });
    }, err => {


      console.log(err)

      response.json({
          icon: '❌',
          message: title,
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
