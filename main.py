from op3nvoice_python_2 import op3nvoice

op3nvoice.set_key('aor68mmexQMeNSWEY5GG+SAYP7BKED+RWKVXL8lH2bjbg')

op3nvoice.create_bundle(name='test bundle', media_url='https://s3-us-west-2.amazonaws.com/op3nvoice/harvard-sentences-1.wav')

result = op3nvoice.search(query='open the crate')
results = result['item_results']
items = result['_links']['items']

index = 0

for item in items:
	bundle = op3nvoice.get_bundle(item['href'])
	print bundle['name']

	search_hits = results[index]['term_results'][0]['matches'][0]['hits']

	for search_hit in search_hits:
		print str(search_hit['start']) + ' -- ' + str(search_hit['end'])
		++index