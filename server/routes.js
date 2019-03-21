const express = require('express');
const router = express.Router();
const applicants = require('./controllers/applicant.controller')

// redirect all trafic to home page
router.get('/*', (req, resp) => resp.redirect(req.baseUrl + '/index.html'));

// specify api routes for applicants
router.get('/api/applicants', applicants.findAll);
router.post('/api/applicants', applicants.create);

router.get('/api/applicants/:applicantId', applicants.findOne);
router.delete('/api/applicants/:applicantId', applicants.deleteOne);

module.exports = router;
