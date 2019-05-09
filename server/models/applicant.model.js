const mongoose = require('mongoose');

const applicantSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    passwordHash: String,
    resume: String,
    applicationResponses: [{ type: String }]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Applicant', applicantSchema, 'Applicants');
