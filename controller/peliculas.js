var express = require('express');
var router = express.Router(); // + '/peliculas/'
var path = require('path');
// router hereda un nuevo __dirname según la app llame este archivo con require
// const ppath = "/home/users/inf/wiaw2/iaw46994355/node2/";
var peliculas = require('../model/peliculasmodel');

var indexStr = '<br><a href="/">INDEX</a>';

// HANDLERS
router.get('/add', function(request, response) {
  console.log('/views/add_pelicula.html');
  response.sendFile(path.join(__dirname, '../views', 'add_pelicula.html'));
});

router.get('/update', function(request, response) {
  response.sendFile(path.join(__dirname, '../views', 'update_pelicula.html'));
});

router.get('/delete', function(request, response) {
  response.sendFile(path.join(__dirname, '../views', 'delete_pelicula.html'));
});

/// HANDLERS QUE ES RESOLEN AL MOMENT ///
router.get('/list', function(request, response) {
  console.log("::::: REQ: " + request.originalUrl);
  console.log("listing peliculas...");
  peliculas.list(function(err, res) {
    if (err) {
      throw err;
    } else {
      response.write(res + "\n " + indexStr);
    }
  })
});

router.get('/detail/:n([0-9]+)', function(request, response) {
  datos = {
    codpeli: request.params.n
  }
  console.log(datos);
  peliculas.detail(datos, function(err, res) {
    if (err) {
      throw err;
    } else {
      response.write(res + "\n " + indexStr);
    }
  });
});

/// METHOD RESPONSES ///
// Crea un nou model a mà
router.post('/addPelicula', function(request, response) {
  console.log("::::: REQ: " + request.originalUrl);
  console.log("adding pelicula...");
  if (request.body.titulo && request.body.sinopsis) {
    console.log("body exists");
    datos = {
      titulo: request.body.titulo,
      sinopsis: request.body.sinopsis
    }
    console.log(datos);
    nuevo = new peliculas(datos);
    nuevo.save(function(error, data) {
      if (error) {
        console.log(error);
        response.write('no se ha podido enviar');
        console.log('no se ha podido enviar');
      }
    })
  };
  response.sendFile(path.join(__dirname, '../', 'index.html'));
});

router.post('/updatePelicula', function(request, response) {
  console.log("::::: REQ: " + request.originalUrl);
  console.log("updating pelicula...");
  if (request.body.titulo && request.body.sinopsis) {
    console.log("body exists");
    datos = {
      codpeli: request.body.codpeli,
      titulo: request.body.titulo,
      sinopsis: request.body.sinopsis
    }
    console.log(datos);
    peliculas.update(datos);
  };
  response.sendFile(path.join(__dirname, '../', 'index.html'));
});

router.post('/deletePelicula', function(request, response) {
  console.log("::::: REQ: " + request.originalUrl);
  console.log("deleting pelicula...");
  if (request.body.codpeli) {
    console.log("body exists");
    datos = {
      codpeli: request.body.codpeli
    }
    console.log(datos);
    peliculas.delete(datos);
  };
  response.sendFile(path.join(__dirname, '../', 'index.html'));
});
