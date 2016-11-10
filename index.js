var http = require('http');
var exponentServerSDK = require('exponent-server-sdk');

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('😄 Push notifications server\n');
}).listen(5000, 'localhost');

console.log('Server running at http://localhost:5000/');

// To check if something is a push token
var pushToken = 'ExponentPushToken[hKBh_RJaTJNWOB97_Wzb89]';
var isPushToken = exponentServerSDK.isExponentPushToken(pushToken);

// To send a push notification
exponentServerSDK.sendPushNotificationAsync({
  // The push token for the app user you want to send the notification to
  exponentPushToken: pushToken,
  message: "Soy una notificación de Rmotrgram",
  data: {withSome: 'data'},
})
.then(function(res) {
  console.log(res);
})
