from op3nvoice_python_2 import op3nvoice
import pprint
import time

op3nvoice.set_key('aor68mmexQMeNSWEY5GG+SAYP7BKED+RWKVXL8lH2bjbg')

bundles = op3nvoice.create_bundle(name='test bundle', media_url='https://www.dropbox.com/s/q3jmi6eo0z36k01/um test.wav?dl=1')
print 'Processing your audio file! This process may take up to a minute per minute of recorded audio.'

queries = ['um', 'uh', 'umm', 'uhh', 'like', 'well', 'so']
test = False
while test != True:
	if op3nvoice.get_track_list(bundles['_links']['o3v:tracks']['href'])['status'] == 'ready':
		test = True
	time.sleep(15)


for searchquery in queries:
	result = op3nvoice.search(query=searchquery)

	results = result['item_results']
	items = result['_links']['items']

	index = 0

	for item in items:
		bundle = op3nvoice.get_bundle(item['href'])

		bundle_id = item['href'][12:]		
		tracks = op3nvoice.get_track_list(bundle['_links']['o3v:tracks']['href'])['tracks']

		search_hits = results[index]['term_results'][0]['matches'][0]['hits']
		print 'Search term: "' + searchquery + '" occured ' + str(len(search_hits)) + ' times.'


		for search_hit in search_hits:
			print str(search_hit['start']) + ' -- ' + str(search_hit['end'])
			++index

print 'Deleting audio file'
op3nvoice.delete_bundle('/v1/bundles/' + bundles['id'])