const fs = require('fs');
const bcrypt = require('bcrypt');
const OrganizerModel = require('./models/organizer.model');
const config = require('./config');

let admin;
if (config.nodeEnv === 'test') {
  admin = {
    firstName: 'admin',
    lastName: 'adminpass',
    email: 'admin@hackathon.com',
    password: 'testpassword',
    admin: true,
    checkIn: true,
    admission: true
  };
} else {
  admin = JSON.parse(fs.readFileSync('../config/admin-info.json', 'utf8'));
}

async function create() {
  // hash password
  const passwordHash = bcrypt.hashSync(admin.password, 10);

  // create organizer object
  const organizer = new OrganizerModel({
    firstName: admin.firstName,
    lastName: admin.lastName,
    email: admin.email,
    passwordHash,
    admin: admin.admin,
    checkIn: admin.checkIn,
    admission: admin.admission
  });

  await OrganizerModel.findOne({ email: admin.email }).then(async user => {
    if (!user) {
      // store organizer in Mongo
      await organizer.save().catch(err => console.log(`Failed to create initial admin...${err}`));
    }
  });
}

module.exports = {
  createAdmin: create,
  adminOrganizer: admin
};
