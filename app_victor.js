var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server);
// var request = require('request');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var bcrypt = require('bcrypt');

app.use('/peliculas', require('./peliculas'));
// Apaño para no afectar a __dirname y tenerlo todo en la raíz
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// CONFIG PARA VIEWS
// app.set('view engine', 'pug');
// app.set('views', './views');

var url = 'mongodb://localhost:27017/test';

var users = require('./usersmodel');

var logger = function(request, response, next) {
  console.log('Request');
  next();
};
app.use(logger);

server.listen(8000);

// HANDLERS
app.get('/', function(request, response) {
  console.log('request' + __dirname);
  response.sendFile(__dirname + '/index2.html');
});

app.get('/signup', function(request, response) {
  console.log('request' + __dirname);
  response.sendFile(__dirname + '/signup.html');
});

app.get('/login', function(request, response) {
  console.log('request' + __dirname);
  response.sendFile(__dirname + '/login.html');
});

//??? ¿Esto es un handler? ¿Busca por nombre y no por archivo? ¿Con pug?
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

    console.log(datos.pass);
    nuevo = new users(datos); //??? ¿Sirve sólo para comprobar 'datos'?

    nuevo.save(function(error, data) {
      if (error) {
        console.log(error);
        response.write('no se ha podido enviar');
      }
    });
  }

  users.find({}, function(err, data) { //??? ¿Qué es lo que pretende?
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }

  });
  response.sendFile(__dirname + '/index.html');

});

app.post('/loginUser', function(request, response) {

  console.log("loggin in...");

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
app.get('/getUsers2', function(request, response) {

  mongo.connect(url, function(err, client) {
    assert.equal(null, err);
    db = client.db('midb');
    db.collection('users').find().toArray(function(err, result) {
      //??? ¿Por qué 'users' y no 'usuarios'?
      console.log(result);
      client.close();
    });
  });
  response.sendFile(__dirname + '/index2.html');
});

app.get('/addUser', function(request, response) {
  mongo.connect(url, function(err, client) {
    assert.equal(null, err);
    db = client.db('midb');
    item = {
      // email: "a@gmail.com",
      // pass: "1234"
      email: request.request.email,
      pass: request.request.pass
    };
    console.log(request.query);
    db.collection('users').insertOne(item, function(err, result) {
      console.log('insertado');
      client.close();
    });
  });
  response.sendFile(__dirname + '/index.html');
});

app.get('/updateUser', function(request, response) {

  mongo.connect(url, function(err, client) {
    assert.equal(null, err);
    db = client.db('midb');
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
    db.collection('users').updateMany(where, nuevo, function(err, result) {
      console.log('updated');
      client.close();
    });
  });
  response.sendFile(__dirname + '/index2.html');
});

app.get('/removeUser', function(request, response) {

  mongo.connect(url, function(err, client) {
    assert.equal(null, err);
    db = client.db('midb');
    query = {
      email: 'aaaa@aaaa.com'
    };
    db.collection('users').deleteOne(query, function(err, result) { //??? ¿Por qué collection y no 'users'?
      console.log('deleted');
      client.close();
    });
  });
  response.sendFile(__dirname + '/index2.html');
});


io.sockets.on('connection', function(socket) {
  socket.on('enviaMensaje', function(datos) {
    io.sockets.emit('nuevoMensaje', {
      msg: datos
    });
  });
});
