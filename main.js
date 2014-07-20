var express = require('express')
	, http = require('http')
	, op3nvoice = require('node-op3nvoice')
	, app = express()
	, server = http.createServer(app);

app.use(express.static('public'));
app.use(express.static('css'));
app.use(express.static('scripts'));

var returnObject;
var client = new op3nvoice.Client("api-beta.op3nvoice.com", "aor68mmexQMeNSWEY5GG+SAYP7BKED+RWKVXL8lH2bjbg");
var queries;
var bundles, total=0;

function startProcess (resu) {
	// create file
	client = new op3nvoice.Client("api-beta.op3nvoice.com", "aor68mmexQMeNSWEY5GG+SAYP7BKED+RWKVXL8lH2bjbg");
	queries = ['like', 'well', 'so'];
	var data = {name: "test bundle", media_url: "https://www.dropbox.com/s/yc5nkwczaaw25eq/um test.mp3?dl=1"};

	returnObject = [{terms: queries}, {url: data.media_url}];

	client.createBundle(data, function(err, res){
		console.log('Uploading file');
		if(err) {
			console.log(err);
		}; 

		bundles = res;

		returnObject.push({id: bundles.id});

		waitForTracks(resu);
	});
}

function waitForTracks (resu) {
	// wait for processing to finish
	client.getTracks(bundles.id, function(err, res) {
		console.log('Checking if file is ready. This may take some time.');

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
	console.log('Getting statistics.')
	var queryCount = 0;
	queries.forEach(function(searchquery) {

		var wordAmounts=[], index=0;

		client.search({query:searchquery}, function(err, res) {
			if (err) {
				return console.log(err);
			};

			var results = res.item_results;
			var items = res._links.items;

			var length = 0;
			items.forEach(function (item) {

				var bundle_id = item.href.slice(12);

				var search_hits = results[index].term_results[0].matches[0].hits;
				console.log('Search term: "' + searchquery + '" occured ' + (search_hits).length + ' times.');
				
				var percent = 0;

				search_hits.forEach(function(search_hit) {
					console.log(search_hit.start + ' -- ' + search_hit.end);
					length+= search_hit.end-search_hit.start;
				});

				index++;
				total+=length;
			});
			percent = (length/getTracks.duration)*100;
			wordAmounts.push({name: searchquery, percent: percent});

			console.log('The total time of "' + searchquery + '" being spoken is: ' + length);
			console.log('And it is ' + percent + '% of your time');
			console.log('queryCont: ');
			console.log(queryCount );
			console.log(' queries.length-1: ');
			console.log(queries.length-1);

			queryCount++;
			if (queryCount == (queries.length-1)) {

				returnObject.push({wordPercents: wordAmounts});
				getPlayerData(resu, getTracks);
			}
		});
		
	});
	
}

function getPlayerData(resu, getTracks) {
	console.log('Getting jplayer data.');
	client.search({query:"um|uh|umm|uhh|like|well|so"}, function(err, res) {
				if (err) {
					return console.log(err);
				};

				var results = res.item_results;
				var items = res._links.items;
				returnObject.push({search_terms : JSON.stringify(res.search_terms)});
				returnObject.push({item_results : JSON.stringify(res.item_results)});
				returnObject.push({duration : getTracks.duration});

				console.log(returnObject);
				resu.send(returnObject);
			});
}

function deleteBundle() {
	console.log('Deleting audio file.');
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
