from django.urls import path
from . import views

app_name = 'subject'
urlpatterns = [
    path('GetDanhSachMonHoc/', views.GetDanhSachMonHoc.as_view(), name='GetDanhSachMonHoc'),
    path('AddMonHoc/', views.AddMonHoc.as_view(), name='AddMonHoc'),
]