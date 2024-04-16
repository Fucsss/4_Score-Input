from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Score
from student.models import Class_Student

# Create your views here.
class GetDanhSachDiem(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        MaLopHoc = request.data.get('MaLopHoc')
        classes = Class_Student.objects.filter(MaLopHoc=MaLopHoc)
        result = []
        for class_student in classes:
            MaSinhVien = class_student.MaSinhVien
            scores = Score.objects.filter(MaSinhVien=MaSinhVien, MaLopHoc=MaLopHoc)
            score_list = []
            for score in scores:
                score_list.append({
                    'TenThanhPhanDiem': score.TenThanhPhanDiem,
                    'Diem': score.Diem
                })
            result.append({
                'MaSinhVien': MaSinhVien,
                'Scores': score_list if score_list else None
            })
        return Response(result)