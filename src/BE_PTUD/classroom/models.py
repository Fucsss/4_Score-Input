from django.db import models
from subject.models import Subject
from teacher.models import Teacher
# Create your models here.

class Classroom(models.Model):
    MaLopHoc = models.CharField(auto_created=True, max_length=10, primary_key=True)
    TenLopHoc = models.CharField(max_length=50, null=False)
    TenPhongHoc = models.CharField(max_length=50)
    MaMonHoc = models.ForeignKey(Subject, on_delete=models.CASCADE)
    MaGiangVien = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    NamHoc = models.CharField(max_length=10)
    HocKy = models.IntegerField()