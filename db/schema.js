var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var SubscriberSchema = new Schema({
    account: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: String,
        default: '1'
    },
    language: {
        type: String,
        default: 'en'
    }
});
SubscriberSchema.plugin(uniqueValidator);


var QuestionSchema = new Schema({
    question: {
        type: String,
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true
    },
    yes: {
        type: String
    },
    no: {
        type: String
    },
    email: {
        type: String
    }
});
QuestionSchema.plugin(uniqueValidator);

exports.Subscriber = mongoose.model('Subscriber', SubscriberSchema);
exports.Question = mongoose.model('Question', QuestionSchema);
