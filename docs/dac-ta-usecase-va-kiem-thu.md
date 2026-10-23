# Đặc tả use case và điều kiện kiểm thử

> Bản rà soát UC001–UC009. Các quy tắc dưới đây là đặc tả yêu cầu để xây dựng kiểm thử; cần đối chiếu với phạm vi chức năng được triển khai trước khi nghiệm thu.

## Quy ước kiểm tra dữ liệu

- Chuỗi được trim khoảng trắng đầu/cuối trước khi kiểm tra. Trường chỉ có khoảng trắng được xem là rỗng.
- Các giới hạn độ dài tính theo ký tự sau khi trim; giá trị tại đúng giới hạn là hợp lệ, thấp hơn/cao hơn giới hạn một đơn vị là không hợp lệ.
- Mã username, mã môn, mã lớp và email được so sánh không phân biệt hoa/thường. Không được tạo hai bản ghi có cùng giá trị chuẩn hóa.
- Trả lỗi validation dạng `400`, lỗi chưa đăng nhập `401`, không đủ quyền `403`, không tìm thấy tài nguyên `404`, xung đột dữ liệu `409`. API không trả mật khẩu, hash mật khẩu, JWT secret hoặc thông tin xác thực trong nội dung lỗi.
- API có quyền theo vai trò phải kiểm tra quyền ở backend trên từng yêu cầu; ẩn nút ở giao diện không thay thế kiểm soát quyền.

## UC001 – Đăng nhập

**Tác nhân:** Sinh viên, giảng viên, quản trị viên. **Tiền điều kiện:** Không.

| Trường | Bắt buộc | Quy tắc hợp lệ |
|---|---:|---|
| Username | Có | 12–50 ký tự; chữ, số, `_`, `-` |
| Mật khẩu | Có | 6–30 ký tự |

**Luồng chính:** người dùng mở website → hệ thống hiển thị form → người dùng nhập thông tin → hệ thống kiểm tra rỗng/định dạng → xác thực tài khoản và mật khẩu → chuyển tới trang theo vai trò.

**Luồng lỗi:**

- Bỏ trống một hoặc cả hai trường: `400`, báo trường cần nhập.
- Username 11/51 ký tự hoặc có ký tự ngoài chữ, số, `_`, `-`: `400`.
- Mật khẩu 5/31 ký tự: `400`.
- Username đúng định dạng nhưng không tồn tại, hoặc mật khẩu sai: cùng thông báo chung “Tên đăng nhập hoặc mật khẩu không đúng” để không tiết lộ tài khoản nào tồn tại.
- Tài khoản bị vô hiệu hóa (nếu hệ thống có trạng thái này): từ chối đăng nhập và thông báo tài khoản không thể truy cập.

**Ca biên tiêu biểu:** username 12 và 50 ký tự hợp lệ; password 6 và 30 ký tự hợp lệ. Username 11/51 và password 5/31 không hợp lệ.

## UC002 – CRUD môn học

**Tác nhân:** Giảng viên đã đăng nhập. Giảng viên chỉ xem/sửa/xóa môn do mình tạo.

| Trường | Bắt buộc | Quy tắc hợp lệ |
|---|---:|---|
| Mã môn | Có | 2–20 ký tự; chữ in hoa, số, `-`; duy nhất không phân biệt hoa/thường |
| Tên môn | Có | 12–50 ký tự |
| Số tín chỉ | Có | Số nguyên từ 1 đến 10 |
| Giảng viên phụ trách | Tự điền | Lấy từ tài khoản đăng nhập, không nhận giá trị ghi đè từ client |

**Luồng chính:** xem danh sách môn của giảng viên, tìm theo mã/tên; tạo, sửa hoặc xóa môn sau xác nhận. Xóa môn đã được dùng để mở lớp học phần bị từ chối.

**Lỗi:** mã/tên rỗng; mã sai ký tự hoặc ngoài độ dài; tên 11/51 ký tự; tín chỉ là số thập phân, chữ, 0 hoặc 11; mã trùng (kể cả khác hoa/thường); sửa/xóa môn không thuộc người gọi; xóa môn đã có lớp. Mã trùng trả `409`; dữ liệu sai trả `400`; tài nguyên ngoài quyền trả `403` hoặc `404` theo chính sách nhất quán của hệ thống.

**Ca biên:** mã 2/20 ký tự, tên 12/50 ký tự, tín chỉ 1/10 hợp lệ; kiểm tra giá trị liền ngoài biên.

