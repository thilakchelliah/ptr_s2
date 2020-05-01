var mongoose = require('mongoose'),
    BlogPost = mongoose.model('BlogPost'),
    Jimp = require('jimp'),
    fs = require('fs'),
    path = require('path'),
    blogPath = path.normalize(__dirname + "\\..\\" + "uploads/blog/");
debugger;
exports.AddBlogPost = async function (req, res) {
    debugger;
    if (!req.body.title) {
        res.status(400).send({ message: "Title cannot be Empty" });
    }
    else {
        var imgData;
        let base64ImgData;
        var blgId = (new Date().valueOf()).toString(36);
        if (!fs.existsSync(blogPath)) {
            fs.mkdirSync(blogPath, { recursive: true });
        }
        if (req.body.blogPic.indexOf(',') != -1 && req.body.blogPic.indexOf('png') != -1) {
            base64ImgData = req.body.blogPic.split(",")[1];
        }
        else
            base64ImgData = req.body.blogPic;
        let buffer = await new Buffer(base64ImgData, 'base64');
        let image = await Jimp.read(buffer);
        image.resize(700, 400);
        image.quality(60);
        image.write(blogPath + blgId + ".png");


        fs.writeFile(blogPath + blgId + ".html", req.body.htmlContent, function (err) {
            if (err) throw err;
            console.log('File Saved');
        });

        var BlogPostData = new BlogPost({
            title: req.body.title,
            user: req.body.userId,
            tagData: req.body.tagData,
            urlId: blgId,
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

            else {
                if (fs.existsSync(blogPath)) {
                    BlogPost.forEach(curObj => {
                        curObj.htmlString = fs.readFileSync(blogPath + curObj.urlId + ".html", 'utf8')
                        curObj.blogPic = "data:image/png;base64," + base64_encode(blogPath + curObj.urlId + ".png")
                    });
                }
                res.json(BlogPost);
            }
        });

};

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

exports.GetOneBlogPost = function (req, res) {


    BlogPost
        .findOne({ urlId: req.query.urlId })
        .populate('user')
        .exec(function (err, BlogPost) {
            if (err) {
                res.send(err);
            }

            else {
                if (fs.existsSync(blogPath)) {
                    BlogPost.htmlString = fs.readFileSync(blogPath + BlogPost.urlId + ".html", 'utf8')
                    BlogPost.blogPic = "data:image/png;base64," + base64_encode(blogPath + BlogPost.urlId + ".png")
                }
                res.json(BlogPost);
            }
        });

};
