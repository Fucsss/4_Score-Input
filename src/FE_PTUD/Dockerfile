# Sử dụng hình ảnh Node.js chính thức từ Docker Hub
FROM node:14

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép các file yêu cầu vào thư mục làm việc
COPY . /app/

# Cài đặt các gói npm từ package.json
RUN npm install

# Build ứng dụng
RUN npm run build

# Sử dụng một server đơn giản để phục vụ ứng dụng tĩnh
RUN npm install -g serve
CMD ["serve", "-s", "build"]
