var express = require('express');
var router = express.Router(); // + '/peliculas/'
var path = require('path');

router.get('/', function(request, response) {
  response.sendFile(__dirname + '/index_peliculas.html');
});

router.get('/signup', function(request, response) {
  response.send('logout page'+ indexStr);
});

router.get('/login', function(request, response) {
  response.send('login page'+ indexStr);
});

router.get('/logout', function(request, response) {
  response.send('logout page'+ indexStr);
});

module.exports = router;
