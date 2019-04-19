const express = require('express');
const router = express.Router();
const auth = require('./auth');
const applicants = require('./controllers/applicant.controller');
const organizers = require('./controllers/organizer.controller');
const questions = require('./controllers/question.controller');

// specify api routes for logging in for both applicants and organizers
router.post('/api/login', auth.login);

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

// specify api routes for application questions
router.get('/api/questions', questions.findAll);

// test endpoint to see if the token was correctly encoding all data, will remove later
router.get('/testToken', auth.checkToken, (req, res) => {
    let email = req.decoded.email;
    if(email) {
        console.log(email);
        res.redirect(req.baseUrl + '/welcome.html');
    } else {
        console.log("NO EMAIL FOUND");
    }
});

// redirect all trafic to home page
router.get('/', (req, resp) => resp.redirect(req.baseUrl + '/welcome.html'));

module.exports = router;
