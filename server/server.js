var express = require('express');
let port = process.env.PORT || 3000;
var app = express();
app.use(express.static('../client/dist/registration-portal'));
app.get('/', handleRoot);
app.listen(port);
console.log('server running on port ' + port);

function handleRoot(req, resp) {
     resp.redirect('index.html');
}
