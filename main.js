var express = require('express')
	, http = require('http')
	, app = express();

var server = http.createServer(app)

app.get('/', function(req, res) {
  res.send('hello world');
});

app.get('/derp', function(req, res) {
	res.send('derdddp');
});
app.listen(3000)
