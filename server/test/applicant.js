/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const applicantModel = require('../models/applicant.model');
const seed = require('../admin-seed');
chai.should();

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

describe('Organizers', () => {
  it('should clear the test database', done => {
    applicantModel.deleteMany({}, err => {
      done();
    });
  });

  describe('Example new test suite', () => {});

  // New tests go here
});