var express = require('express')
	, http = require('http')
	, op3nvoice = require('node-op3nvoice')
	, app = express()
	, server = http.createServer(app);

var returnObject;
var client = new op3nvoice.Client("api-beta.op3nvoice.com", "aor68mmexQMeNSWEY5GG+SAYP7BKED+RWKVXL8lH2bjbg");
var queries = ['um', 'uh', 'umm', 'uhh', 'like', 'well', 'so'];
var bundles;

function startProcess (resu) {
	// create file
	client = new op3nvoice.Client("api-beta.op3nvoice.com", "aor68mmexQMeNSWEY5GG+SAYP7BKED+RWKVXL8lH2bjbg");
	queries = ['um', 'uh', 'umm', 'uhh', 'like', 'well', 'so'];
	var data = {name: "test bundle", media_url: "https://www.dropbox.com/s/q3jmi6eo0z36k01/um test.wav?dl=1"};

	returnObject = [{terms: queries}, {url: data.media_url}];

	client.createBundle(data, function(err, res){
		if(err) {
			console.log(err);
		}; 

		bundles = res;

		waitForTracks(resu);
	});
}

function waitForTracks (resu) {
	// wait for processing to finish
	client.getTracks(bundles.id, function(err, res) {
		console.log('inside get tracks callback');

		if(err) {
			console.log(err);
		}

		if (res.status === 'ready') {
			var getTracks = res.tracks[0];
			searchForTerms(resu, getTracks);

		} else {
			setImmediate(function () {
				setTimeout(function () {
					waitForTracks(resu);
				}, 15000)
			});
		}
	});
}

function searchForTerms(resu, getTracks) {
	// search for each query term
	
	// queries.forEach(function(searchquery) {

	// 	client.search({query:searchquery}, function(err, res) {
	// 		if (err) {
	// 			return console.log(err);
	// 		};

	// 		var results = res.item_results;
	// 		var items = res._links.items;

	// 		var index = 0;
	// 		items.forEach(function (item) {

	// 			var bundle_id = item.href.slice(12);

	// 			var search_hits = results[index].term_results[0].matches[0].hits;
	// 			console.log('Search term: "' + searchquery + '" occured ' + (search_hits).length + ' times.')


	// 			search_hits.forEach(function(search_hit) {
	// 				console.log(search_hit.start + ' -- ' + search_hit.end);
	// 				index++;
	// 			});
	// 		});
	// 	});
	
	// });
	client.search({query:"um|uh|umm|uhh|like|well|so"}, function(err, res) {
				if (err) {
					return console.log(err);
				};

				var results = res.item_results;
				var items = res._links.items;
				returnObject.push({search_terms : JSON.stringify(res.search_terms)});
				returnObject.push({item_results : JSON.stringify(res.item_results)});
				returnObject.push({media_url : getTracks.media_url});
				returnObject.push({duration : getTracks.duration});

				console.log(returnObject);
				resu.send(returnObject);
			});

	// deleteBundle(res);
}

function deleteBundle() {
	console.log('Deleting audio file');
	client.removeBundle(bundles.id, function(err, res) {
		if (err) {
			return console.log('error ' + err);
		};
	});
}


app.get('/', function(req, res) {
	res.sendfile('./index.html');
});

app.post('/info',function(req, res){
	startProcess(res);
});

app.post('/delete',function(req, res){
	deleteBundle();
	res.send('File deleted');
});

app.listen(3000)
