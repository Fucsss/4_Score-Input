from django.urls import path
from . import views

app_name = 'student'
urlpatterns = [
    path('GetDanhSachSinhVien/', views.GetDanhSachSinhVien.as_view(), name='GetDanhSachSinhVien'),
    path('AddSinhVien/', views.AddSinhVien.as_view(), name='AddSinhVien'), 
    path('RemoveSinhVien/', views.RemoveSinhVien.as_view(), name='RemoveSinhVien'),
    path('EditSinhVien/', views.EditSinhVien.as_view(), name='EditSinhVien'), 
]