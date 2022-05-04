var mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        datetime: {type: String, required: true},
        exercise_routine: {type: String, required: true},
        duration: {type: Number, required: true},
        user_id: {type: String, required: true},
        topic: {type: String, required: true},
        created_datetime: {type: String, required: true}
    },
    {
        timestamps: true,
    }
);

/**
* Message model class.
* @category models
* @class Message
* @constructor 
*/
function Message(){}

/**
* database object.
* 
* @property {database}  model - mongoose model.
*/
Message.prototype.model = mongoose.model("Message", messageSchema);

module.exports = new Message();