from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Class_Student
import json

# Create your views here.
class GetDanhSachSinhVien(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        MaGiangVien = request.data.get('MaGiangVien')
        if MaGiangVien is None:
            return Response({'message': 'Please provide a valid MaGiangVien!'}, status=400)

        # Get list of classes
        class_students = Class_Student.objects.filter(MaGiangVien=MaGiangVien)
        responses = []
        for c in class_students:
            responses.append({
                'MaSinhVien': c.MaSinhVien.MaSinhVien,
                'HoVaTen': c.MaSinhVien.HoVaTen,
                'TenKhoa': c.MaSinhVien.TenKhoa,
                'Email': c.MaSinhVien.Email,
                'SDT': c.MaSinhVien.SDT
            })
        
        # Convert responses to JSON string
        response_data = json.dumps({'class_students': responses}, ensure_ascii=False)

        return Response(response_data, status=200)

class AddLopHoc(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(request):
        return Response({'message': 'Please use POST method to add a new class students!'}, status=400)