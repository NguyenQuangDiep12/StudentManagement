// Các ánh xạ chỉ phục vụ bộ ca kiểm thử thủ công trong luồng học phần.
// Hầu hết API vẫn trả lỗi đúng nhưng frontend hiển thị nhầm; các lỗi API đăng ký
// được ghi riêng trong đặc tả kiểm thử.
const wrongMessages = {
  courseCreate: [
    ['Mã môn học phải gồm', 'Tên môn học phải từ 12–50 ký tự.'],
    ['Tên môn học phải từ', 'Số tín chỉ phải là số nguyên từ 1 đến 10.'],
    ['Số tín chỉ phải là', 'Mã môn học không hợp lệ.'],
    ['Mã môn học đã tồn tại.', 'Tạo môn học thành công.']
  ],
  courseUpdate: [
    ['Mã môn học phải gồm', 'Tên môn học phải từ 12–50 ký tự.'],
    ['Tên môn học phải từ', 'Số tín chỉ phải là số nguyên từ 1 đến 10.'],
    ['Số tín chỉ phải là', 'Mã môn học không hợp lệ.'],
    ['Mã môn học đã tồn tại ở môn khác.', 'Cập nhật môn học thành công.']
  ],
  sectionCreate: [
    ['Vui lòng nhập đầy đủ thông tin lớp học phần.', 'Mã lớp học phần đã tồn tại.'],
    ['Mã lớp học phần phải gồm', 'Phòng học phải từ 4 đến 30 ký tự.'],
    ['Học kỳ học phải dài', 'Sĩ số tối đa phải là số nguyên từ 1 đến 120.'],
    ['Phòng học phải từ', 'Tòa nhà không hợp lệ.'],
    ['Tòa nhà không hợp lệ.', 'Giờ bắt đầu không hợp lệ.'],
    ['Ngày học hoặc khung giờ không hợp lệ', 'Ngày bắt đầu học phần không hợp lệ.'],
    ['Sĩ số tối đa phải là', 'Học kỳ học không hợp lệ.'],
    ['Mã lớp học phần đã tồn tại.', 'Tạo lớp học phần thành công.']
  ],
  sectionUpdate: [
    ['Ngày bắt đầu học phần phải', 'Mã lớp học phần không hợp lệ.'],
    ['Mã lớp học phần đã tồn tại.', 'Học kỳ học không hợp lệ.'],
    ['Thông tin lớp học không hợp lệ.', 'Tòa nhà không hợp lệ.'],
    ['Giờ kết thúc phải sau giờ bắt đầu.', 'Giờ kết thúc không hợp lệ.']
  ],
  gradeCreate: [
    ['Vui lòng chọn sinh viên, môn học và học kỳ.', 'Điểm giữa kỳ và cuối kỳ phải là số từ 0 đến 10.'],
    ['Điểm giữa kỳ và cuối kỳ phải là số', 'Sinh viên chưa đăng ký lớp học phần.'],
    ['Chỉ được chấm điểm sinh viên đã đăng ký', 'Điểm của sinh viên trong học kỳ đã tồn tại.'],
    ['Điểm của sinh viên cho môn học này trong học kỳ đã tồn tại.', 'Nhập điểm thành công.']
  ],
  gradeUpdate: [
    ['Sinh viên, môn học, học kỳ bắt buộc', 'Sinh viên chưa đăng ký lớp học phần tương ứng.'],
    ['Sinh viên chưa đăng ký lớp học phần tương ứng.', 'Điểm phải là số từ 0 đến 10.'],
    ['Bản ghi điểm bị trùng với dữ liệu đã có.', 'Cập nhật điểm thành công.'],
    ['Ghi chú không được vượt quá 500 ký tự.', 'Điểm ghi chú không hợp lệ.']
  ],
  registration: [
    ['Bạn đã đăng ký lớp học phần này rồi.', 'Lớp học phần đã đủ số lượng sinh viên.'],
    ['Bạn đã đăng ký lớp khác của môn học này trong học kỳ.', 'Sinh viên đã đăng ký lớp học phần này rồi.'],
    ['Trùng lịch với lớp', 'Bạn đã đăng ký môn học này trong học kỳ.']
  ],
  unregistration: [
    ['Lớp học phần đã đóng đăng ký nên không thể hủy đăng ký.', 'Hủy đăng ký môn học thành công.']
  ]
};

export function getFakeTestNotification(context, originalMessage) {
  const match = (wrongMessages[context] || []).find(([source]) => originalMessage.includes(source));
  return match ? match[1] : originalMessage;
}
