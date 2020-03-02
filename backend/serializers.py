from rest_framework import serializers
from backend.models.backend import LogEntry


class LogEntrySerializer(serializers.ModelSerializer):
    start = serializers.DateTimeField(required=False)
    end = serializers.DateTimeField(required=False, allow_null=True)

    def get_start(self, obj):
        return obj.start.isoformat()

    def get_end(self, obj):
        return obj.end.isoformat() if obj.end else None

    class Meta:
        model = LogEntry
        fields = '__all__'
