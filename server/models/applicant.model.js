const mongoose = require('mongoose');

const applicantSchema = mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: String,
    // location: ???,
    resumePath: String
    // applicationQuestions: ???,
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Applicant', applicantSchema, 'Applicants');
