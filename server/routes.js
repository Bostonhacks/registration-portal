var express = require('express');
var router = express.Router();

// Redirect all trafic to home page
router.get('/*', (req, resp) => resp.redirect(req.baseUrl + '/index.html'));

module.exports = router;
