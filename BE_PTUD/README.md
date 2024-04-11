# Backend PTUD
- Các thư viện cần có để chạy:
- pip install Django
- pip install djangorestframework

*Các Api tương  ứng*
- login: http://127.0.0.1:8000/teacher/login/
- Signup: http://127.0.0.1:8000/teacher/signup/
- logout: http://127.0.0.1:8000/teacher/logout/

*Lưu ý*
- khi signup hoặc login thành công server sẽ gửi về Token. Hãy sử dụng token này để xác thực trong API gửi về backend thông qua head với key Authorization (VD :'Authorization': 'Token 123')

