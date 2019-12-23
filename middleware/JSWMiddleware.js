var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') {
        var token = req.headers.authorization.split(' ')[1];
        
        // verifies secret and checks exp
        jwt.verify(token, global.config.jwt_secret, function(err, decoded) {
            if (err) { //failed verification.
                return res.status(401).send({ "error": true, ErrObj: err });
            }
            req.decoded = decoded;
            next(); //no error, proceed
        });
    }
    else {
        // forbidden without token
        return res.status(403).send({
            "error": true
        });
    }
}
