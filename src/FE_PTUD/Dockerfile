# Sử dụng image node:alpine như một base image
FROM node:alpine AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt dependencies
RUN npm install

# Copy tất cả các file trong thư mục src vào thư mục làm việc
COPY . .

# Build ứng dụng
RUN npm run build

# Sử dụng nginx để serve ứng dụng build
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
