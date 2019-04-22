// Handles all functions needed for JWT auth
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const organizerModel = require('./models/organizer.model');
const applicantModel = require('./models/applicant.model');
const config = require('./config');

// Checks that the token is valid and if so passes the request and response onto the callback function
function checkToken(req, res, next) {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (!token) {
    res.json({ success: false, message: 'Failed to supply Auth token' });
    return;
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.json({ success: false, message: 'Token is not valid' });
      return;
    }
    req.decoded = decoded;
    next();
  });
}

// TODO: authenticate applicant
function authenticateApplicant(req, res, applicant) {
  if (!bcrypt.compareSync(req.body.password, applicant.passwordHash)) {
    res.status(400).send({ success: false, message: 'Incorrect Password' });
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
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send({ success: false, message: 'Malformatted Input, no email or password' });
  }

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
}

module.exports = {
  checkToken,
  login
};
