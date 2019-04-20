const organizerModel = require('../models/organizer.model');
const bcrypt = require('bcrypt');

// TODO: Lock this endpoint down so only the admin can create a user 
// and make sure nobody with that email exists as an organizer or applicant before creating
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
  create: create,
  findAll: findAll,
  findOne: findOne,
  deleteOne: deleteOne,
  updateOne: updateOne,
};