## UC003 – CRUD lớp học phần

**Tác nhân:** Giảng viên đã đăng nhập và có ít nhất một môn. Chỉ được quản lý lớp thuộc môn do mình tạo.

| Trường | Bắt buộc | Quy tắc hợp lệ |
|---|---:|---|
| Môn học | Có | Môn tồn tại và thuộc giảng viên đang đăng nhập |
| Mã lớp | Có | 2–20 ký tự; chữ in hoa, số, `-`; duy nhất không phân biệt hoa/thường |
| Tòa nhà | Có | Khu A, Khu B, A1 hoặc Khu C |
| Phòng | Có | 4–30 ký tự |
| Thứ | Có | Thứ 2–Chủ nhật |
| Giờ bắt đầu/kết thúc | Có | `HH:mm`; kết thúc phải sau bắt đầu |
| Học kỳ | Có | 6–20 ký tự |
| Ngày bắt đầu/kết thúc | Có | Ngày lịch hợp lệ `YYYY-MM-DD`; kết thúc không trước bắt đầu |
| Sĩ số tối đa | Không | Mặc định 50; số nguyên 1–120 |
| Trạng thái | Không | Mở đăng ký / Đóng đăng ký; mặc định Mở đăng ký |

**Luồng chính:** xem danh sách theo giảng viên, tìm theo mã/môn và lọc học kỳ/trạng thái; tạo/sửa lớp với kiểm tra dữ liệu và xung đột lịch; xóa sau xác nhận. Lớp đã có sinh viên đăng ký không được xóa.

**Định nghĩa xung đột:** hai buổi cùng ngày trong tuần và cùng học kỳ có khoảng thời gian giao nhau, đồng thời trùng phòng trong cùng tòa nhà hoặc trùng giảng viên. Khoảng thời gian `[bắt đầu, kết thúc)` nên được dùng để buổi kết thúc lúc 09:00 không xung đột buổi bắt đầu lúc 09:00. Khi sửa không so lớp với chính nó. Nếu lịch còn có ngày hiệu lực, chỉ coi xung đột khi khoảng ngày học giao nhau.

**Lỗi:** môn không tồn tại/không thuộc giảng viên; mã lớp sai định dạng hoặc trùng; tòa nhà ngoài danh sách; phòng 3/31 ký tự; giờ sai định dạng, kết thúc bằng/trước giờ bắt đầu; ngày không tồn tại hoặc ngày kết thúc trước ngày bắt đầu; sĩ số 0/121 hoặc không nguyên; trùng lịch phòng/giảng viên; sửa/xóa lớp ngoài quyền; xóa lớp có đăng ký. Trả `400` cho dữ liệu sai, `409` cho mã/lịch xung đột.

**Ca biên:** mã lớp 2/20, phòng 4/30, học kỳ 6/20, sĩ số 1/120 hợp lệ. Kiểm tra 0/121; giờ liền nhau không trùng và giờ giao nhau 1 phút thì trùng.

## UC004 – Đăng ký lớp học phần

**Tác nhân:** Sinh viên đã đăng nhập.

**Luồng chính:** xem lớp đang mở cùng môn, giảng viên, lịch, sĩ số hiện tại/tối đa; chọn đăng ký. Hệ thống kiểm tra quyền sinh viên, trạng thái lớp, chỗ trống, đăng ký trùng môn trong học kỳ và xung đột lịch; sau đó ghi đăng ký và cập nhật sĩ số. Hủy đăng ký chỉ khi lớp vẫn mở.

**Lỗi:** lớp không tồn tại; lớp đã đóng; sinh viên đã đăng ký chính lớp hoặc môn đó cùng học kỳ; lịch trùng (nêu mã lớp, thứ và giờ); lớp đã đủ sĩ số; hủy khi lớp đóng; đăng ký/hủy lặp lại. Với hai yêu cầu đăng ký đồng thời vào chỗ cuối, chỉ một yêu cầu thành công; yêu cầu còn lại nhận `409` và sĩ số không vượt tối đa.

**Ca biên/bảng quyết định nhỏ:**

| Lớp mở | Còn chỗ | Trùng môn/lịch | Kết quả |
|---|---|---|---|
| Có | Có | Không | Cho đăng ký |
| Không | bất kỳ | bất kỳ | Từ chối: đã đóng |
| Có | Không | bất kỳ | Từ chối: đủ sĩ số |
| Có | Có | Có | Từ chối: trùng môn/lịch |

## UC005 – Chấm điểm môn học

