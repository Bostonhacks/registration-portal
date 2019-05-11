/* eslint-disable */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

chai.should();
chai.use(chaiHttp);

describe('Applicants', () => {

  describe('Test applicant endpoints', () => {

      it('should create an applicant', done => {
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

      it('should fail to create an applicant with an invalid email', done => {
        let applicant = {
          firstName: 'Bob',
          lastName: 'Alice',
          email: 'bob.alice',
          password: 'testpassword'
        };
        chai
          .request(server)
          .post('/api/applicants')
          .send(applicant)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('success').eql(false);
            done();
          });
      });

      it('should fail to create an applicant with a duplicate email', done => {
        let applicant = {
          firstName: 'Bob',
          lastName: 'Alice',
          email: 'meowimacat@bu.edu',
          password: 'testpassword'
        };
        chai
          .request(server)
          .post('/api/organizers')
          .send(applicant)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('success').eql(false);
            done();
          });
      });

      it('should fail to login as new applicant with incorrect password', done => {
        chai
          .request(server)
          .post('/api/login')
          .send({ email: 'meowimacat@bu.edu', password: 'wrongpassword' })
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.be.a('object');
            res.body.should.have.property('success').eql(false);
            done();
          });
      });

      it('should login as new applicant', done => {
        let applicant = {
            email: 'meowimacat@bu.edu',
            password: 'testpassword'
        };
        chai
         .request(server)
         .post('/api/login')
         .send(applicant)
         .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success').eql(true);
            res.body.should.have.property('token');
            done();
         });
      });
  });

});