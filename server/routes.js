const express = require('express');
const auth = require('./auth');
const applicants = require('./controllers/applicant.controller');
const organizers = require('./controllers/organizer.controller');
const questions = require('./controllers/question.controller');

const router = express.Router();

// specify api routes for logging in for both applicants and organizers
router.post('/api/login', auth.login);

// specify api routes for applicants
router.get('/api/applicants', auth.checkToken, organizers.isOrganizer, applicants.findAll);
router.post('/api/applicants', applicants.create);
router.get('/api/applicants/:applicantId', auth.checkToken, applicants.isSelf, applicants.findOne);
router.delete(
  '/api/applicants/:applicantId',
  auth.checkToken,
  organizers.isAdmin,
  applicants.deleteOne
);
router.put(
  '/api/applicants/:applicantId',
  auth.checkToken,
  applicants.isSelf,
  applicants.updateOne
);

// specify api routes for organizers
router.get('/api/organizers', auth.checkToken, organizers.isOrganizer, organizers.findAll);
router.post('/api/organizers', auth.checkToken, organizers.isAdmin, organizers.create);
router.get(
  '/api/organizers/:organizerId',
  auth.checkToken,
  organizers.isOrganizer,
  organizers.findOne
);
router.delete(
  '/api/organizers/:organizerId',
  auth.checkToken,
  organizers.isAdmin,
  organizers.deleteOne
);
// TODO: add ability for self to edit their info rather than only an admin
router.put(
  '/api/organizers/:organizerId',
  auth.checkToken,
  organizers.isAdmin,
  organizers.updateOne
);

// specify api routes for application questions
router.get('/api/questions', questions.findAll);

// redirect all trafic to home page
router.get('/', (req, resp) => resp.redirect(`${req.baseUrl}/welcome.html`));

module.exports = router;
