var express = require('express')
	, http = require('http')
	, op3nvoice = require('node-op3nvoice')
	, app = express()
	, server = http.createServer(app);

var client = new op3nvoice.Client("api-beta.op3nvoice.com", "aor68mmexQMeNSWEY5GG+SAYP7BKED+RWKVXL8lH2bjbg");
var queries = ['um', 'uh', 'umm', 'uhh', 'like', 'well', 'so'];
var bundles;

// create file
var data = {name: "test bundle", media_url: "https://www.dropbox.com/s/q3jmi6eo0z36k01/um test.wav?dl=1"};

client.createBundle(data, function(err, res){
	if(err) {
		console.log(err);
	}; 

	bundles = res;

	console.log('wait for tracks');
	waitForTracks();
});

function sleep_until (seconds) {
   var max_sec = new Date().getTime();
   while (new Date() < max_sec + seconds * 1000) {}
   return true;
}

function waitForTracks () {
	// wait for processing to finish
	var test = false;

	//while (!test) {
		console.log('while loop');



		client.getTracks(bundles.id, function(err, res) {
			console.log('inside get tracks callback');

			if(err) {
				console.log(err);
				process.exit();
			};

			if (res.status === 'ready') {
				test = true;
			};
		});

		//sleep_until(15);
	//};

	searchForTerms();
}

function searchForTerms() {
	// search for each query term
	for (searchquery in queries) {

		client.search({query:searchquery}, function(err, res) {
			if (err) {
				return console.log(err);
			};

			var results = res['item_results'];
			var items = res['_links']['items'];

			var index = 0;
			for (item in items) {
				var bundle = client.getBundlefunction(item['href']);

				var bundle_id = item['href'].slice(12);
				var tracks = client.getTracks(bundle['_links']['o3v:tracks']['href'])['tracks'];

				var search_hits = results[index]['term_results'][0]['matches'][0]['hits'];
				console.log('Search term: "' + searchquery + '" occured ' + (search_hits).length + ' times.')


				for (search_hit in search_hits) {
					console.log(search_hit['start'] + ' -- ' + search_hit['end']);
					index++;
				}
			}
		});

		deleteBundle();
	}
}

function deleteBundle() {
	console.log('Deleting audio file');
	client.removeBundle('/v1/bundles/' + bundles['id'], function(err, res) {
		if (err) {
			return console.log(err);
		};

		console.log(res);
	});
}




app.get('/', function(req, res) {
  res.send('hello world');
});

app.listen(3000)
