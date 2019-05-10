/* eslint-disable */

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const organizerModel = require('../models/organizer.model');
const seed = require('../admin-seed');
chai.should();

chai.use(chaiHttp);

describe('Organizers', () => {
  it('should clear the test database', done => {
    organizerModel.deleteMany({}, async err => {
      await seed.createAdmin();
      done();
    });
  });

  describe('Test managing organizers', () => {
    let token = "";
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

    it('should fail to create an organizer with an invalid email', done => {
      let organizer = {
        firstName: 'Bob',
        lastName: 'Alice',
        email: 'bob.alice',
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

    it('should create an organizer', done => {
      let organizer = {
        firstName: 'Bob',
        lastName: 'Alice',
        email: 'bob.alice@bu.edu',
        password: 'testpassword',
        admin: false,
        checkIn: false,
        admission: false
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

    it('should fail to log in as organizer that has yet to be created', done => {
      chai
        .request(server)
        .post('/api/login')
        .send({ email: 'doesntexist@bu.edu', password: 'wrongpassword' })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    it('should fail to log in as new organizer with incorrect password', done => {
      chai
        .request(server)
        .post('/api/login')
        .send({ email: 'bob.alice@bu.edu', password: 'wrongpassword' })
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    let unprivilegedToken = "";
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
          unprivilegedToken = res.body.token;
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

    it('should fail to query all created organizers without token', done => {
      chai
        .request(server)
        .get('/api/organizers')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(false);
          done();
        });
    });

    let organizers = undefined;
    it('should query all created organizers', done => {
      chai
        .request(server)
        .get('/api/organizers')
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('organizers');
          organizers = res.body.organizers;
          done();
        });
    });

    it('should query the newly created organizer', done => {
      let organizer = organizers.filter(organizer => organizer.email === 'bob.alice@bu.edu')[0];
      chai
        .request(server)
        .get(`/api/organizers/${organizer._id}`)
        .set('Authorization', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('organizer');
          done();
        });
    });

    it('should update the first and last name of the newly created organizer', done => {
      let organizer = organizers.filter(organizer => organizer.email === 'bob.alice@bu.edu')[0];
      chai
      .request(server)
      .put(`/api/organizers/${organizer._id}`)
      .send({ firstName: 'newBob', lastName: 'newAlice' })
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('organizer');
        res.body.organizer.firstName.should.be.eql('newBob');
        done();
      });
    });

    it('should update the admin privilages of the newly created organizer', done => {
      let organizer = organizers.filter(organizer => organizer.email === 'bob.alice@bu.edu')[0];
      chai
      .request(server)
      .put(`/api/organizers/${organizer._id}`)
      .send({ admin: true })
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        res.body.should.have.property('organizer');
        res.body.organizer.admin.should.be.eql(true);
        done();
      });
    });

    it('should fail to delete an organizer because of the privileges of the new organizer', done => {
      let organizer = organizers.filter(organizer => organizer.email === 'bob.alice@bu.edu')[0];
      chai
      .request(server)
      .delete(`/api/organizers/${organizer._id}`)
      .set('Authorization', unprivilegedToken)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(false);
        done();
      });
    });

    it('should successfully delete new organizer', done => {
      let organizer = organizers.filter(organizer => organizer.email === 'bob.alice@bu.edu')[0];
      chai
      .request(server)
      .delete(`/api/organizers/${organizer._id}`)
      .set('Authorization', token)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        done();
      });
    });

  });

  describe('Example new test suite', () => {});

  // New tests go here
});
