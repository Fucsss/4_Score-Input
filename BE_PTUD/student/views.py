from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Class_Student, Student
from teacher.models import Teacher
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

class AddSinhVien(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.auth
        user = token.user
        MaGiangVien = user.MaGiangVien
        
        if MaGiangVien is None:
            return Response({'error': 'MaGiangVien is None'}, status=400)
        
        data = request.data
        MaSinhVien = data.get('MaSinhVien')
        HoVaTen = data.get('HoVaTen')
        Email = data.get('Email')
        SDT = data.get('SDT')
        TenKhoa = data.get('TenKhoa')
        
        if MaSinhVien is None:
            return Response({'error': 'MaSinhVien is required'}, status=400)
        
        # Check if the specified student exists or create a new one
        student_instance, created = Student.objects.get_or_create(
            MaSinhVien=MaSinhVien,
            defaults={'HoVaTen': HoVaTen, 'Email': Email, 'SDT': SDT, 'TenKhoa': TenKhoa}
        )
        
        # Get the teacher instance using MaGiangVien
        try:
            teacher_instance = Teacher.objects.get(MaGiangVien=MaGiangVien)
        except Teacher.DoesNotExist:
            return Response({'message': 'Teacher does not exist'}, status=400)
        
        # Check if the student is already associated with this teacher
        if Class_Student.objects.filter(MaSinhVien=student_instance, MaGiangVien=teacher_instance).exists():
            return Response({'message': 'Student already associated with this teacher'}, status=400)
        
        try:
            # Create a new Class_Student instance to associate the student with the teacher
            new_class_student = Class_Student(MaSinhVien=student_instance, MaGiangVien=teacher_instance)
            new_class_student.save()
            
            return Response({'message': 'Student added successfully'}, status=200)
        
        except Exception as e:
            return Response({'error': str(e)}, status=500)

# class EditSinhVien(APIView):

# class RemoveSinhVien(APIView):