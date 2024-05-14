## 2. PHÂN TÍCH

### 2.1 Giới thiệu

#### 2.1.1. Mục đích

Mục đích của đề tài này nhằm mô tả một cách đầy đủ và toàn diện các yêu cầu, của ứng dụng: các yêu cầu chức năng, yêu cầu phi chức năng, các ràng buộc về mặt thiết kế...

#### 2.1.2 Phạm vi

Đặc điểm của ứng dụng:
- Ứng dụng nhập điểm dành cho giảng viên có các đặc điểm chính sau:
    + Giao diện thân thiện và dễ sử dụng: Thiết kế trực quan giúp giảng viên dễ dàng nhập điểm và quản lý thông tin sinh viên.
    + Bảo mật cao: Đảm bảo rằng thông tin sinh viên và điểm số được bảo vệ an toàn.
    + Chức năng phân tích và báo cáo: Cung cấp các báo cáo và thống kê về kết quả học tập của sinh viên.

Phạm vi, đối tượng phục vụ của ứng dụng:
- Phạm vi: Ứng dụng được sử dụng trong các trường đại học, cao đẳng và các cơ sở giáo dục có nhu cầu quản lý và nhập điểm.
- Đối tượng phục vụ: Giảng viên là đối tượng chính của ứng dụng này.

Nhóm các hệ thống con:
Ứng dụng có thể bao gồm các hệ thống con sau:
- Hệ thống quản lý người dùng: Quản lý tài khoản và quyền truy cập của giảng viên
- Hệ thống nhập điểm: Cho phép giảng viên nhập, chỉnh sửa, xóa và cập nhật điểm số của sinh viên.
- Hệ thống báo cáo và thống kê: Cung cấp các báo cáo về kết quả học tập, biểu đồ và các số liệu thống kê.
- Hệ thống đồng bộ hóa: Kết nối và đồng bộ dữ liệu với các hệ thống quản lý giáo dục khác.

Đối tượng của tài liệu:
Tài liệu này hướng tới các đối tượng sau:
- Nhóm quản lý và phát triển ứng dụng: Để hiểu rõ yêu cầu và mục tiêu của ứng dụng, cũng như các chức năng cần thiết.
- Giảng viên: họ biết được các tính năng và lợi ích của ứng dụng khi triển khai.

### 2.2 Phân tích yêu cầu

#### 2.2.1 Đặc tả Actors

- Actor 1: Giảng viên
Mô tả: Giảng viên là người trực tiếp sử dụng ứng dụng để nhập điểm, theo dõi và quản lý tất cả các kết quả học tập của sinh viên.

- Actor 2: Sinh viên
Mô tả: Sinh viên có thể sử dụng ứng dụng để theo dõi điểm số và các thông tin liên quan đến kết quả học tập của mình.

#### 2.2.2 Đặc tả Use-cases

- Danh sách các use-cases:
    - UC01: Đăng nhập (Mô tả: Giảng viên nhập tên đăng nhập và mật khẩu để truy cập vào hệ thống)
    - UC02: Thống kê (Mô tả: Giảng có thể xem và tạo các báo cáo thống kê về điểm số của sinh viên)
    - UC03: Nhập điểm (Mô tả: Giảng viên nhập điểm cho các sinh viên theo từng môn học)
    - UC04: Chỉnh sửa điểm (Mô tả: Giảng viên có thể cập nhật lại điểm số của sinh viên nếu như nhập sai hay có sự thay đổi gì đó ở điểm số hiện tại của sinh viên) 
    - UC05: Xóa sinh viên (Mô tả: Giảng viên có thể xóa sinh viên ra khỏi lớp học nếu như vi phạm quá số lần quy định của trường,...)
    - UC06: Cập nhật sinh viên (Mô tả: Giảng viên có thể cập nhật lại thông tin sinh viên khi nhập sai hay nhập thiếu số liệu)
    - UC07: Xem điểm (Mô tả: Sinh viên có thể xem điểm số của mình sau khi giảng viên đã nhập)

- Liệt kê các use-cases theo actor: (LƯU Ý: nếu phần này các chức năng thực hiện khác nhau ở mỗi actor thì ghi rõ các khác nhau đó)
    - Actor 1: Giảng viên
        - UC01: Đăng nhập
        - UC02: Thống kê
        - UC03: Nhập điểm
        - UC04: Chỉnh sửa điểm
        - UC05: Xóa sinh viên
        - UC06: Cập nhật sinh viên
    - Actor 2: Sinh Viên
        - UC01: Đăng nhập
        - UC07: Xem điểm
