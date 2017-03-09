console.log('hi')
var app = require('./server-config.js');

var port = 4568;

app.listen(port);
console.log('we are working!');
console.log('Server now listening on port ' + port);
