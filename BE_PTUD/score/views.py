from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Score
from student.models import Class_Student
from classroom.models import Classroom

# Create your views here.
class GetDanhSachDiem(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        token = request.auth
        MaGiangVien = token.user.MaGiangVien
        MaLopHoc = request.data.get('MaLopHoc')
        classes = Class_Student.objects.filter(MaLopHoc=MaLopHoc)
        classroom = Classroom.objects.get(MaLopHoc=MaLopHoc)
        if classroom.MaGiangVien.MaGiangVien != MaGiangVien:
            return Response({'message': 'You do not have permission to view this class!'}, status=403)
        result = []
        for class_student in classes:
            MaSinhVien = class_student.MaSinhVien.MaSinhVien
            scores = Score.objects.filter(MaSinhVien=MaSinhVien, MaLopHoc=MaLopHoc)
            score_dict = {}
            for score in scores:
                score_dict[score.TenThanhPhanDiem] = score.Diem
            result.append({
                'MaSinhVien': MaSinhVien,
                'Scores': score_dict if score_dict else None
            })
        print(result)
        return Response(result)