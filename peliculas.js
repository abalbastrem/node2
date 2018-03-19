var express = require('express');
var router = express.Router();

var indexStr = '<br><a href="peliculas/">INDEX</a>';

router.get('/', function(request, response) {
  response.sendFile(__dirname + '/index_peliculas.html');
});

router.get('/login', function(request, response) {
  response.send('login page'+ indexStr);
});

router.get('/list', function(request, response) {
  response.send('pelicula 1, pelicula 2' + indexStr);
});

router.get('/add', function(request, response) {
  response.sendFile(__dirname + '/add_pelicula.html');
});

router.get('/update)', function(request, response) {
  response.sendFile(__dirname + '/update_pelicula.html');
});

router.get('/delete)', function(request, response) {
  response.sendFile(__dirname + '/delete_pelicula.html');
});

router.get('/detail/:n([0-9]+)', function(request, response) {
  response.send('pelicula concreta' + indexStr);
});

router.get('/view/:n([0-9]+)', function(request, response) {
  response.send('pelicula concreta' + indexStr);
});

module.exports = router;
