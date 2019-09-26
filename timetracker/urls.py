from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

urlpatterns = [
    path('', include('frontend.urls')),
    path('', include('backend.urls')),
] #+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