**Tác nhân:** Giảng viên đã đăng nhập, có sinh viên đăng ký lớp phụ trách.

| Trường | Bắt buộc | Quy tắc hợp lệ |
|---|---:|---|
| Sinh viên/môn/học kỳ | Có | Phải khớp lớp đã đăng ký do giảng viên gọi phụ trách |
| Điểm giữa kỳ/cuối kỳ | Có | Số từ 0 đến 10, cho phép số thập phân |
| Ghi chú | Không | Tối đa 500 ký tự |
| Tổng kết/điểm chữ | Tự tính | `(giữa kỳ × 0.4 + cuối kỳ × 0.6)`, làm tròn 1 số thập phân; quy đổi theo thang điểm đã nêu |

**Lỗi:** điểm âm, trên 10, không phải số hoặc thiếu; ghi chú 501 ký tự; sinh viên chưa đăng ký môn/học kỳ; lớp không thuộc giảng viên; đã có điểm môn đó trong học kỳ; sửa/xóa bản ghi điểm ngoài quyền. Từ chối dữ liệu tổng kết/điểm chữ do client gửi để tránh sửa kết quả tính toán.

**Ca biên:** điểm 0 và 10 hợp lệ; -0.01/10.01 không hợp lệ; ghi chú 500 hợp lệ, 501 không hợp lệ. Kiểm tra quy đổi đúng tại các ngưỡng 4.0, 5.0, 5.5, 6.5, 7.0, 8.0, 8.5 và ngay dưới ngưỡng.

## UC006 – Xem điểm

**Tác nhân:** Sinh viên đã đăng nhập. Chỉ xem điểm gắn với hồ sơ của chính mình.

**Luồng chính:** kiểm tra hồ sơ sinh viên → hiển thị môn, tín chỉ, giảng viên, học kỳ (mới nhất trước), điểm thành phần, tổng kết, chữ và ghi chú.

**Lỗi:** tài khoản không có hồ sơ sinh viên → thông báo không tìm thấy hồ sơ; chưa có điểm → trạng thái rỗng “Chưa có điểm”; yêu cầu xem điểm sinh viên khác qua tham số URL/body → `403` (hoặc `404` để tránh lộ sự tồn tại), không trả dữ liệu của người khác.

## UC007 – CRUD tin tức

**Tác nhân:** Quản trị viên đã đăng nhập.

| Trường | Bắt buộc | Quy tắc hợp lệ |
|---|---:|---|
| Tiêu đề | Có | Sau trim không rỗng |
| Mô tả ngắn | Không | Chuỗi tùy chọn |
| Nội dung | Có | Sau trim không rỗng |
| Danh mục | Không | Một trong danh mục quy định; mặc định Thông báo |
| Trạng thái | Không | Đăng ngay / Lưu bản nháp |
| Quan trọng | Không | Boolean; mặc định false |

**Luồng chính:** danh sách mọi tin, tin quan trọng trước; tìm kiếm/lọc; tạo, sửa, xóa sau xác nhận. Bản nháp chỉ quản trị viên xem; tin công khai sinh viên và giảng viên xem được.

**Lỗi:** thiếu tiêu đề/nội dung; danh mục/trạng thái không thuộc tập cho phép; quan trọng không phải boolean; tìm kiếm/lọc không có kết quả hiển thị trạng thái rỗng; sửa/xóa với vai trò không phải admin bị từ chối ở API.

## UC008 – Xem thông báo tin tức

**Tác nhân:** Sinh viên, giảng viên đã đăng nhập.

**Luồng chính:** hiển thị tin đã đăng, tin quan trọng trước rồi mới nhất; hỗ trợ tìm không phân biệt hoa/thường và dấu theo tiêu đề, mô tả, nội dung, danh mục, người đăng; lọc danh mục và tin quan trọng.

**Lỗi/trạng thái rỗng:** chưa có tin công khai → “Chưa có tin tức”; không có kết quả bộ lọc → “Không tìm thấy tin phù hợp”; gọi API bằng ID bản nháp không được xem nội dung nháp (`403` hoặc `404`). Người chưa đăng nhập nhận `401` nếu đây là chức năng yêu cầu đăng nhập.

## UC009 – Đăng ký tài khoản

**Tác nhân:** Khách; chỉ được tự đăng ký Sinh viên hoặc Giảng viên, không được tự tạo Admin.

