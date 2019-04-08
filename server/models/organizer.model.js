const mongoose = require('mongoose');

const organizerSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  admin: Boolean,
  checkIn: Boolean,
  admission: Boolean,
}, {
  timestamps: true
});

module.exports = mongoose.model('Organizer', organizerSchema, 'Organizers');
