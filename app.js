var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/peliculas', require('./peliculas'));

var url = 'mongodb://localhost:27017/midb';

server.listen(8000);

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

app.post('/addUser',function(request,response){
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
