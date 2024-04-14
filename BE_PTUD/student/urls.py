from django.urls import path
from . import views

app_name = 'student'
urlpatterns = [
    path('GetDanhSachSinhVien/', views.GetDanhSachSinhVien.as_view(), name='GetDanhSachSinhVien'),
]