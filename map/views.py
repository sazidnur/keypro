from django.shortcuts import render, redirect, reverse
from .models import Marker

def index(request):
    marker = Marker.objects.all()
    return render(request, 'map/index.html', {'marker': marker})

def marker(request):
    if(request.method == 'POST'):
        marker_name = request.POST.get('marker_name')
        marker_des = request.POST.get('marker_des')
        marker_lat = request.POST.get('marker_lat')
        marker_lng = request.POST.get('marker_lng')

        marker = Marker(marker_name=marker_name, marker_des=marker_des, marker_lat=marker_lat, marker_lng=marker_lng)
        marker.save()

        return redirect(reverse('map'))

    return render(request, 'map/index.html')

def update(request):
    if(request.method == 'POST'):
        marker_id = request.POST.get('marker_id')
        marker_lat = request.POST.get('marker_lat')
        marker_lng = request.POST.get('marker_lng')
        Marker.objects.filter(id=marker_id).update(marker_lat=marker_lat, marker_lng=marker_lng)

        return redirect(reverse('map'))
    
    return render(request, 'map/index.html')

def delete(request, id):
  marker = Marker.objects.get(id=id)
  marker.delete()
  return redirect(reverse('map'))