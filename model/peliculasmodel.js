var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var url = 'mongodb://localhost:27017/imdb';

var db = mongoose.connect(url, function(error) {
  if (error) {
    console.log('no se ha podido conectar a relación PELÍCULAS');
  } else {
    console.log('conectado a la relación PELÍCULAS');
  }
});

var PeliculaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  sinopsis: {
    type: String,
    required: true
  }
});


PeliculaSchema.methods.list = function() {
  this.find({}, function(err, peliculas) {
		if (err) return err;
    return peliculas;
  })
};

PeliculaSchema.methods.add = function() {
  this.find({}, function(err, peliculas) {
    return peliculas;
  })
};

PeliculaSchema.methods.update = function() {
  this.findAll()

};

PeliculaSchema.methods.delete = function() {
  this.findAll()

};

PeliculaSchema.methods.detail = function(n) {
  this.findAll()

};


module.exports = mongoose.model('peliculas', PeliculaSchema);
