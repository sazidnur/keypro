from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="map"),
    path('add-marker', views.marker, name="add-marker"),
    path('delete-marker/<int:id>', views.delete, name='delete-marker'),
    path('update-marker', views.update, name='update-marker'),
]
