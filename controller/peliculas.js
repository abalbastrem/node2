var express = require('express');
var router = express.Router(); // + '/peliculas/'
// router hereda un nuevo __dirname según la app llame este archivo con require

var indexStr = '<br><a href="/peliculas">INDEX</a>';

router.get('/', function(request, response) {
  response.sendFile(__dirname + '/index_peliculas.html');
});

router.get('/login', function(request, response) {
  response.send('login page'+ indexStr);
});

router.get('/logout', function(request, response) {
  response.send('logout page'+ indexStr);
});

// router.get('/signup', function(request, response) {
// 	if (request.body.email && request.body.pass && request.body.passConf) {
// 		datos = {
// 			email:request.body.email,
// 			pass: request.body.pass
// 		}
// 		nuevo = new users(datos);
// 		nuevo.save(function(error, data) {
// 			if (error) {
// 				console.log(error)
// 			}
// 		});
// 	}
// 		users.find({}, function(error, data) {
// 			if (error) {
// 				console.log(error);
// 			} else {
// 				console.log(data);
// 			}
// 		});
// 		response.sendFile(__dirname + '/index_peliculas.html');
// });

router.get('/list', function(request, response) {
  response.send('pelicula 1, pelicula 2' + indexStr);
});

router.get('/add', function(request, response) {
  response.sendFile(__dirname + '/add_pelicula.html');
});

router.get('/update', function(request, response) {
  response.sendFile(__dirname + '/update_pelicula.html');
});

router.get('/delete', function(request, response) {
  response.sendFile(__dirname + '/delete_pelicula.html');
});

router.get('/detail/:n([0-9]+)', function(request, response) {
  response.send('detalles pelicula concreta' + indexStr);
});

router.get('/view/:n([0-9]+)', function(request, response) {
  response.send('general pelicula concreta' + indexStr);
});

module.exports = router;
