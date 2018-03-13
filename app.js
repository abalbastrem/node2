var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
var mongo = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/midb';

server.listen(8000);

app.get('/',function(request,response){
	console.log('request' + __dirname);
	response.sendFile(__dirname + '/index.html');
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
		item = {nombre:'aaaa', email:'aaaa@aaaa.com'};
                db.collection('users').insertOne(item, function(err, result) {
                        console.log('insertado');
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
