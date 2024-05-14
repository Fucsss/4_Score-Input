# Backend PTUD
- Các thư viện cần có để chạy, để cài đặt các thư viện này ta dùng các lệnh sau:
    + pip install Django
    + pip install djangorestframework

*Các Api tương  ứng*
- Login: http://127.0.0.1:8000/teacher/login/ 
- Signup: http://127.0.0.1:8000/teacher/signup/
- logout: http://127.0.0.1:8000/teacher/logout/

*Lưu ý*
- Khi đăng ký hoặc đăng nhập thành công, server sẽ gửi về một token. Token này cần được sử dụng để xác thực cho các yêu cầu API tiếp theo. Để xác thực bằng token, gửi token này trong header của yêu cầu với key 'Authorization'.
(VD :'Authorization': 'Token 123')
