const express = require('express');
const router = express.Router();
const applicants = require('./controllers/applicant.controller')
const organizers = require('./controllers/organizer.controller')

// specify api routes for applicants
router.get('/api/applicants', applicants.findAll);
router.post('/api/applicants', applicants.create);
router.get('/api/applicants/:applicantId', applicants.findOne);
router.delete('/api/applicants/:applicantId', applicants.deleteOne);
router.put('/api/applicants/:applicantId', applicants.updateOne);

// specify api routes for organizers
router.get('/api/organizers', organizers.findAll);
router.post('/api/organizers', organizers.create);
router.get('/api/organizers/:organizerId', organizers.findOne);
router.delete('/api/organizers/:organizerId', organizers.deleteOne);
router.put('/api/organizers/:organizerId', organizers.updateOne);

// redirect all trafic to home page
router.get('/', (req, resp) => resp.redirect(req.baseUrl + '/welcome.html'));

module.exports = router;
