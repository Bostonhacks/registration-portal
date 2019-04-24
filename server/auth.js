// Handles all functions needed for JWT auth
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const organizerModel = require('./models/organizer.model');
const applicantModel = require('./models/applicant.model');
const config = require('./config');

// Validates the inputted email is a real email
function isValidEmail(email) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email));
}

// Checks that the token is valid and if so passes the request and response onto the callback function
function checkToken(req, res, next) {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (!token) {
    res.status(400).send({ success: false, message: 'Failed to supply Auth token' });
    return;
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.status(400).send({ success: false, message: 'Token is not valid' });
      return;
    }
    req.decoded = decoded;
    next();
  });
}

// TODO: authenticate applicant
function authenticateApplicant(req, res, applicant) {
  if (!bcrypt.compareSync(req.body.password, applicant.passwordHash)) {
    res.status(403).send({ success: false, message: 'Incorrect Password' });
  }
}

// authenticates an organizer and sends back their JWT token
function authenticateOrganizer(req, res, organizer) {
  if (!bcrypt.compareSync(req.body.password, organizer.passwordHash)) {
    res.status(403).send({ success: false, message: 'Incorrect Password' });
    return;
  }

  const token = jwt.sign(
    {
      email: req.body.email,
      organizer: true,
      admin: organizer.admin,
      checkIn: organizer.checkIn,
      admission: organizer.admission
    },
    config.secret,
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: 'Authentication Successful!',
    token
  });
}

// logs the user of applicant into the system and provides them with their JWT if their credentials are correct
async function login(req, res) {
  const { email: emailAnycase, password } = req.body;
  const email = String(emailAnycase).toLowerCase();

  if (email && password) {
    const organizer = await organizerModel.findOne({ email });
    if (organizer) {
      authenticateOrganizer(req, res, organizer);
    } else {
      const applicant = await applicantModel.findOne({ email });
      if (!applicant) {
        res
          .status(404)
          .send({ success: false, message: 'No applicant or organizer with that email found' });
      } else {
        authenticateApplicant(req, res, applicant);
      }
    }
  } else {
    res.status(403).send({ success: false, message: 'Malformed input' });
  }
}

module.exports = {
  isValidEmail,
  checkToken,
  login
};
