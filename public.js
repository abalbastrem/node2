var express = require('express');
var router = express.Router();

router.get('/', function(request, response) {
  console.log('request' + __dirname);
  response.sendFile(__dirname + '/index_pub.html');
});
