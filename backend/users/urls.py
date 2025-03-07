from django.urls import include, path
from rest_framework import routers
from rest_framework.documentation import include_docs_urls
from . import views

urlpatterns = [
    path('', views.all_profiles),
    path('signup/', views.signup),
    path('login/', views.login),
    path('profile/', views.profile),
    path('logout/', views.logout),
    path('users/<int:user_id>/delete/', views.delete_user, name='delete-user'),
]
