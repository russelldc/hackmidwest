from op3nvoice_python_2 import op3nvoice
import pprint

op3nvoice.set_key('aor68mmexQMeNSWEY5GG+SAYP7BKED+RWKVXL8lH2bjbg')

# print 'derp'
# op3nvoice.create_bundle(name='test bundle', media_url='https://s3-us-west-2.amazonaws.com/op3nvoice/harvard-sentences-1.wav')
queries = ['dogs', 'cats']

for searchquery in queries:
	result = op3nvoice.search(query=searchquery)

	results = result['item_results']
	items = result['_links']['items']

	index = 0

	for item in items:
		print 'Search term: ' + searchquery
		bundle = op3nvoice.get_bundle(item['href'])

		bundle_id = item['href'][12:]		
		tl = op3nvoice.get_track_list(item['href'])
		
		# pprint.pprint(tl['_links']['o3v:tracks']['status'])

		# print tl['_links']['o3v:tracks']
		# for track in tracks['tracks']:
		# 	print track

		search_hits = results[index]['term_results'][0]['matches'][0]['hits']
		print str(len(search_hits)) + ' times'


		for search_hit in search_hits:
			print str(search_hit['start']) + ' -- ' + str(search_hit['end'])
			++index