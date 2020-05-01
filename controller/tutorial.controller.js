var mongoose = require('mongoose'),
    Tutorial = mongoose.model('Tutorial');
var fs = require('fs');

exports.AddTutorial = async function (req, res) {
    if (!req.body.title) {
        res.status(400).send({ message: "Title cannot be Empty" });
    }
    else {
        var imgData;
        var tutorialPath = "/uploads/tutorial";
        if (req.body.tutorialPic.indexOf(',') != -1 && req.body.tutorialPic.indexOf('png') != -1) {
            let base64ImgData = req.body.tutorialPic.split(",")[1];
            let buffer = await new Buffer(base64ImgData, 'base64');
            let image = await Jimp.read(buffer);
            image.resize(700, 400);
            image.quality(60);
            imgData = image;
        }
        else {
            imgData = req.tutorialPic.blogPic;
        }
        var tutId = (new Date().valueOf()).toString(36);
        var TutorialData = new Tutorial({
            title: req.body.title,
            user: req.body.userId,
            tutorialPic: imgData,
            tagData: req.body.tagData,
            urlId: tutId,
            previewText: req.body.previewText,
            createdDate: new Date().toDateString(),
            updatedDate: new Date().toDateString()
        });
        if (!fs.existsSync(tutorialPath)) {
            fs.mkdirSync(tutorialPath);
            fs.writeFile(tutorialPath + req.body.title + tutId + ".html", req.body.htmlContent, function (err) {
                if (err) throw err;
                console.log('File Saved');
            });
            fs.writeFile(tutorialPath + req.body.title + tutId + ".png", imgData, function (err) {
                if (err) throw err;
                console.log('File Saved');
            });
        }

        TutorialData.save(function (err, data) {
            console.log(data);
            if (err) {
                console.log(err);
                res.status(500).send({ message: "Some error occurred while creating the Tutorial." });
            }
            else {
                res.send(data);
            }
        });
    }
};


exports.UpdateTutorial = function (req, res) {
    Tutorial.findById(req.body.id, (err, Tutorial) => {
        // Handle any possible database errors
        if (err) {
            res.status(500).send(err);
        }
        else {
            // Update each attribute with any possible attribute that may have been submitted in the body of the request
            // If that attribute isn't in the request body, default back to whatever it was before.
            Tutorial.title = req.body.title || Tutorial.title;
            Tutorial.htmlString = req.body.htmlString || Tutorial.htmlString;
            Tutorial.updatedDate = new Date().toDateString();

            // Save the updated document back to the database
            Tutorial.save((err, Tutorial) => {
                if (err) {
                    res.status(500).send(err)
                }
                res.status(200).send(Tutorial);
            });
        }
    });
};

exports.GetAllTutorial = function (req, res) {


    Tutorial
        .find()
        .populate('user')
        .exec(function (err, tutorailList) {
            if (err) {
                res.send(err);
            }

            else
                res.json(tutorailList);
        });

};



exports.DeleteTutorialPost = function (req, res) {

    Tutorial.findByIdAndRemove(req.body.id, (err, doc) => {
        if (err) {
            res.send(err);
        }

        else {
            res.json("Success");
        }
    });
};

exports.GetAllTutorial = function (req, res) {


    Tutorial
        .find()
        .populate('user')
        .exec(function (err, tutorial) {
            if (err) {
                res.send(err);
            }

            else
                res.json(tutorial);
        });

};

exports.GetOneTutorial = function (req, res) {


    Tutorial
        .findOne({ urlId: req.query.urlId })
        .populate('user')
        .exec(function (err, tutorial) {
            if (err) {
                res.send(err);
            }

            else
                res.json(tutorial);
        });

};
