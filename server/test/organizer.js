/* eslint-disable */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const organizerModel = require('../models/organizer.model');
const seed = require('../admin-seed');
chai.should();

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

describe('Organizers', () => {
  it('should clear the test database', done => {
    organizerModel.deleteMany({}, async err => {
      await seed.createAdmin();
      done();
    });
  });

  describe('Test managing organizers', () => {
    let token;
    it('should log in as the default admin', done => {
      chai
        .request(server)
        .post('/api/login')
        .send({ email: seed.adminOrganizer.email, password: seed.adminOrganizer.password })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('token');
          token = res.body.token;
          done();
        });
    });

    it('should create an organizer', done => {
      let organizer = {
        firstName: 'Bob',
        lastName: 'Alice',
        email: 'bob.alice@bu.edu',
        password: 'testpassword',
        admin: true,
        checkIn: true,
        admission: true
      };
      chai
        .request(server)
        .post('/api/organizers')
        .set('Authorization', token)
        .send(organizer)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          done();
        });
    });

    it('should log in as new organizer', done => {
      chai
        .request(server)
        .post('/api/login')
        .send({ email: 'bob.alice@bu.edu', password: 'testpassword' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('token');
          token = res.body.token;
          done();
        });
    });

    it('should fail to create an organizer with a missing field', done => {
      let organizer = {
        firstName: 'Bob',
        email: 'bob.alice@bu.edu',
        password: 'testpassword',
        admin: true,
        checkIn: true,
        admission: true
      };
      chai
        .request(server)
        .post('/api/organizers')
        .set('Authorization', token)
        .send(organizer)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('should fail to create an organizer with an identical email', done => {
      let organizer = {
        firstName: 'Bob',
        lastName: 'Alice2',
        email: 'bob.alice@bu.edu',
        password: 'testpassword',
        admin: true,
        checkIn: true,
        admission: true
      };
      chai
        .request(server)
        .post('/api/organizers')
        .set('Authorization', token)
        .send(organizer)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });
  });

  describe('Example new test suite', () => {});

  // New tests go here
});
