from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Classroom
import json

# Create your views here.
class GetDanhSachLopHoc(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        MaGiangVien = request.data.get('MaGiangVien')
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
                'HocKy': c.HocKy
            })
        
        # Convert responses to JSON string
        response_data = json.dumps({'classes': responses}, ensure_ascii=False)

        return Response(response_data, status=200)

class AddLopHoc(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(request):
        return Response({'message': 'Please use POST method to add a new class!'}, status=400)