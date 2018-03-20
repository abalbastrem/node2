var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require('body-parser');
// mongoose és un mòdul per mongo que permet fer coses xules, com schemas
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/peliculas', require('./peliculas'));

var url = 'mongodb://localhost:27017/midb';

mongoose.connect(url, function(error) {
	if (error) {
		console.log('no se ha podido conectar');
	}
});

// Con un esquema, obligamos a que los usuarios tengan una estructura
// de datos concreta
var userSchema = new mongoose.Schema({
	email:{
		type:String,
		unique:true,
		required:true
	},
	pass:{
		type:String,
		required:true,
	}
});

var users = mongoose.model('usuarios', userSchema);

server.listen(8000);

app.post('/signup', function(request, response) {
	if (request.body.email && request.body.pass && request.body.passConf) {
		datos = {
			email:request.body.email,
			pass: request.body.pass
		}
		nuevo = new users(datos);
		nuevo.save(function(error, data) {
			if (error) {
				console.log(error)
			}
		});
	}
		users.find({}, function(error, data) {
			if (error) {
				console.log(error);
			} else {
				console.log(data);
			}
		});
		response.sendFile(__dirname + '/index2.html');
});

app.get('/',function(request,response){
	console.log('request' + __dirname);
	response.sendFile(__dirname + '/index2.html');
});

app.get('/getUsers',function(request,response){
        console.log('request users');
	mongo.connect(url, function(err, client) {
		assert.equal(null, err);
		db = client.db('midb');
		db.collection('users').find().toArray(function(err, result) {
			console.log(result);
			client.close();
		});
	});
        response.sendFile(__dirname + '/index.html');
});

app.get('/addUser',function(request,response){
        mongo.connect(url, function(err, client) {
                assert.equal(null, err);
                db = client.db('midb');
								item = {nombre:request.body.nombre, email:request.body.email};
								console.log(request.body);
                db.collection('users').insertOne(item, function(err, result) {
                        console.log('insertado');
                        client.close();
                });
        });
        response.sendFile(__dirname + '/index.html');
});

app.get('/updateUser',function(request,response){
        mongo.connect(url, function(err, client) {
                assert.equal(null, err);
                db = client.db('midb');
								where = {email:/^[a-z]/};
								nuevo = { $set:{nombre:'manolo', email:'manolo@gmail.com'}};
                db.collection('users').updateMany(where, nuevo, function(err, result) {
                        console.log('updated');
                        client.close();
                });
        });
        response.sendFile(__dirname + '/index.html');
});

app.get('/removeUser',function(request,response){
        mongo.connect(url, function(err, client) {
                assert.equal(null, err);
                db = client.db('midb');
                query = {email:'aaaa@aaaa.com'};
                db.collection('users').deleteOne(query, function(err, result) {
                        console.log('borrado');
                        client.close();
                });
        });
        response.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
	socket.on('enviaMensaje', function(datos) {
		io.sockets.emit('nuevoMensaje',{msg:datos});
	});
});
