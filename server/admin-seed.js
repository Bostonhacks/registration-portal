const fs = require('fs');
const organizerModel = require('./models/organizer.model');
const bcrypt = require('bcrypt');
const config = require('./config');

var admin;
if(config.nodeEnv === 'test') {
    admin = {
        "firstName": "admin",
        "lastName": "adminpass",
        "email": "admin@hackathon.com",
        "password": "testpassword",
        "admin": true,
        "checkIn": true,
        "admission": true,
    };
} else {
    admin = JSON.parse(fs.readFileSync('../config/admin-info.json', 'utf8'));
}

async function create() {

    // hash password
    let passwordHash = bcrypt.hashSync(admin.password, 10);

    // create organizer object
    const organizer = new organizerModel({
        firstName: admin.firstName, 
        lastName: admin.lastName,
        email: admin.email,
        passwordHash: passwordHash,
        admin: admin.admin,
        checkIn: admin.checkIn,
        admission: admin.admission,
    });

    await organizerModel.findOne({email: admin.email}).then(async (user) => {
        if(!user) {
            // store organizer in Mongo
            await organizer.save()
            .catch(err => console.log('Failed to create initial admin'));
        }
    });
}

module.exports = {
    createAdmin: create,
    adminOrganizer: admin
};