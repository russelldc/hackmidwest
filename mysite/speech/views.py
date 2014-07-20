from django.http import HttpResponse
from django.template import RequestContext, loader
from django.shortcuts import render

def index(request):
	template = loader.get_template('index.html')
	context = {'test_var': 'dkjfhd'}
	return render(request, 'index.html', context)