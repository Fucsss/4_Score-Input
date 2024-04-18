from django.urls import path
from . import views
app_name = 'teacher'
urlpatterns = [
    path('login/', views.loginAPIView.as_view(), name='login'),
    path('signup/', views.signupAPIView.as_view(), name='signup'),
    path('logout/', views.logoutAPIView.as_view(), name='logout'),
]