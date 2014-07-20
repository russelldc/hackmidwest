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

function waitForTracks () {
	// wait for processing to finish
	client.getTracks(bundles.id, function(err, res) {
		console.log('inside get tracks callback');

		if(err) {
			console.log(err);
		}

		if (res.status === 'ready') {
			searchForTerms();

		} else {
			setImmediate(function () {
				setTimeout(waitForTracks, 15000);
			});
		}
	});
}

function searchForTerms() {
	// search for each query term
	
	queries.forEach(function(searchquery) {


		client.search({query:searchquery}, function(err, res) {
			if (err) {
				return console.log(err);
			};

			var results = res.item_results;
			var items = res._links.items;

			var index = 0;
			items.forEach(function (item) {

				var bundle_id = item.href.slice(12);

				var search_hits = results[index].term_results[0].matches[0].hits;
				console.log('Search term: "' + searchquery + '" occured ' + (search_hits).length + ' times.')


				search_hits.forEach(function(search_hit) {
					console.log(search_hit.start + ' -- ' + search_hit.end);
					index++;
				});
			});
		});
	
	});

	deleteBundle();
}

function deleteBundle() {
	console.log('Deleting audio file');
	client.removeBundle(bundles.id, function(err, res) {
		if (err) {
			return console.log('error ' + err);
		};
		console.log(res);
	});
}


app.get('/', function(req, res) {

	res.sendfile('./index.html');
});

app.listen(3000)
