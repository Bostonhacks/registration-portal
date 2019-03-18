var express = require('express');
var router = express.Router();

function handleRoot(req, resp) {
  resp.redirect(req.baseUrl + '/index.html');
}

router.get('/*', handleRoot);

module.exports = router;
