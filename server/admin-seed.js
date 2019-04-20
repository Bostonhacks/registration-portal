const fs = require('fs');
const organizerModel = require('./models/organizer.model');
const bcrypt = require('bcrypt');
const admin = JSON.parse(fs.readFileSync('../config/admin-info.json', 'utf8'))

// hash password
let passwordHash = bcrypt.hashSync(admin.password, 10);

// create applicant object
const organizer = new organizerModel({
    firstName: admin.firstName, 
    lastName: admin.lastName,
    email: admin.email,
    passwordHash: passwordHash,
    admin: admin.admin,
    checkIn: admin.checkIn,
    admission: admin.admission,
});

organizerModel.findOne({email: admin.email}).then((user) => {
    if(!user) {
        // store applicant in Mongo
        organizer.save()
        .then(data => console.log('Created initial admin'))
        .catch(err => console.log('Failed to create initial admin'));
    } else {
        console.log('Admin user exists');
    }
});