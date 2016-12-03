var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var projectModel = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    developer: {
        type: String
    },
    client: {
        type: String
    },
    typeOfProject: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Project', projectModel);
