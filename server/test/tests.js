/* eslint-disable */

const applicantModel = require('../models/applicant.model');
const organizerModel = require('../models/organizer.model');
const seed = require('../admin-seed');

process.env.NODE_ENV = 'test';

describe('Initialization', done => {
    it('should clear the test database', done => {
        applicantModel.deleteMany({}, err => {
            organizerModel.deleteMany({}, async err => {
                await seed.createAdmin();
                done();
            });
        });
    });
});

require('./organizer');
require('./applicant');
