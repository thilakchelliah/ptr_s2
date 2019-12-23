var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var BlogPostSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    previewText: {
        type: String,
    },
    tagData: {
        type: String,
    },
    urlId:{
        type:String
    },
    user: [{ type: Schema.ObjectId, ref: 'User' }],
    htmlString: {
        type: String
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
var BlogPost = mongoose.model('BlogPost', BlogPostSchema);
module.exports = BlogPost;
