const bcrypt = require('bcrypt');
const ApplicantModel = require('../models/applicant.model');
const OrganizerModel = require('../models/organizer.model');
const Auth = require('../auth');

// checks if the applicant is querying themselves
function isSelf(req, res, next) {
  if (req.decoded.mongoId === req.params.applicantId) {
    next();
  } else {
    res.status(403).send({ success: false, message: 'Forbidden' });
  }
}

// creates an applicant and stores them in Mongo
function create(req, res) {
  const { firstName, lastName, email: emailAnycase, password } = req.body;
  const email = String(emailAnycase).toLowerCase();
  if (firstName && lastName && email && password) {
    // Validate email address
    if (!Auth.isValidEmail(email)) {
      res.status(400).send({ success: false, message: 'email is invalid' });
      return;
    }

    // Verify nobody exists as an applicant with that email
    ApplicantModel.findOne({ email }, (err, applicant) => {
      if (err) throw err;
      if (!applicant) {
        // Verify nobody exists as an organizer with that email
        OrganizerModel.findOne({ email }, (err, duplicate) => {
          if (err) throw err;
          if (duplicate) {
            res
              .status(403)
              .send({ success: false, message: 'organizer with that email already exists' });
            return;
          }
          // If the email is unique, create the organizer

          // hash password
          const passwordHash = bcrypt.hashSync(password, 10);

          // create applicant object
          const applicant = new ApplicantModel({
            firstName,
            lastName,
            email,
            passwordHash
          });

          // store applicant in Mongo
          applicant
            .save()
            .then(() => res.send({ success: true }))
            .catch(err => res.status(500).send({ message: err.message }));
        });
      } else {
        res
          .status(403)
          .send({ success: false, message: 'applicant with that email already exists' });
      }
    });
  } else {
    res.status(400).send({ success: false, message: 'Malformed input' });
  }
}

// returns a list of all applicants
function findAll(req, res) {
  ApplicantModel.find()
    .then(applicants => res.send(applicants))
    .catch(err => res.status(500).send({ message: err.message }));
}

function findOne(req, res) {}

function deleteOne(req, res) {}

function updateOne(req, res) {}

module.exports = {
  isSelf,
  create,
  findAll,
  findOne,
  deleteOne,
  updateOne
};
