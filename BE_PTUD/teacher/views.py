from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Teacher 
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
# Create your views here.
class loginAPIView(APIView):
    def post(self, request):
        MaGiangVien = request.data.get('MaGiangVien')
        password = request.data.get('password')
        try:
            user = Teacher.objects.get(MaGiangVien=MaGiangVien)
        except Teacher.DoesNotExist:
            return Response({'message': 'MaGiangVien not found'}, status=400)
        
        if user.check_password(password):
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'message': 'Login successful'}, status=200)
        else:
            return Response({'message': 'Password incorrect'}, status=400)

class signupAPIView(APIView):
    def post(self, request):
        MaGiangVien = request.data['MaGiangVien']
        password = request.data['password']
        HoVaTen = request.data['HoVaTen']
        TenKhoa = request.data['TenKhoa']
        Email = request.data['Email']
        SDT = request.data['SDT']
        try:
            Teacher.objects.get(MaGiangVien = MaGiangVien)
            return Response({'message': 'MaGiangVien already exists'}, status=400)
        except Teacher.DoesNotExist:
            user = Teacher.objects.create_user(MaGiangVien=MaGiangVien, password=password, HoVaTen=HoVaTen, TenKhoa=TenKhoa, Email=Email, SDT=SDT)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'message': 'Signup successful'}, status=200)

class logoutAPIView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        tokens = request.user.auth_token.all() 
        for token in tokens: #Xoá hết token của các phiên đăng nhập
            token.delete()
        return Response({'message': 'Logout successful'}, status=200)