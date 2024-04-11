from django.db import models

# Create your models here.
class Student(models.Model):
    MaSinhVien = models.CharField(max_length=10, primary_key=True)
    HoVaTen = models.CharField(max_length=50, null=False)
    Email = models.EmailField()
    TenKhoa = models.CharField(max_length=50)
    SDT = models.CharField(max_length=10)