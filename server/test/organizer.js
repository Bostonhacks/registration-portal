const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const organizerModel = require('../models/organizer.model');
const seed = require('../admin-seed');
const should = chai.should();

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

describe('Organizers', () => {
  it('should clear the test database', (done) => {
    organizerModel.deleteMany({}, async (err) => {
      await seed.createAdmin();
      done();
    });
  });

  describe('Test managing organizers', () => {
    var token;
    it('should log in as the default admin', (done) => {
      chai.request(server)
          .post('/api/login')
          .send({email: seed.adminOrganizer.email, password: seed.adminOrganizer.password})
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success').eql(true);
            res.body.should.have.property('token');
            token = res.body.token;
            done();
          });
    });
    it('should create an organizer', (done) => {
      let organizer = {
        "firstName": "Bob",
        "lastName": "Alice",
        "email": "bob.alice@bu.edu",
        "password": "testpassword",
        "admin": true,
        "checkIn": true,
        "admission": true,
      };
      chai.request(server)
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
  });

  describe('/POST create an organizer', () => {
    
  });

  // New tests go here
  
});

