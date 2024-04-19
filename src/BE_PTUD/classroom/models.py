from django.db import models
from subject.models import Subject
from teacher.models import Teacher
# Create your models here.
def generate_class_code():
    # Get the highest current code
    max_code = Classroom.objects.all().aggregate(models.Max('MaLopHoc'))['MaLopHoc__max']
    if max_code is None:
        new_code = "LH00001"
    else:
        num = int(max_code[2:]) + 1  # Extract the number part of the code and increment it
        new_code = "LH" + str(num).zfill(5)  # Create the new code
    return new_code

class Classroom(models.Model):
    MaLopHoc = models.CharField(max_length=10, primary_key=True, default=generate_class_code)
    TenLopHoc = models.CharField(max_length=50, null=False)
    TenPhongHoc = models.CharField(max_length=50)
    MaMonHoc = models.ForeignKey(Subject, on_delete=models.CASCADE)
    MaGiangVien = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    NamHoc = models.CharField(max_length=10)
    HocKy = models.IntegerField()