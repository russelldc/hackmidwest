'use strict';

// Requires meanio
var mean = require('meanio');
	//op3nvoice = require('node-op3nvoice');

// var client = new op3nvoice.Client('api-beta.op3nvoice.com', 'aor68mmexQMeNSWEY5GG+SAYP7BKED+RWKVXL8lH2bjbg');
// var opts = {};
// client.createBundle();

// Creates and serves mean application
mean.serve({ /*options placeholder*/ }, function(app, config) {
  console.log('Mean app started on port ' + config.port + ' (' + process.env.NODE_ENV + ')');
});
