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

// PeliculaSchema.methods.add = function() {
//   this.find({}, function(err, peliculas) {
//     return peliculas;
//   })
// };

PeliculaSchema.methods.update = function(datos) {
  this.where({
    Codpeli: datos.codpeli
  }).update({
    $set: {
      Sinopsi: datos.sinopsis, Titol: datos.titulo
    },
  }, function(err, nAfectadas) {
    if (err) return err;
    return nAfectadas;
  })
};

PeliculaSchema.methods.delete = function() {
  this.findOneAndDelete({
    Codpeli: datos.codigo
  }, function(err, n) {
    if (err) return err;
    return n;
  })
};

PeliculaSchema.methods.detail = function(datos) {
  this.findOne({
    Codpeli: datos.codpeli
  }, function(err, pelicula) {
    if (err) return err;
    return pelicula;
  })

};


module.exports = mongoose.model('peliculas', PeliculaSchema);
