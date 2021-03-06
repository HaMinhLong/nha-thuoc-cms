const Config = require('./vi-VN/Config');
const UserGroup = require('./vi-VN/UserGroup');
const User = require('./vi-VN/User');
const Menu = require('./vi-VN/Menu');
const UserGroupRole = require('./vi-VN/UserGroupRole');
const Login = require('./vi-VN/Login');
const Account = require('./vi-VN/Account');
const Province = require('./vi-VN/Province');
const District = require('./vi-VN/District');
const Ward = require('./vi-VN/Ward');
const PaymentMethod = require('./vi-VN/PaymentMethod');
const MedicalFacilityGroup = require('./vi-VN/MedicalFacilityGroup');
const Specialist = require('./vi-VN/Specialist');
const MedicalFacility = require('./vi-VN/MedicalFacility');
const Place = require('./vi-VN/Place');
const HealthFacility = require('./vi-VN/HealthFacility');
const SupplierGroup = require('./vi-VN/SupplierGroup');
const Supplier = require('./vi-VN/Supplier');
const ProducerGroup = require('./vi-VN/ProducerGroup');
const Producer = require('./vi-VN/Producer');
const CustomerGroup = require('./vi-VN/CustomerGroup');
const Customer = require('./vi-VN/Customer');
const Medicine = require('./vi-VN/Medicine');
const MedicineUnit = require('./vi-VN/MedicineUnit');
const MedicineType = require('./vi-VN/MedicineType');
const Apothecary = require('./vi-VN/Apothecary');
const Package = require('./vi-VN/Package');
const Unit = require('./vi-VN/Unit');
const Warehouse = require('./vi-VN/Warehouse');
const PrintForm = require('./vi-VN/PrintForm');
const ClinicServicePackage = require('./vi-VN/ClinicServicePackage');
const ClinicService = require('./vi-VN/ClinicService');
const Receipt = require('./vi-VN/Receipt');
const ReceiptMedicine = require('./vi-VN/ReceiptMedicine');
const MedicineIssue = require('./vi-VN/MedicineIssue');
const Consumable = require('./vi-VN/Consumable');
const MedicineTransfer = require('./vi-VN/MedicineTransfer');
const MedicalRegister = require('./vi-VN/MedicalRegister');
const ClinicReceipt = require('./vi-VN/ClinicReceipt');
const ClinicReceiptService = require('./vi-VN/ClinicReceiptService');
const ClinicResult = require('./vi-VN/ClinicResult');
const ClinicPrescription = require('./vi-VN/ClinicPrescription');
const ClinicPreMedicine = require('./vi-VN/ClinicPreMedicine');
const DoctorReport = require('./vi-VN/DoctorReport');
const CustomerReport = require('./vi-VN/CustomerReport');
const EmployeeReport = require('./vi-VN/EmployeeReport');
const SupplierReport = require('./vi-VN/SupplierReport');
const ExpiredMedicine = require('./vi-VN/ExpiredMedicine');
const MedicineReport = require('./vi-VN/MedicineReport');
const ClinicCustomerReport = require('./vi-VN/ClinicCustomerReport');

