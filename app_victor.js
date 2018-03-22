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

app.use('/public',express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/peliculas', require('./peliculas'))
app.set('view engine', 'pug');
app.set('views', './views')

var url = 'mongodb://localhost:27017/';

var users = require('./usersmodel');



var logger = function(request, response, next){
	console.log('Request');
	next();
};
app.use(logger);

server.listen(8000);

app.post('/signup', function(request, response){
	
	if ( request.body.email && request.body.pass
	 && request.body.passConf ){
		 datos = {
			 email: request.body.email,
			 pass:request.body.pass
			 }
		 
		console.log(datos.pass)
		 nuevo = new users(datos);
		 nuevo.save(function(error,data){
				if (error){
					console.log(error);
					response.write('no se ha podido enviar');
					}
			 });
		 }
		 users.find({},function(err, data){
			 if (err){
				console.log(err);
				}else{
					console.log(data);
				}
			 
			 });
			 response.sendFile(__dirname + '/index.html');
		
});

app.post('/login', function(request, response){

       	if ( request.body.email && request.body.pass ){
                 datos = {
                         email: request.body.email,
                         pass:request.body.pass
                         }
		users.getAuthenticated(request.body.email, request.body.pass, function(err, user, reason) {
		if (err) throw err;

			// login was successful if we have a user
			if (user) {
			    // handle login success
			    console.log('login success');
			    return;
			}else             console.log('error en el login');
		});


                 }

 

                /* users.find({},function(err, data){
                         if (err){
                                console.log(err);
                                }else{
                                      	console.log(data);
                                }

                         });*/
                         response.sendFile(__dirname + '/loginok.html');

});


app.get('/recibe',function(request,response){
	console.log('request' + __dirname);
        response.render('index', { title: 'Hey', message: 'Hello there!'});

});


app.get('/login.html',function(request,response){
	console.log('request' + __dirname);
	response.sendFile(__dirname + '/login.html');
});


app.get('/',function(request,response){
	console.log('request' + __dirname);
	response.sendFile(__dirname + '/index2.html');
});


app.get('/removeUser',function(request,response){
	
	mongo.connect(url, function(err, client){
		assert.equal(null, err);
		db=client.db('midb');
		query = {email:'aaaa@aaaa.com'};
		db.collection('users').deleteOne(query, function(err, result){
			console.log('deleted');
			client.close();
			});
	});
	response.sendFile(__dirname + '/index.html');
});

app.get('/updateUser',function(request,response){
	
	mongo.connect(url, function(err, client){
		assert.equal(null, err);
		db=client.db('midb');
		where={algo:{$exist:true},email:/^[a-z]/}
		nuevo = { $set:{name:'manolo',email:'manolo@gmail.com'}}
		db.collection('users').updateMany(where, nuevo, function(err, result){
			console.log('updated');
			client.close();
			});
	});
	response.sendFile(__dirname + '/index.html');
});

 

app.get('/getUsers2',function(request,response){
	
	mongo.connect(url, function(err, client){
		assert.equal(null, err);
		db=client.db('midb');
		db.collection('users').find().toArray(function(err, result){
			console.log(result);
			client.close();
		});
	});
	response.sendFile(__dirname + '/index.html');
});


io.sockets.on('connection', function(socket){
	socket.on('enviaMensaje', function(datos){
		io.sockets.emit('nuevoMensaje',{msg:datos});
	});
});

