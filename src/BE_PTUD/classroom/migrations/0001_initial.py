# Generated by Django 5.0.1 on 2024-04-06 12:59

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('subject', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Classroom',
            fields=[
                ('MaLopHoc', models.CharField(auto_created=True, max_length=10, primary_key=True, serialize=False)),
                ('TenLopHoc', models.CharField(max_length=50)),
                ('TenPhongHoc', models.CharField(max_length=50)),
                ('NamHoc', models.CharField(max_length=10)),
                ('HocKy', models.IntegerField()),
                ('MaGiangVien', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('MaMonHoc', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='subject.subject')),
            ],
        ),
    ]