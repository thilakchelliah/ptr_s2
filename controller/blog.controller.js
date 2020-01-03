var mongoose = require('mongoose'),
    BlogPost = mongoose.model('BlogPost'),
    TagData = mongoose.model('TagData'),
    Jimp = require('jimp');

exports.AddBlogPost = async function (req, res) {
    if (!req.body.title) {
        res.status(400).send({ message: "Title cannot be Empty" });
    }
    else {
        var imgData = "";
        if (req.body.blogPic.indexOf(',') != -1 && req.body.blogPic.indexOf('png') != -1) {
            let base64ImgData = req.body.blogPic.split(",")[1];
            let buffer = await new Buffer(base64ImgData, 'base64');
            let image = await Jimp.read(buffer);
            image.resize(700, 400);
            image.quality(60);
            imgData = await image.getBase64Async(Jimp.MIME_PNG);
            console.log(imgData);
        }
        else {
            imgData = req.body.blogPic;
        }

        var BlogPostData = new BlogPost({
            title: req.body.title,
            htmlString: req.body.htmlContent,
            user: req.body.userId,
            blogPic: imgData,
            tagData: req.body.tagData,
            urlId: (new Date().valueOf()).toString(36),
            previewText: req.body.previewText,
            createdDate: new Date().toDateString(),
            updatedDate: new Date().toDateString()
        });
        console.log(BlogPostData);
        BlogPostData.save(function (err, data) {
            console.log(data);
            if (err) {
                console.log(err);
                res.status(500).send({ message: "Some error occurred while creating the Blog Post." });
            }
            else {
                res.send(data);
            }
        });
    }
};



exports.UpdateBlogPost = function (req, res) {
    BlogPost.findById(req.body.id, (err, BlogPost) => {
        // Handle any possible database errors
        if (err) {
            res.status(500).send(err);
        }
        else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            BlogPost.title = req.body.title || BlogPost.title;
            BlogPost.htmlString = req.body.htmlString || BlogPost.htmlString;
            BlogPost.updatedDate = new Date().toDateString();

            // Save the updated document back to the database
            BlogPost.save((err, BlogPost) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.status(200).send(BlogPost);
            });
        }
    });
};

exports.DeleteBlogPost = function (req, res) {
    BlogPost.findByIdAndRemove(req.body.id, (err) => {
        if (err) {
            res.send(err);
        }

        else
            res.json("Success");
    })
}


exports.GetAllBlogPost = function (req, res) {


    BlogPost
        .find()
        .populate('user')
        .exec(function (err, BlogPost) {
            if (err) {
                res.send(err);
            }

            else
                res.json(BlogPost);
        });

};

exports.GetOneBlogPost = function (req, res) {


    BlogPost
        .findOne({ urlId: req.query.urlId })
        .populate('user')
        .exec(function (err, BlogPost) {
            if (err) {
                res.send(err);
            }

            else
                res.json(BlogPost);
        });

};

exports.AddTag = async function (req, res) {
    if (!req.body.tag) {
        res.status(400).send({ message: "Tag cannot be Empty" });
    }
    else {

        var tagData = new TagData({
            name: req.body.tag,
            createdDate: new Date().toDateString(),
            updatedDate: new Date().toDateString()
        });
        console.log(tagData);
        tagData.save(function (err, data) {
            console.log(data);
            if (err) {
                console.log(err);
                res.status(500).send({ message: "Some error occurred while creating the tag." });
            }
            else {
                res.send(data);
            }
        });
    }
};
