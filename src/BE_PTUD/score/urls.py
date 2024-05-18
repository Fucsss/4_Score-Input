from django.urls import path
from . import views

urlpatterns = [
    path('GetDanhSachDiem/', views.GetDanhSachDiem.as_view(), name = 'GetDanhSachDiem'),
    path('AddDiem/', views.AddDiem.as_view(), name = 'AddDiem'),
    path('AddDiemByFile/', views.AddDiemByFile.as_view(), name = 'AddDiemByFile'),
    path('UpdateDiem/', views.UpdateDiem.as_view(), name = 'UpdateDiem'),
    path('CreateNewColumnByFormula/', views.CreateNewColumnByFormula.as_view(), name = 'CreateNewColumnByFormula'),  
    path('Statistic/', views.GetStatistic.as_view(), name = 'Statistic'),
    path('DownloadBangDiem/', views.DownloadBangDiem.as_view(), name='DownloadBangDiem'),
]
