var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var url = 'mongodb://localhost:27017/';

var db = mongoose.connect(url,function(error){
		if (error){
				console.log('no se ha podido conectar');
		}
	});

var UserSchema = new mongoose.Schema({
	email:{
		type:String,
		unique:true,
		required:true
		},
	pass:{
		type:String,
		required:true
		}
	});

UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.pass, 10, function (err, hash){
    if (err) {
      return next(err);
    }
    user.pass = hash;
    next();
  })
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {

    bcrypt.compare(candidatePassword, this.pass, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


UserSchema.statics.getAuthenticated = function(email, password, cb) {
    this.findOne({ email: email }, function(err, user) {
        if (err) return cb(err);

        if (!user) {
            return cb(null, null, 'No existe el usuario');
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) return cb(err);

            if (isMatch) {
                    return cb(null, user);
            }

        });
    });
};



//var users = mongoose.model('usuarios',UserSchema);
module.exports = mongoose.model('usuarios', UserSchema);
