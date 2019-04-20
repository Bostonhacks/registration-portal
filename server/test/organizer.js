const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const organizerModel = require('../models/organizer.model');
const should = chai.should();

chai.use(chaiHttp);

describe('Organizers', () => {

  // Before each test delete all organizers from the database
  beforeEach((done) => {
    organizerModel.deleteMany({}, (err) => {
      done();
    });
  });

  describe('/POST create an organizer', () => {
    it('should create an organizer', (done) => {
      let organizer = {
        "firstName": "Bob",
        "lastName": "Alice",
        "email": "bob.alice@bu.edu",
        "password": "testpassword",
        "admin": true,
        "checkIn": true,
        "admission": true
      };
      chai.request(server)
          .post('/api/organizers')
          .send(organizer)
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