| Trường | Bắt buộc | Quy tắc hợp lệ |
|---|---:|---|
| Username | Có | 12–50 ký tự; chữ, số, `_`, `-`; duy nhất |
| Mật khẩu | Có | 6–30 ký tự; lưu dạng hash, không trả lại trong response |
| Họ tên | Có | Sau trim không rỗng |
| Email | Có | Đúng định dạng email, tối đa 255 ký tự; duy nhất không phân biệt hoa/thường |
| Vai trò | Có | `student` hoặc `lecturer` |
| Lớp/ngành | Có với student | Không rỗng; tối đa 32 ký tự mỗi trường |
| Khoa/bộ môn, học vị | Không, lecturer | Tối đa 80 ký tự mỗi trường |
| Giới tính | Có | Nam, Nữ hoặc Khác |
| Ngày sinh | Có | Ngày lịch hợp lệ, trước ngày hiện tại |
| Số điện thoại | Có | 9–10 chữ số, bắt đầu bằng 0 |
| Mã hồ sơ | Tự cấp | Student: 10 chữ số bắt đầu `222`; lecturer: `GV` + số thứ tự |

**Luồng chính:** chọn vai trò → nhập các trường tương ứng → kiểm tra bắt buộc/định dạng → kiểm tra username/email duy nhất → tạo tài khoản và hồ sơ, cấp mã tự động.

**Lỗi:** thiếu trường bắt buộc; username sai ký tự/độ dài; mật khẩu 5/31; email sai định dạng hoặc 256 ký tự; email/username đã dùng (kể cả khác hoa/thường); lớp/ngành 33 ký tự; khoa/học vị 81 ký tự; giới tính ngoài danh sách; ngày sinh không tồn tại hoặc hôm nay/tương lai; điện thoại 8/11 số hoặc không bắt đầu 0; vai trò `admin` hoặc giá trị tùy ý; gửi trường hồ sơ trái vai trò; mã hồ sơ trùng do tạo đồng thời. Dữ liệu sai trả `400`, xung đột duy nhất trả `409`.

**Lưu ý sửa dữ liệu gốc:** bảng đầu vào UC009 trong bản nháp bị lệch nội dung ở các dòng Username, Mật khẩu, Họ tên; dùng các quy tắc phía trên thay cho mô tả tìm kiếm/lọc tin tức bị dán nhầm.

## Kiểm thử API – một số trường hợp phân quyền

| Vai trò/token | API/thao tác | Kết quả mong đợi |
|---|---|---|
| Không có token | API yêu cầu đăng nhập (ví dụ tạo môn, xem điểm) | `401`; không thay đổi dữ liệu |
| Student | Gọi API tạo/sửa/xóa môn học hoặc quản lý lớp | `403`; không thay đổi dữ liệu |
| Lecturer A | Đọc/sửa/xóa môn hoặc lớp do Lecturer B sở hữu | `403` hoặc `404` nhất quán; không lộ dữ liệu và không thay đổi dữ liệu |
| Student A | Gửi ID Student B vào API xem điểm | `403` hoặc `404`; không trả điểm B |
| Student/Lecturer | Gọi API CRUD tin quản trị | `403`; không thay đổi dữ liệu |
| Admin | Gọi API tạo tài khoản với role `admin` qua đăng ký công khai | `400`; đăng ký công khai không cấp quyền admin |

## Phân vùng tương đương và giá trị biên – checklist rút gọn

| Trường | Phân vùng hợp lệ | Phân vùng không hợp lệ / biên cần thử |
|---|---|---|
| Username UC001/009 | Chuỗi đúng pattern, độ dài 12–50 | Rỗng; ký tự cấm; 11/51 ký tự |
| Password | 6–30 ký tự | Rỗng; 5/31 ký tự |
| Mã môn/lớp | 2–20 ký tự đúng pattern, chưa tồn tại | Ký tự cấm; 1/21 ký tự; trùng khác hoa/thường |
| Tên môn | 12–50 ký tự | Rỗng; 11/51 ký tự |
| Tín chỉ | Số nguyên 1–10 | 0/11; số thập phân; chữ |
| Sĩ số | Số nguyên 1–120 | 0/121; số thập phân |
| Điểm | Số 0–10 | -0.01/10.01; chữ; null |
| Ghi chú điểm | 0–500 ký tự | 501 ký tự |
| Email | Địa chỉ đúng định dạng, ≤255 | Sai định dạng; 256 ký tự; trùng không phân biệt hoa/thường |
| Điện thoại | 9–10 chữ số, bắt đầu 0 | 8/11 số; ký tự chữ; không bắt đầu 0 |

