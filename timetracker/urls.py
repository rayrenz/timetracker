from graphene_django.views import GraphQLView
from django.urls import path, include, re_path
from django.views.decorators.csrf import csrf_exempt
from rest_framework.schemas import get_schema_view

urlpatterns = [
    path('openapi', get_schema_view(title='My API', description='Nothing', version='10.0.0')),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
    path('', include('backend.urls')),
    re_path('.*', include('frontend.urls')),
] #+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
