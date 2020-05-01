var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var TagSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },  
    createdDate: {
        type: Date,
        required: true,
    },
    updatedDate: {
        type: Date,
        required: true,
    }
});
var TagData = mongoose.model('TagData', TagSchema);
module.exports = TagData;