module.exports = {
  'app.common.validate.max300':
    'Vui lòng nhập đúng định dạng tối đa 300 ký tự ',
  'app.table.column.no': '#',
  'app.tooltip.remove': 'Xóa',
  'app.tooltip.edit': 'Sửa',
  'app.title.export': 'Lập điểm tin',
  'app.title.changePlace': 'Thay đổi cơ sở',
  'app.title.selectPlace': 'Chọn cơ sở',
  'app.title.accountSettings': 'Thiết lập tài khoản',
  'app.user.permissions': 'Cấp quyền',
  'app.title.create': 'Thêm mới {name}',
  'app.title.update': 'Sửa thông tin {name}',
  'app.confirm.remove': 'Bạn có chắc chắn muốn xóa bản ghi?',
  'app.confirm.reset': 'Có chắc muốn hủy?',
  'app.search.placeHolder': 'Tìm kiếm theo tên {functionName}',
  'app.search.label': 'Tên {name}',
  'app.search.button': 'Tìm kiếm',
  'app.search.status': 'Trạng thái',
  'app.common.action': '#',
  'app.common.deleteBtn.cancelText': 'Hủy',
  'app.common.statusTag.-1': 'Chờ xóa',
  'app.common.statusTag.-2': 'Chờ kích hoạt',
  'app.common.statusTag.-3': 'Chờ duyệt',
  'app.common.statusTag.1': 'Kích hoạt',
  'app.common.statusTag.0': 'Ẩn',
  'app.common.status.placeholder': 'Tìm kiếm trạng thái',
  'app.common.type.placeholder': 'Tìm kiếm {name}',
  'app.common.placeholder.dateCreated': 'Ngày tạo',
  'app.common.placeholder.dateUpdated': 'Ngày cập nhật',
  'app.common.placeholder.rangepicker.0': 'Ngày bắt đầu',
  'app.common.placeholder.rangepicker.1': 'Ngày kết thúc',
  'app.common.crudBtns.0': 'Quay lại',
  'app.common.crudBtns.1': 'Làm mới',
  'app.common.crudBtns.2': 'Lưu lại',
  'app.common.crudBtns.3': 'Xuất báo cáo',
  'app.common.crudBtns.4': 'Lưu',
  'app.common.searchBtn': 'Tìm kiếm',
  'app.common.yes': 'Có',
  'app.common.no': 'Không',
  'app.common.different': 'Khác',
  'app.common.inDay': 'Trong ngày',
  'app.common.inWeek': 'Trong tuần',
  'app.common.inMonth': 'Trong tháng',
  'app.common.forgotBtn': 'Gửi email',
  'app.common.delete.success': 'Xóa bản ghi thành công!',
  'app.common.login.success': 'Đăng nhập thành công!',
  'app.common.edit.success': 'Cập nhật thông tin thành công!',
  'app.common.export.success': 'Xuất thống kê {name} thành công!',
  'app.common.create.success': 'Thêm mới {name} thành công!',
  'app.common.switch.lang': 'Chuyển đổi ngôn ngữ',
  'app.common.permissions.success': 'Cấp quyền thành công!',
  'app.common.error.server.msg': 'Có lỗi xảy ra!',
  'app.common.crud.error.update.change':
    'Vui lòng thay đổi thông tin ít nhất 1 trường',
  'app.common.crud.validate.input': 'Vui lòng nhập thông tin',
  'app.common.crud.validate.select': 'Vui lòng chọn thông tin',
  'app.common.crud.validate.fomatUnit':
    'Vui lòng nhập từ 1 đến 50 ký tự bao gồm chữ, số và bắt đầu bằng chữ cái',
  'app.common.crud.validate.fomatMedi':
    'Vui lòng nhập từ 3 đến 50 ký tự bao gồm chữ, số /-, và bắt đầu bằng chữ cái',
  'app.common.crud.validate.fomat':
    'Vui lòng nhập từ 3 đến 50 ký tự bao gồm chữ, số và bắt đầu bằng chữ cái',
  'app.common.crud.validate.fomatNew':
    'Vui lòng nhập ít nhất 3 ký tự bao gồm chữ, số và bắt đầu bằng chữ cái',
  'app.common.crud.validate.nameUrl':
    'Vui lòng nhập ít nhất 3 ký tự bao gồm chữ và ký tự đặc biệt',
  'app.common.crud.validate.formatName':
    'Vui lòng nhập ít nhát 3 ký tự bao gồm chữ, số và ký tự đặc biệt không dấu',
  'app.common.crud.validate.url': 'Vui lòng nhập đúng định dạng url',
  'app.common.crud.validate.number': 'Vui lòng nhập đúng định dạng số',
  'app.common.crud.validate.phone': 'Vui lòng nhập đúng định dạng sđt',
  'app.common.crud.validate.email': 'Vui lòng nhập đúng định dạng email',
  'app.common.crud.validate.password':
    'Vui lòng nhập mật khẩu chứa ít nhất 6 ký tự, bao gồm chữ cái và số',
  'app.common.crud.validate.phone_email':
    'Vui lòng nhập đúng định dạng số điện thoại hoặc email',
  'app.common.crud.validate.type':
    'Vui lòng nhập đúng định dạng {name} từ 3 đến 50 ký tự',
  'app.common.validate.max': 'Vui lòng nhập tối đa {max} ký tự',
  'app.common.changeStatus.success': 'Cập nhật trạng thái thành công',
  'app.common.validate.message': 'Vui lòng nhập tin nhắn',
  'app.common.validate.max200': 'Vui lòng nhập tối đa 200 ký tự',

  ...Config,
  ...UserGroup,
  ...User,
  ...Menu,
  ...UserGroupRole,
  ...Login,
  ...Account,
  ...Province,
  ...District,
  ...Ward,
  ...PaymentMethod,
  ...MedicalFacilityGroup,
  ...Specialist,
  ...Place,
  ...MedicalFacility,
  ...HealthFacility,
  ...SupplierGroup,
  ...Supplier,
  ...ProducerGroup,
  ...Producer,
  ...CustomerGroup,
  ...Customer,
  ...Medicine,
  ...MedicineUnit,
  ...MedicineType,
  ...Apothecary,
  ...Package,
  ...Unit,
  ...Warehouse,
  ...PrintForm,
  ...ClinicServicePackage,
  ...ClinicService,
  ...Receipt,
  ...ReceiptMedicine,
  ...MedicineIssue,
  ...Consumable,
  ...MedicineTransfer,
  ...MedicalRegister,
  ...ClinicReceipt,
  ...ClinicReceiptService,
  ...ClinicResult,
  ...ClinicPrescription,
  ...ClinicPreMedicine,
  ...DoctorReport,
  ...CustomerReport,
  ...EmployeeReport,
  ...SupplierReport,
  ...ExpiredMedicine,
  ...MedicineReport,
  ...ClinicCustomerReport,
};
