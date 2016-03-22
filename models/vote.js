var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require('./user');

var voteSchema = new Schema({
    thing1: {thing: String, votes: Number},
    thing2: {thing: String, votes: Number},
    date: Date,
    owner: {type: Schema.ObjectId, ref: 'User'},
    expiry: Date,
    active: Boolean
})

voteSchema.methods.addVote = function(int) {
    if (int === 1) {
        this.thing1.votes++
    }
    else {this.thing2.votes++}
    this.save();
}

module.exports = mongoose.model('Vote', voteSchema);