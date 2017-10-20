var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailAddress: String,
    team: [{
        type: ObjectId,
        ref: 'Team'
    }]
}, {
    timestamps : true
});
userSchema.methods.generateHash=(password)=>{
	return bcrypt.hashSync(password,bcrypt.genSaltSync(8),null);
}
var User = mongoose.model('User', userSchema);
module.exports = User;