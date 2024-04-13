from django.urls import path
from . import views

app_name = 'classroom'

urlpatterns = [
    path('GetDanhSachLopHoc/', views.GetDanhSachLopHoc.as_view(), name='GetDanhSachLopHoc'),
    path('AddLopHoc/', views.AddLopHoc.as_view(), name='AddLopHoc'),
]
