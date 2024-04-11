from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

# Create your models here.

class TeacherManager(BaseUserManager):
    def create_user(self, MaGiangVien, password=None, **extra_fields):
        if not MaGiangVien:
            raise ValueError('The MaGiangVien field must be set')
        teacher = self.model(MaGiangVien=MaGiangVien, **extra_fields)
        teacher.set_password(password)
        teacher.save(using=self._db)
        return teacher

    def create_superuser(self, MaGiangVien, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(MaGiangVien, password, **extra_fields)

class Teacher(AbstractBaseUser, PermissionsMixin):
    MaGiangVien = models.CharField(max_length=255, primary_key=True)
    HoVaTen = models.CharField(max_length=255)
    TenKhoa = models.CharField(max_length=255)
    Email = models.EmailField(max_length=255)
    SDT = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = TeacherManager()

    USERNAME_FIELD = 'MaGiangVien'
    REQUIRED_FIELDS = ['HoVaTen', 'TenKhoa', 'Email', 'SDT']

    def __str__(self):
        return self.MaGiangVien