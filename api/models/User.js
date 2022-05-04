var mongoose = require('mongoose');

function User(){}

const userSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        username: {type: String, required: true},
        password: {type: String, required: true},
        last_time_read: {type: String, default: null, required: false},
    },
    {
        timestamps: true,
    }
);

/**
* database object.
* 
* @property {database}  model - mongoose model.
*/
User.prototype.model = mongoose.model("User", userSchema);

module.exports = new User();