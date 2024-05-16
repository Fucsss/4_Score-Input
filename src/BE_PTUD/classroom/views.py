from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Classroom
from subject.models import Subject
from teacher.models import Teacher
import json

# Create your views here.
class GetDanhSachLopHoc(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        token = request.auth
        MaGiangVien = token.user.MaGiangVien
        if MaGiangVien is None:
            return Response({'message': 'Please provide a valid MaGiangVien!'}, status=400)

        # Get list of classes
        classes = Classroom.objects.filter(MaGiangVien=MaGiangVien)
        responses = []
        for c in classes:
            responses.append({
                'MaLopHoc': c.MaLopHoc,
                'TenLopHoc': c.TenLopHoc,
                'TenPhongHoc': c.TenPhongHoc,
                'MaMonHoc': c.MaMonHoc.MaMonHoc,
                'TenMonHoc': c.MaMonHoc.TenMonHoc,
                'NamHoc': c.NamHoc,
                'HocKy': c.HocKy,
                'SoTinChi': c.MaMonHoc.SoTinChi,
            })
        
        # Convert responses to JSON string
        response_data = json.dumps({'classes': responses}, ensure_ascii=False)

        return Response(response_data, status=200)

class AddLopHoc(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        token = request.auth
        user = token.user
        MaGiangVien = user.MaGiangVien
        
        if MaGiangVien is None:
            return Response({'error': 'MaGiangVien is None'}, status=400)
        
        data = request.data
        TenLopHoc = data.get('TenLopHoc')
        TenPhongHoc = data.get('TenPhongHoc')
        MaMonHoc = data.get('MaMonHoc')
        NamHoc = data.get('NamHoc')
        HocKy = data.get('HocKy')
        
        if None in [TenLopHoc, TenPhongHoc, MaMonHoc, NamHoc, HocKy]:
            return Response({'error': 'One or more fields are None'}, status=400)
        
        if Subject.objects.filter(MaMonHoc=MaMonHoc).exists() == False:
            return Response({'message': 'Subject does not exist'}, status=400)
        
        if Classroom.objects.filter(TenLopHoc=TenLopHoc, TenPhongHoc=TenPhongHoc, MaMonHoc=MaMonHoc, NamHoc=NamHoc, HocKy=HocKy).exists():
            return Response({'message': 'Class already exists'}, status=400)
        
        try:
            subject_instance = Subject.objects.get(MaMonHoc=MaMonHoc)
            teacher_instance = Teacher.objects.get(MaGiangVien=MaGiangVien)
            new_class = Classroom(MaGiangVien=teacher_instance, TenLopHoc=TenLopHoc, TenPhongHoc=TenPhongHoc, MaMonHoc=subject_instance, NamHoc=NamHoc, HocKy=HocKy)
            new_class.save()
        except Exception as e:
            return Response({'error': f'Error creating class: {str(e)}'}, status=500)
        
        return Response({'message': 'Class added successfully'}, status=200)