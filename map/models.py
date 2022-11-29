from django.db import models

class Marker(models.Model):
    marker_name = models.CharField(max_length=50, blank=True, null=True)
    marker_des = models.CharField(max_length=500, blank=True, null=True)
    marker_lat = models.FloatField()
    marker_lng = models.FloatField()

    def __str__(self):
        return self.marker_name