var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bCrypt = require('bcrypt-nodejs');


var userSchema = new Schema({
    username: String,
    password: String,
    facebook         : {
        fb_id           : String,
        token        : String,
        name         : String
    },
    votes: Array
});

userSchema.methods.generateHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
}

userSchema.methods.validatePassword = function(password) {
    return bCrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', userSchema);