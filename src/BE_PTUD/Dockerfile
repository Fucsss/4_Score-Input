# Sử dụng hình ảnh Python chính thức từ Docker Hub
FROM python:3.9-alpine

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Cài đặt SQLite3 sử dụng apk
RUN apk update && \
    apk add --no-cache sqlite

# Sao chép các file cần thiết vào thư mục làm việc
COPY . /app/

# Tạo và kích hoạt một môi trường ảo Python
RUN python -m venv /venv

# Cài đặt các phụ thuộc của Python
RUN /venv/bin/pip install --no-cache-dir -r requirements.txt

# Chạy các migration để cập nhật cơ sở dữ liệu
RUN /venv/bin/python manage.py migrate

# Lệnh để chạy ứng dụng
CMD ["/venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
