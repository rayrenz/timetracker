from datetime import datetime
from rest_framework import viewsets
from .models import LogEntry
from .serializers import LogEntrySerializer


class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer
    http_method_names = ['put', 'get', 'post', 'delete']

    def get_queryset(self, *args, **kwargs):
        week = self.request.GET.get('week')
        if week:
            year = datetime.now().year
            start_date = datetime.strptime(f'{year}{week}{1}', '%G%V%w')
            end_date = datetime.strptime(f'{year}{week}{0}', '%G%V%w')
            return LogEntry.objects.filter(start__range=(start_date, end_date)).order_by('-start')
        return LogEntry.objects.all().order_by('-start')
