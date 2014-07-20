from django.conf.urls import url

from speech import views

urlpatterns = [
	url(r'^$', views.index, name='index')
]