## 2. PHÂN TÍCH

### 2.1 Giới thiệu

#### 2.1.1. Mục đích

Mục đích của tài liệu này nhằm mô tả một cách đầy đủ và toàn diện yêu cầu của ứng dụng: các yêu cầu chức năng, yêu cầu phi chức năng, các ràng buộc về mặt thiết kế.

#### 2.1.2 Phạm vi

Mô tả ngắn gọn đặc điểm của ứng dụng; phạm vi, đối tượng phục vụ của ứng dụng; nhóm các hệ thống con
Chỉ ra được tài liệu này dùng cho đối tượng nào?


### 2.2 Phân tích yêu cầu

#### 2.2.1 Đặc tả Actors

- Giảng viên: Người sẽ thêm, sửa, xoá, cập nhật điểm cho sinh viên. Bên cạnh đó họ có thể tạo mới, các lớp học.

#### 2.2.2 Đặc tả Use-cases

- Danh sách các use-cases:
    - UC01: đăng nhập (Mô tả: Người dùng nhập thông tin đăng nhập để truy cập hệ thống)
    - UC02: đăng kí (Mô tả: Người dùng nhập thông tin cần thiết để truy cập vào hệ thống)
    - UC03: đăng xuất: (Mô tả: Người dùng đăng xuất tài khoảng ra khỏi phiên sử dụng hiện tại). Điều kiện đã đăng nhập.
    - UC04: tạo mới lớp học (Mô tả: Giảng viên có thể tạo mới lớp học trong hệ thống). Điều kiện đã đăng nhập
    - UC06: thêm Sinh Viên (Mô tả: Người dùng thêm, sửa, xoá sinh viên của 1 lớp) Điều kiện cần phải đăng nhập, tạo lớp trước.
    - UC07: sửa, xoá Sinh Viên (Mô tả: Người dùng xoá, sửa sinh viên của 1 lớp). Điều kiện cần phải đăng nhập, Sinh viên đó phải được tạo trước.

- Liệt kê các use-cases theo actor: (LƯU Ý: nếu phần này các chức năng thực hiện khác nhau ở mỗi actor thì ghi rõ các khác nhau đó)
    - Actor 1:
        - UC01: đăng nhập
        - UC03: đăng bài viết
    - Actor 2:
        - UC01: đăng nhập
        - UC02: thống kê
    - Actor 3:
        - ...
    - ...
