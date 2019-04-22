const bcrypt = require('bcrypt');
const OrganizerModel = require('../models/organizer.model');
const ApplicantModel = require('../models/applicant.model');

function isAdmin(req, res, next) {
  if (req.decoded.admin) {
    next();
  } else {
    res.status(400).send({ success: false, message: 'Not an admin' });
  }
}

function create(req, res) {
  const { firstName, lastName, email, password, admin, checkIn, admission } = req.body;
  if (!(firstName && lastName && email && password && admin && checkIn && admission)) {
    res.status(400).send({ success: false, message: 'Malformed input' });
    return;
  }

  // Verify nobody exists as an applicant with that email
  ApplicantModel.findOne({ email }, (err, applicant) => {
    if (err) throw err;
    if (applicant) {
      res.status(403).send({ success: false, message: 'applicant with that email already exists' });
      return;
    }
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
      const organizer = new OrganizerModel({
        firstName,
        lastName,
        email,
        passwordHash,
        admin,
        checkIn,
        admission
      });

      // store applicant in Mongo
      organizer
        .save()
        .then(() => res.send({ success: true }))
        .catch(err => res.status(500).send({ message: err.message }));
    });
  });
}

function findAll(req, res) {}

function findOne(req, res) {}

function deleteOne(req, res) {}

function updateOne(req, res) {}

module.exports = {
  isAdmin,
  create,
  findAll,
  findOne,
  deleteOne,
  updateOne
};
