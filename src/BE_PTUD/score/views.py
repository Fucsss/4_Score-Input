from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Score
from student.models import Class_Student
from classroom.models import Classroom
from student.models import Student
import pandas as pd
import io
from sympy import sympify
from django.db.models import Avg, Max, Min, Count, Q

# Create your views here.
class GetDanhSachDiem(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        token = request.auth
        MaGiangVien = token.user.MaGiangVien
        MaLopHoc = request.query_params.get('MaLopHoc')
        classes = Class_Student.objects.filter(MaLopHoc=MaLopHoc)
        classroom = Classroom.objects.get(MaLopHoc=MaLopHoc)
        if classroom.MaGiangVien.MaGiangVien != MaGiangVien:
            return Response({'message': 'You do not have permission to view this class!'}, status=403)
        result = []
        score_columns = set()  # Set to store unique score column names
        for class_student in classes:
            MaSinhVien = class_student.MaSinhVien.MaSinhVien
            scores = Score.objects.filter(MaSinhVien=MaSinhVien, MaLopHoc=MaLopHoc)
            score_dict = {}
            for score in scores:
                score_columns.add(score.TenThanhPhanDiem)  # Add score column name to the set
                if score.Diem is not None:  # Kiểm tra nếu score.Diem không rỗng
                    score_dict[score.TenThanhPhanDiem] = score.Diem
                else:  # Nếu score.Diem rỗng, đặt một giá trị mặc định
                    score_dict[score.TenThanhPhanDiem] = None
            result.append({
                'MaSinhVien': MaSinhVien,
                'Scores': score_dict if score_dict else None
            })
        return Response({
            'score_columns': list(score_columns),  # Convert set to list
            'student_scores': result
        })
    
class AddDiem(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        token = request.auth
        MaGiangVien = token.user.MaGiangVien
        MaLopHoc = request.data.get('MaLopHoc')
        if Classroom.objects.get(MaLopHoc=MaLopHoc).MaGiangVien.MaGiangVien != MaGiangVien:
            return Response({'message': 'You do not have permission to add score for this class!'}, status=403)
        
        scores = request.data.get('scores')  # Get list of scores from request data
        students = Class_Student.objects.filter(MaLopHoc=MaLopHoc)  # Find students by MaLopHoc
        classroom = Classroom.objects.get(MaLopHoc=MaLopHoc)
        existing_scores_students = []  # List to store students who already have scores
        for score in scores:
            MaSinhVien = score.get('MaSinhVien')
            TenThanhPhanDiem = score.get('TenThanhPhanDiem')
            Diem = score.get('Diem')
            student = students.get(MaSinhVien=MaSinhVien).MaSinhVien  # Access the Student from the Class_Student
            if Score.objects.filter(MaSinhVien=student, MaLopHoc=classroom, TenThanhPhanDiem=TenThanhPhanDiem).exists():
                existing_scores_students.append(MaSinhVien)  # Add student to the list
                continue  # Skip to the next score
            Score.objects.create(MaSinhVien=student, MaLopHoc=classroom, TenThanhPhanDiem=TenThanhPhanDiem, Diem=Diem)  # Use the Student instance
        
        if existing_scores_students:
            return Response({'message': f'The scores for students {existing_scores_students} already exist!'}, status=400)
        return Response({'message': 'Add scores successfully!'}, status=200)

class UpdateDiem(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        token = request.auth
        MaGiangVien = token.user.MaGiangVien
        MaLopHoc = request.data.get('MaLopHoc')
        if Classroom.objects.get(MaLopHoc=MaLopHoc).MaGiangVien.MaGiangVien != MaGiangVien:
            return Response({'message': 'You do not have permission to update score for this class!'}, status=403)
        
        scores = request.data.get('scores')  # Get list of scores from request data

        for score in scores:
            MaSinhVien = score.get('MaSinhVien') 
            TenThanhPhanDiem = score.get('TenThanhPhanDiem')
            Diem = score.get('Diem')

            if not Score.objects.filter(MaSinhVien=MaSinhVien, MaLopHoc=MaLopHoc, TenThanhPhanDiem=TenThanhPhanDiem).exists():
                return Response({'message': f'The score for student {MaSinhVien} does not exist!'}, status=400)
            
            Score.objects.filter(MaSinhVien=MaSinhVien, MaLopHoc=MaLopHoc, TenThanhPhanDiem=TenThanhPhanDiem).update(Diem=Diem)
        
        return Response({'message': 'Update scores successfully!'}, status=200)

class AddDiemByFile(APIView):
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
                return Response({'message': 'You do not have permission to add score for this class!'}, status=403)
        except Classroom.DoesNotExist:
            return Response({'message': 'MaLopHoc is not exist!'}, status=400)

        file = request.FILES['file']
        file_content = file.read().decode('utf-8')
        csv_file = io.StringIO(file_content)

        try:
            df = pd.read_csv(csv_file)
        except pd.errors.ParserError:
            return Response({'message': 'Invalid CSV file!'}, status=400)

        if 'MaSinhVien' not in df.columns:
            return Response({'message': 'Invalid CSV file, missing MaSinhVien column'}, status=400)

        students = Class_Student.objects.filter(MaLopHoc=MaLopHoc) #Find students by MaLopHoc
        for row in df.to_dict("records"):
            MaSinhVien = row.get('MaSinhVien')
            if MaSinhVien is None:
                continue

            try: 
                class_student = students.get(MaSinhVien=MaSinhVien)
            except Class_Student.DoesNotExist:
                return Response({'message': f'Student with ID {MaSinhVien} does not exist in this class!'}, status=400)

            student = class_student.MaSinhVien  # Access the Student from the Class_Student

            for TenThanhPhanDiem, Diem in row.items():
                if TenThanhPhanDiem == 'MaSinhVien':
                    continue

                try:
                    score = Score.objects.get(MaSinhVien=student, 
                                            MaLopHoc=classroom, 
                                            TenThanhPhanDiem=TenThanhPhanDiem)
                except Score.DoesNotExist:
                    score = Score.objects.create(MaSinhVien=student, MaLopHoc=classroom, TenThanhPhanDiem=TenThanhPhanDiem, Diem=Diem)
                except Exception as e:
                    return Response({'message': f'Error: {e}'}, status=400)
            
        return Response({'message': 'Add scores successfully!'}, status=200)
    
class CreateNewColumnByFormula(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        token = request.auth
        MaGiangVien = token.user.MaGiangVien
        MaLopHoc = request.data.get('MaLopHoc')
        try:
            classroom = Classroom.objects.get(MaLopHoc=MaLopHoc)
            if classroom.MaGiangVien.MaGiangVien != MaGiangVien:
                return Response({'message': 'You do not have permission to create new column for this class!'}, status=403)
        except Classroom.DoesNotExist:
            return Response({'message': 'MaLopHoc is not exist!'}, status=400)
        NewColumnName = request.data.get('NewColumnName')
        formula = request.data.get('formula')
        expr = sympify(formula)
        variables = expr.free_symbols
        #Extract all student score by MaLopHoc
        students = Score.objects.filter(MaLopHoc=MaLopHoc)
        df = pd.DataFrame.from_records(students.values())
        for MaSinhVien in df['MaSinhVien_id'].unique():
            # print(MaSinhVien)
            FindSCoresByMaSinhVien = df[df['MaSinhVien_id'] == MaSinhVien]
            scores = {'MaSinhVien': MaSinhVien}
            # Find all column need to calculate
            for var in variables:
                if str(var) not in FindSCoresByMaSinhVien["TenThanhPhanDiem"].values:
                    scores[var] = None
                    # return Response({'message': f'{MaSinhVien} Column {str(var)} not exist!'}, status=400)
                scores[var] = FindSCoresByMaSinhVien[FindSCoresByMaSinhVien["TenThanhPhanDiem"] == str(var)]["Diem"].values[0]
            scores[NewColumnName] = expr.subs(scores)
            Score.objects.create(MaSinhVien=Student.objects.get(MaSinhVien=MaSinhVien), MaLopHoc=classroom, TenThanhPhanDiem=NewColumnName, Diem=scores[NewColumnName])

        return Response({'message': 'Create new column by formula successfully!'}, status=200)

class GetStatistic(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(seft, request):
        token = request.auth
        MaGiangVien = token.user.MaGiangVien
        MaLopHoc = request.query_params.get('MaLopHoc')
        TenThanhPhanDiem = request.query_params.get('TenThanhPhanDiem')
        try:
            classroom = Classroom.objects.get(MaLopHoc=MaLopHoc)
            if classroom.MaGiangVien.MaGiangVien != MaGiangVien:
                return Response({'message': 'You do not have permission to create new column for this class!'}, status=403)
        except Classroom.DoesNotExist:
            return Response({'message': 'MaLopHoc is not exist!'}, status=400)
        
        scores = Score.objects.filter(MaLopHoc = MaLopHoc, TenThanhPhanDiem = TenThanhPhanDiem)
        pass_scores = scores.filter(Diem__gte=5.0)
        
        aggregates = scores.aggregate(
            Avg('Diem'),
            Max('Diem'),
            Min('Diem'),
            total=Count('Diem'),
            pass_total=Count('Diem', filter=Q(Diem__gte=5.0))
        )
        
        average_score = aggregates['Diem__avg']
        max_score = aggregates['Diem__max']
        min_score = aggregates['Diem__min']
        total_scores = aggregates['total']
        total_pass_scores = aggregates['pass_total']

        pass_rate = total_pass_scores / total_scores if total_scores else 0
        
        return Response({
            'average_score': average_score,
            'max_score': max_score,
            'min_score': min_score,
            'pass_rate': pass_rate,
            'fail_rate': 1 - pass_rate,
        })
        