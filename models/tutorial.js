var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var TutorialSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    shortDesc: {
        type: String,
        required: true,
    },
    cardImageURL: {
        type: String,
        required: true,
    },
    tutorialLink: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    urlFriendlyTitle: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    tags: {
        type: String,
        required: true,
    },
    user: [{ type: Schema.ObjectId, ref: 'User' }],
    createdDate: {
        type: Date,
        required: true,
    },
    updatedDate: {
        type: Date,
        required: true,
    }
});
var Tutorial = mongoose.model('Tutorial', TutorialSchema);
module.exports = Tutorial;
