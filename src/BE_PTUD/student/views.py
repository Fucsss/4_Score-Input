from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Class_Student, Student
from classroom.models import Classroom
import json
from django.db import transaction
import pandas as pd 
import io

# Create your views here.
class GetDanhSachSinhVien(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        MaLopHoc = request.data.get('MaLopHoc')
        
        if MaLopHoc is None:
            return Response({'message': 'Please provide a valid MaLopHoc!'}, status=400)

        # Get list of students associated with the specified classroom
        class_students = Class_Student.objects.filter(MaLopHoc=MaLopHoc)
        responses = []
        for c in class_students:
            responses.append({
                'MaSinhVien': c.MaSinhVien.MaSinhVien,
                'HoVaTen': c.MaSinhVien.HoVaTen,
                'TenKhoa': c.MaSinhVien.TenKhoa,
                'Email': c.MaSinhVien.Email,
                'SDT': c.MaSinhVien.SDT
            })
        
        # Return response data as JSON
        return Response({'class_students': responses}, status=200)

class AddSinhVien(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        MaLopHoc = request.data.get('MaLopHoc')
        MaSinhVien = request.data.get('MaSinhVien')
        HoVaTen = request.data.get('HoVaTen')
        Email = request.data.get('Email')
        SDT = request.data.get('SDT')
        TenKhoa = request.data.get('TenKhoa')
        
        if not MaLopHoc:
            return Response({'error': 'MaLopHoc is required'}, status=400)
        
        if not MaSinhVien:
            return Response({'error': 'MaSinhVien is required'}, status=400)
        
        try:
            # Lấy thông tin sinh viên từ database hoặc tạo mới nếu chưa tồn tại
            student_instance, created = Student.objects.get_or_create(MaSinhVien=MaSinhVien, defaults={
                'HoVaTen': HoVaTen,
                'Email': Email,
                'SDT': SDT,
                'TenKhoa': TenKhoa
            })
            
            # Lấy instance của lớp học
            class_instance = Classroom.objects.get(MaLopHoc=MaLopHoc)
            
            # Kiểm tra nếu sinh viên đã tồn tại trong lớp học
            if Class_Student.objects.filter(MaSinhVien=student_instance, MaLopHoc=class_instance).exists():
                return Response({'message': 'Student already associated with this class'}, status=400)
            
            # Tạo một bản ghi Class_Student mới để liên kết sinh viên với lớp học
            with transaction.atomic():
                new_class_student = Class_Student.objects.create(MaSinhVien=student_instance, MaLopHoc=class_instance)
            
            return Response({'message': 'Student added successfully'}, status=200)
        
        except Student.DoesNotExist:
            return Response({'error': 'Student does not exist'}, status=404)
        
        except Classroom.DoesNotExist:
            return Response({'error': 'Classroom does not exist'}, status=404)
        
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class RemoveSinhVien(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        MaSinhVien = request.data.get('MaSinhVien')
        
        if not MaSinhVien:
            return Response({'error': 'MaSinhVien is required'}, status=400)
        
        try:
            # Lấy thông tin sinh viên từ database
            student_instance = Student.objects.get(MaSinhVien=MaSinhVien)
            
            # Xóa sinh viên khỏi tất cả các lớp học
            with transaction.atomic():
                Class_Student.objects.filter(MaSinhVien=student_instance).delete()
                student_instance.delete()
            
            return Response({'message': 'Student removed from all classes and deleted successfully'}, status=200)
        
        except Student.DoesNotExist:
            return Response({'error': 'Student does not exist'}, status=404)
        
        except Exception as e:
            return Response({'error': str(e)}, status=500)
        
class UpdateSinhVien(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        
        # Lấy thông tin cần chỉnh sửa từ dữ liệu yêu cầu
        MaSinhVien = data.get('MaSinhVien')
        HoVaTen = data.get('HoVaTen')
        Email = data.get('Email')
        SDT = data.get('SDT')
        TenKhoa = data.get('TenKhoa')
        
        if not MaSinhVien:
            return Response({'error': 'MaSinhVien is required'}, status=400)
        
        try:
            # Lấy instance của sinh viên từ database
            student_instance = Student.objects.get(MaSinhVien=MaSinhVien)
            
            # Bắt đầu một giao dịch để đảm bảo tính toàn vẹn dữ liệu
            with transaction.atomic():
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
            return Response({'error': 'Student does not exist'}, status=404)
        
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class AddSinhVienByFile(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.auth
        MaGiangVien = token.user.MaGiangVien
        MaLopHoc = request.data.get('MaLopHoc')

        if MaLopHoc is None:
            return Response({'message': 'MaLopHoc is required!'}, status=400)

        try:
            classroom = Classroom.objects.get(MaLopHoc=MaLopHoc)
            if classroom.MaGiangVien.MaGiangVien != MaGiangVien:
                return Response({'message': 'You do not have permission to add students to this class!'}, status=403)
        except Classroom.DoesNotExist:
            return Response({'message': 'MaLopHoc does not exist!'}, status=400)

        file = request.FILES['file']

        if not file.name.endswith('.csv'):
            return Response({'message': 'Invalid file format! Only CSV files are supported.'}, status=400)

        try:
            df = pd.read_csv(file)

            # Iterate over each row in the CSV file
            for index, row in df.iterrows():
                MaSinhVien = row.get('MaSinhVien')
                HoVaTen = row.get('HoVaTen')
                Email = row.get('Email')
                SDT = row.get('SDT')
                TenKhoa = row.get('TenKhoa')

                if MaSinhVien is None or HoVaTen is None:
                    return Response({'message': 'MaSinhVien and HoVaTen are required fields.'}, status=400)

                # Create or update the Student object
                student_instance, created = Student.objects.update_or_create(
                    MaSinhVien=MaSinhVien,
                    defaults={'HoVaTen': HoVaTen, 'Email': Email, 'SDT': SDT, 'TenKhoa': TenKhoa}
                )

                # Check if the student is already associated with the classroom
                if not Class_Student.objects.filter(MaSinhVien=student_instance, MaLopHoc=classroom).exists():
                    Class_Student.objects.create(MaSinhVien=student_instance, MaLopHoc=classroom)

            return Response({'message': 'Students added successfully!'}, status=200)

        except pd.errors.ParserError:
            return Response({'message': 'Invalid CSV file format!'}, status=400)
        except Exception as e:
            return Response({'message': str(e)}, status=500)