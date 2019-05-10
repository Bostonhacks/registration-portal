/* eslint-disable */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const applicantModel = require('../models/applicant.model');
const seed = require('../admin-seed');
chai.should();

chai.use(chaiHttp);

describe('Applicants', () => {
  it('should clear the test database', done => {
    applicantModel.deleteMany({}, err => {
      done();
    });
  });

  describe('Test applicant endpoints', () => {
      it('should create a user', done => {
        let applicant = {
            firstName: 'Bobby',
            lastName: 'Alice',
            email: 'meowimacat@bu.edu',
            password: 'testpassword',
        };
        chai
        .request(server)
        .post('/api/applicants')
        .send(applicant)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          done();
        });
      });
  });

  // New tests go here
});