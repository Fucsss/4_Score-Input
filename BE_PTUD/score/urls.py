from django.urls import path
from . import views

urlpatterns = [
    path('GetDanhSachDiem', views.GetDanhSachDiem.as_view(), name = 'GetDanhSachDiem'),
]
