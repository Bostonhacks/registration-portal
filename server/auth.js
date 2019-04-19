// Handles all functions needed for JWT auth
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const organizerModel = require('./models/organizer.model');
const applicantModel = require('./models/applicant.model');
const config = require('./config');

// Checks that the token is valid and if so passes the request and response onto the callback function
function checkToken(req, res, next) {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    if(!token) {
        return res.json({success: false, message: 'Failed to supply Auth token'});
    }
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.json({success: false, message: 'Token is not valid'});
        } else {
            req.decoded = decoded;
            console.log(decoded);
            next();
        }
    });
}

// TODO: authenticate applicant
function authenticateApplicant(req, res, applicant) {
     if(!(bcrypt.compareSync(req.body.password, applicant.passwordHash))) {
         return res.status(400).send({success: false, message: 'Incorrect Password'});
     }
    
}

// authenticates an organizer and sends back their JWT token
function authenticateOrganizer(req, res, organizer) {
    if(!(bcrypt.compareSync(req.body.password, organizer.passwordHash))) {
        return res.status(400).send({success: false, message: 'Incorrect Password'});
    }

    console.log(req.body.email);
    let token = jwt.sign({email: req.body.email}, config.secret, {expiresIn: '24h'});

    res.json({
        success: true,
        message: 'Authentication Successful!',
        token: token
    });
}

// logs the user of applicant into the system and provides them with their JWT if their credentials are correct
async function login(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    if(!email || !password) {
        return res.status(400).send({success: false, message: 'Malformatted Input, no email or password'});
    }

    var organizer = await organizerModel.findOne({'email': email});
    if(organizer) {
        return authenticateOrganizer(req, res, organizer);
    }
    else {
        var applicant = await applicantModel.findOne({'email': email});
        if(!applicant) {
            return res.status(400).send({success: false, message: 'No applicant or organizer with that email found'})
        }
        return authenticateApplicant(req, res, applicant);
    }
} 

module.exports = {
    checkToken: checkToken,
    login: login,
};