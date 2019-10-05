from django.db import models
from django.utils.timezone import now


class LogEntry(models.Model):
    task = models.CharField(max_length=10)
    description = models.CharField(max_length=200, blank=True, default='')
    start = models.DateTimeField(default=now, editable=True)
    end = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=1, default='o', blank=True)
