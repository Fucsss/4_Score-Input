from django.db import models

# Create your models here.
class Subject(models.Model):
    MaMonHoc = models.CharField(max_length=10, primary_key=True)
    TenMonHoc = models.CharField(max_length=50, null=False)
    SoTinChi = models.IntegerField()