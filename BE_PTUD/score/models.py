from django.db import models
from student.models import Student
from classroom.models import Classroom


# Create your models here.
class score(models.Model):
    MaSinhVien = models.ForeignKey(Student, on_delete=models.CASCADE)
    MaLopHoc = models.ForeignKey(Classroom, on_delete=models.CASCADE)
    TenThanhPhanDiem = models.CharField(max_length=50)
    Diem = models.FloatField()
    
    class Meta:
        unique_together = ('MaSinhVien', 'MaLopHoc', 'TenThanhPhanDiem')