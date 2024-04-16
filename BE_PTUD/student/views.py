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
        token = request.auth
        user = token.user
        MaGiangVien = user.MaGiangVien
        
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

class RemoveSinhVien(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Lấy user từ token xác thực
        user = request.user
        MaGiangVien = user.MaGiangVien
        
        if not MaGiangVien:
            return Response({'error': 'MaGiangVien is None'}, status=400)
        
        data = request.data
        MaSinhVien = data.get('MaSinhVien')
        
        if not MaSinhVien:
            return Response({'error': 'MaSinhVien is required'}, status=400)
        
        try:
            # Lấy instance của sinh viên
            student_instance = Student.objects.get(MaSinhVien=MaSinhVien)
        except Student.DoesNotExist:
            return Response({'message': 'Student does not exist'}, status=400)
        
        try:
            # Lấy instance của giảng viên
            teacher_instance = Teacher.objects.get(MaGiangVien=MaGiangVien)
        except Teacher.DoesNotExist:
            return Response({'message': 'Teacher does not exist'}, status=400)
        
        try:
            # Kiểm tra xem sinh viên có trong lớp học của giảng viên không
            class_student_instance = Class_Student.objects.get(MaSinhVien=student_instance, MaGiangVien=teacher_instance)
        except Class_Student.DoesNotExist:
            return Response({'message': 'Student is not associated with this teacher'}, status=400)
        
        try:
            # Xóa sinh viên khỏi lớp học của giảng viên
            class_student_instance.delete()
            
            return Response({'message': 'Student removed from class successfully'}, status=200)
        
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
class EditSinhVien(APIView):
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
        
        try:
            # Lấy thông tin sinh viên từ database
            student_instance = Student.objects.get(MaSinhVien=MaSinhVien)
            
            # Cập nhật thông tin nếu được cung cấp
            if HoVaTen:
                student_instance.HoVaTen = HoVaTen
            if Email:
                student_instance.Email = Email
            if SDT:
                student_instance.SDT = SDT
            if TenKhoa:
                student_instance.TenKhoa = TenKhoa
            
            # Lưu lại thông tin sinh viên sau khi chỉnh sửa
            student_instance.save()
            
            return Response({'message': 'Student information updated successfully'}, status=200)
        
        except Student.DoesNotExist:
            return Response({'error': 'Student does not exist'}, status=400)
        
        except Exception as e:
            return Response({'error': str(e)}, status=500)
