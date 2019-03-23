const applicantModel = require('../models/applicant.model');

// creates an applicant and stores them in Mongo
function create(req, res) {
  // validate user info
  if(!req.body.firstName || !req.body.lastName) {
    return res.status(400).send({message: 'Malformatted Input'});
  }

  // create applicant object
  const applicant = new applicantModel({firstName: req.body.firstName, lastName: req.body.lastName});

  // store applicant in Mongo
  applicant.save()
  .then(data => res.send(data))
  .catch(err => res.status(500).send({message: err.message}));
}

// returns a list of all applicants
function findAll(req, res) {
  applicantModel.find()
  .then(applicants => res.send(applicants))
  .catch(err => res.status(500).send({message: err.message}));
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
