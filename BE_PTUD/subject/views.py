from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Subject
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
import json

# Create your views here.
class GetDanhSachMonHoc(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request):
        subjects = Subject.objects.all()
        response = []
        for subject in subjects:
            subject = {
                'MaMonHoc': subject.MaMonHoc,
                'TenMonHoc': subject.TenMonHoc,
                'SoTinChi': subject.SoTinChi
            }
            response.append(subject)
        # Convert responses to JSON string
        response_data = json.dumps({'classes': response}, ensure_ascii=False)

        return Response({'subjects': response_data}, status=200)
    
class AddMonHoc(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        MaMonHoc = data.get('MaMonHoc')
        TenMonHoc = data.get('TenMonHoc')
        SoTinChi = data.get('SoTinChi')

        # Check if any field is None
        if None in [MaMonHoc, TenMonHoc, SoTinChi]:
            return Response({'error': 'One or more fields are None'}, status=400)

        # Check if MaMonHoc already exists
        if Subject.objects.filter(MaMonHoc=MaMonHoc).exists():
            return Response({'error': 'MaMonHoc already exists'}, status=400)

        # Create new Subject
        Subject.objects.create(MaMonHoc=MaMonHoc, TenMonHoc=TenMonHoc, SoTinChi=SoTinChi)
        return Response({'message': 'Add subject successful'}, status=200)