import pytz
from datetime import datetime
from django.utils.timezone import now
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import LogEntry
from .serializers import LogEntrySerializer


class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer
    http_method_names = ['put', 'get', 'post', 'delete']

    def get_queryset(self, *args, **kwargs):
        week = self.request.GET.get('week')
        my_status = self.request.GET.get('status')
        queryset = LogEntry.objects.filter().order_by('-start')
        if week:
            year = datetime.now().year
            start_date = datetime.strptime(f'{year}{week}{1}', '%G%V%w').astimezone(tz=pytz.timezone('Asia/Manila'))
            end_date = datetime.strptime(f'{year}{int(week)+1}{1}', '%G%V%w').astimezone(tz=pytz.timezone('Asia/Manila'))
            queryset = queryset.filter(start__range=(start_date, end_date))
        if my_status:
            queryset = queryset.filter(status=my_status)
        return queryset

    def create(self, request, *args, **kwargs):
        data = request.data
        latest = self.get_queryset().first()
        if (now() - latest.end).total_seconds() <= 180:
            data.update({'start': latest.end})
        else:
            data.update({'start': now()})
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
