var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server);
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var bcrypt = require('bcrypt');

/// MODEL ///
var users = require('./model/usuariosmodel');
var peliculas = require('./model/peliculasmodel');
/// VIEW ///
app.set('view engine', 'pug');
app.set('views', './views');
/// CONTROLLER ///
app.use('/peliculas', require('./controller/peliculas'));
// app.use('/usuarios', require('./controller/usuarios'));
// Apaño para crear una ruta absoluta para el CSS
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));

// VARS
var url = 'mongodb://localhost:27017/imdb';
var midb = 'imdb';

// LOG
var logger = function(request, response, next) {
  console.log('Request');
  next();
};
app.use(logger);

// PORT
server.listen(8000);

// Para tratar POST
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// HANDLERS SIMPLES
app.get('/', function(request, response) {
  console.log('request' + __dirname);
  response.sendFile(__dirname + '/index.html');
});

app.get('/signup', function(request, response) {
  console.log('request' + __dirname);
  response.sendFile(__dirname + '/signup.html');
});

app.get('/login', function(request, response) {
  console.log('request' + __dirname);
  response.sendFile(__dirname + '/views/login.html');
});

app.get('/recibe', function(request, response) {
  console.log('request' + __dirname);
  response.render('index', {
    title: 'Hey',
    message: 'Hello there!'
  });

});

// USER MANAGEMENT WITH MODEL AND MONGOOSE
app.post('/signupUser', function(request, response) {
  console.log("signing in...");
  if (request.body.email && request.body.pass && request.body.passConf) {
    console.log("body exists");
    datos = {
      email: request.body.email,
      pass: request.body.pass
    }

    console.log(datos);
    nuevo = new users(datos);

    nuevo.save(function(error, data) {
      if (error) {
        console.log(error);
        response.write('no se ha podido enviar');
        console.log('no se ha podido enviar');
      }
    });

  }

  response.sendFile(__dirname + '/index.html');

});

app.post('/loginUser', function(request, response) {

  console.log("logging in...");

  if (request.body.email && request.body.pass) {
    console.log("body exists");

    users.getAuthenticated(request.body.email, request.body.pass, function(err, user, reason) {
      if (err) throw err;

      // login was successful if we have a user
      if (user) {
        // handle login success
        console.log('login success');
        return;
      } else console.log('error en el login');
    });
    // FINDS ALL USERS
    /* users.find({},function(err, data){
             if (err){
                    console.log(err);
                    }else{
                          	console.log(data);
                    }

             });*/
  }
  response.sendFile(__dirname + '/loginok.html');

});

// GET, ADD, UPDATE, DELETE. Métodos sin mongoose
app.get('/getUsers', function(request, response) {

  mongo.connect(url, function(err, client) {
    assert.equal(null, err);
    db = client.db(midb);
    db.collection('usuarios').find().toArray(function(err, result) {
      console.log(result);
      client.close();
    });
  });
  response.sendFile(__dirname + '/login.html');
});

app.post('/addUser', function(request, response) {
  mongo.connect(url, function(err, client) {
    assert.equal(null, err);
    db = client.db(midb);
    item = {
      // email: "a@gmail.com",
      // pass: "1234"
      email: request.body.email,
      pass: request.body.pass
    };
    console.log(request.body);
    db.collection('usuarios').insertOne(item, function(err, result) {
      console.log('insertado');
      client.close();
    });
  });
  response.sendFile(__dirname + '/index.html');
});

app.get('/updateUser', function(request, response) {

  mongo.connect(url, function(err, client) {
    assert.equal(null, err);
    db = client.db(midb);
    where = {
      algo: {
        $exist: true
      },
      email: /^[a-z]/
    }
    nuevo = {
      $set: {
        name: 'manolo',
        email: 'manolo@gmail.com'
      }
    }
    db.collection('usuarios').updateMany(where, nuevo, function(err, result) {
      console.log('updated');
      client.close();
    });
  });
  response.sendFile(__dirname + '/index2.html');
});

app.get('/removeUser', function(request, response) {

  mongo.connect(url, function(err, client) {
    assert.equal(null, err);
    db = client.db(midb);
    query = {
      email: 'aaaa@aaaa.com'
    };
    db.collection('usuarios').deleteOne(query, function(err, result) {
      console.log('deleted');
      client.close();
    });
  });
  response.sendFile(__dirname + '/index2.html');
});


// CHAT
// io.sockets.on('connection', function(socket) {
//   socket.on('enviaMensaje', function(datos) {
//     io.sockets.emit('nuevoMensaje', {
//       msg: datos
//     });
//   });
// });
