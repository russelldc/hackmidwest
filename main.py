from op3nvoice_python_2 import op3nvoice
import pprint
import time

op3nvoice.set_key('aor68mmexQMeNSWEY5GG+SAYP7BKED+RWKVXL8lH2bjbg')

# print 'derp'
bundles = op3nvoice.create_bundle(name='test bundle', media_url='http://www.moviesoundclips.net/download.php?id=1746&ft=wav')

queries = ['dogs', 'cats']
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
		print 'Search term: ' + searchquery
		bundle = op3nvoice.get_bundle(item['href'])

		bundle_id = item['href'][12:]		
		tracks = op3nvoice.get_track_list(bundle['_links']['o3v:tracks']['href'])['tracks']

		for track in tracks:
			print track['status']

		search_hits = results[index]['term_results'][0]['matches'][0]['hits']
		print str(len(search_hits)) + ' times'


		for search_hit in search_hits:
			print str(search_hit['start']) + ' -- ' + str(search_hit['end'])
			++index


op3nvoice.delete_bundle(bundles['id'])