var express = require('express');
var routes = require('./routes');
let port = process.env.PORT || 3000;
var app = express();
app.use(express.static('../client/dist/registration-portal'));
app.use('/', routes);
app.listen(port);
console.log('server running on port ' + port);
