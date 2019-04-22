const organizerModel = require('../models/organizer.model');
const applicantModel = require('../models/applicant.model');
const bcrypt = require('bcrypt');

function isAdmin(req, res, next) {
  if(req.decoded.admin) {
    next();
  } else {
    res.status(400).send({success: false, message: 'Not an admin'});
  }
}

function create(req, res) {
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;
  let email = req.body.email;
  let password = req.body.password;
  let admin = req.body.admin;
  let checkIn = req.body.checkIn;
  let admission = req.body.admission;

  if(!(firstName && lastName && email && password && admin && checkIn && admission)) {
    return res.status(400).send({success: false, message: "Malformed input"});
  }

  // Verify nobody exists as an applicant with that email
  applicantModel.findOne({email: email}, (err, applicant) => {
    if(applicant) {
      return res.status(403).send({success: false, message: "applicant with that email already exists"});
    }
    // Verify nobody exists as an organizer with that email
    organizerModel.findOne({email: email}, (err, duplicate) => {
      if(duplicate) {
        return res.status(403).send({success: false, message: "organizer with that email already exists"});
      }
      // If the email is unique, create the organizer

      // hash password
      let passwordHash = bcrypt.hashSync(password, 10);

      // create applicant object
      const organizer = new organizerModel({
        firstName: firstName, 
        lastName: lastName,
        email: email,
        passwordHash: passwordHash,
        admin: admin,
        checkIn: checkIn,
        admission: admission,
      });

      // store applicant in Mongo
      organizer.save()
      .then(data => res.send({success: true}))
      .catch(err => res.status(500).send({message: err.message}));
    });
  });

}

function findAll(req, res) {

}

function findOne(req, res) {

}

function deleteOne(req, res) {

}

function updateOne(req, res) {

}

module.exports = {
  isAdmin: isAdmin,
  create: create,
  findAll: findAll,
  findOne: findOne,
  deleteOne: deleteOne,
  updateOne: updateOne,
};
