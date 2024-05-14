from django.db import models
from classroom.models import Classroom

# Create your models here.
def generate_student_code():
    max_code = Student.objects.all().aggregate(models.Max('MaSinhVien'))['MaSinhVien__max']
    if max_code is None:
        new_code = "SV00001"
    else:
        num = int(max_code[2:]) + 1  
        new_code = "SV" + str(num).zfill(5)
    return new_code

class Student(models.Model):
    MaSinhVien = models.CharField(max_length=10, primary_key=True, default=generate_student_code)
    HoVaTen = models.CharField(max_length=50, null=False)
    Email = models.EmailField()
    TenKhoa = models.CharField(max_length=50)
    SDT = models.CharField(max_length=10)
    

class Class_Student(models.Model):
    MaSinhVien = models.ForeignKey(Student, on_delete=models.CASCADE)
    MaLopHoc = models.ForeignKey(Classroom, on_delete=models.CASCADE)
