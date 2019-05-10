const bcrypt = require('bcrypt');
const auth = require('../auth');
const OrganizerModel = require('../models/organizer.model');
const ApplicantModel = require('../models/applicant.model');

// Checks if a user is an organizer then exectues the next function if they are
function isOrganizer(req, res, next) {
  if (req.decoded.organizer) {
    next();
  } else {
    res.status(403).send({ success: false, message: 'Not an organizer' });
  }
}

// Checks if an organizer has admin privlages then executes the next function if they do
function isAdmin(req, res, next) {
  if (req.decoded.admin) {
    next();
  } else {
    res.status(403).send({ success: false, message: 'Not an admin' });
  }
}

function create(req, res) {
  const {
    firstName,
    lastName,
    email: emailAnycase,
    password,
    admin,
    checkIn,
    admission
  } = req.body;
  const email = String(emailAnycase).toLowerCase();
  if (
    firstName &&
    lastName &&
    email &&
    password &&
    admin !== undefined &&
    checkIn !== undefined &&
    admission !== undefined
  ) {
    // Validate email address
    if (!auth.isValidEmail(email)) {
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

// Finds all organizers
function findAll(req, res) {
  OrganizerModel.find({}, { passwordHash: 0 }, (err, organizers) => {
    if (err) throw err;
    res.send({ success: true, organizers });
  });
}

// Finds an organizer by ID
function findOne(req, res) {
  const id = req.params.organizerId;
  OrganizerModel.findById(id, { passwordHash: 0 }, (err, organizer) => {
    if (err) throw err;
    if (organizer) {
      res.send({ success: true, organizer });
    } else {
      res.send({ success: false, message: 'organizer does not exist' });
    }
  });
}

// Deletes an organizer by ID
function deleteOne(req, res) {
  const id = req.params.organizerId;
  OrganizerModel.findByIdAndDelete(id, (err, organizer) => {
    if (err) throw err;
    if (organizer) {
      res.send({ success: true, message: 'successfully removed' });
    } else {
      res.send({ success: false, message: 'organizer does not exist' });
    }
  });
}

/*
 * Updates an organizer by ID
 * will only update first or last name, and admission/admin/checkin privlages
 */
function updateOne(req, res) {
  const id = req.params.organizerId;
  const updates = {};
  updates.firstName = req.body.firstName ? req.body.firstName : undefined;
  updates.lastName = req.body.lastName ? req.body.lastName : undefined;
  updates.admin = req.body.admin !== undefined ? req.body.admin : undefined;
  updates.admission = req.body.admission !== undefined ? req.body.admission : undefined;
  updates.checkIn = req.body.checkIn !== undefined ? req.body.checkIn : undefined;
  OrganizerModel.findByIdAndUpdate(
    id,
    updates,
    { new: true, omitUndefined: true },
    (err, organizer) => {
      if (err) throw err;
      if (organizer) {
        res.send({ success: true, organizer });
      } else {
        res.send({ success: false, message: 'organizer does not exist' });
      }
    }
  );
}

module.exports = {
  isOrganizer,
  isAdmin,
  create,
  findAll,
  findOne,
  deleteOne,
  updateOne
};
