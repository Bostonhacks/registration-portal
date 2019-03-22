const mongoose = require('mongoose');

const applicantSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
}, {
  timestamps: true
});

module.exports = mongoose.model('Applicant', applicantSchema, 'Applicants');
