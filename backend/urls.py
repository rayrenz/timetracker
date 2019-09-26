from rest_framework import routers
from .views import LogEntryViewSet

router = routers.SimpleRouter()

router.register('api/logs', LogEntryViewSet)

urlpatterns = router.urls
