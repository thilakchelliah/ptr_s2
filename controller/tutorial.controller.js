var mongoose = require('mongoose'),
    Tutorial = mongoose.model('Tutorial');
var fs = require('fs');

exports.AddTutorial = function (req, res) {
    if (!req.body.title) {
        res.status(400).send({ message: "Title cannot be Empty" });
    }
    else {
        var TutorialData = new Tutorial({
            title: req.body.title,
            tutorialLink: 'uploads/' + req.body.tutorialLink,
            urlFriendlyTitle: (req.body.title).replace(/\s/g, "-"),
            tags: req.body.tags,
            shortDesc: req.body.shortDesc,
            cardImageURL: req.body.cardImageURL,
            createdDate: new Date().toDateString(),
            updatedDate: new Date().toDateString()
        });

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

exports.uploadTutorialFile = function (req, res) {
    if (req.files.length != 0) {
        var fileName = req.files[0].filename;
        res.send(JSON.stringify({ "status": "success", "fileName": fileName }));
    }
    else
        res.status(500).send(JSON.stringify({ "status": "file Upload Failure" }));

};



exports.DeleteTutorialPost = function (req, res) {

    Tutorial.findByIdAndRemove(req.body.id, (err, doc) => {
        if (err) {
            res.send(err);
        }

        else {
            var filePath = "./public/" + doc.tutorialLink;
            fs.unlink(filePath, function (err) {
                if (err) {
                    console.log(err);
                    res.json("Failed");
                }
                console.log('file deleted successfully');
                res.json("Success");
            });

        }
    });
};

exports.GetAllTutorial = function(req, res) {


    Tutorial
        .find()
        .populate('user')
        .exec(function(err, tutorial) {
            if (err) {
                res.send(err);
            }

            else
                res.json(tutorial);
        });

};

exports.GetOneTutorial = function(req, res) {


    Tutorial
        .findOne({urlId:req.query.urlId})
        .populate('user')
        .exec(function(err, tutorial) {
            if (err) {
                res.send(err);
            }

            else
                res.json(tutorial);
        });

};
