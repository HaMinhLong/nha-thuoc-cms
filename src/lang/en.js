const Config = require('./en-US/Config');
const UserGroup = require('./en-US/UserGroup');
const User = require('./en-US/User');
const Menu = require('./en-US/Menu');
const UserGroupRole = require('./en-US/UserGroupRole');
const Login = require('./en-US/Login');
const Account = require('./en-US/Account');
const Province = require('./en-US/Province');
const District = require('./en-US/District');
const Ward = require('./en-US/Ward');
const PaymentMethod = require('./en-US/PaymentMethod');
const MedicalFacilityGroup = require('./en-US/MedicalFacilityGroup');
const Specialist = require('./en-US/Specialist');
const MedicalFacility = require('./en-US/MedicalFacility');
const Place = require('./en-US/Place');
const HealthFacility = require('./en-US/HealthFacility');
const SupplierGroup = require('./en-US/SupplierGroup');
const Supplier = require('./en-US/Supplier');
const ProducerGroup = require('./en-US/ProducerGroup');
const Producer = require('./en-US/Producer');
const CustomerGroup = require('./en-US/CustomerGroup');
const Customer = require('./en-US/Customer');
const Medicine = require('./en-US/Medicine');
const MedicineUnit = require('./en-US/MedicineUnit');
const MedicineType = require('./en-US/MedicineType');
const Apothecary = require('./en-US/Apothecary');
const Package = require('./en-US/Package');
const Unit = require('./en-US/Unit');
const Warehouse = require('./en-US/Warehouse');
const PrintForm = require('./en-US/PrintForm');
const ClinicServicePackage = require('./en-US/ClinicServicePackage');
const ClinicService = require('./en-US/ClinicService');
const Receipt = require('./en-US/Receipt');
const ReceiptMedicine = require('./en-US/ReceiptMedicine');
const MedicineIssue = require('./en-US/MedicineIssue');
const Consumable = require('./en-US/Consumable');
const MedicineTransfer = require('./en-US/MedicineTransfer');
const MedicalRegister = require('./en-US/MedicalRegister');
const ClinicReceipt = require('./en-US/ClinicReceipt');
const ClinicReceiptService = require('./en-US/ClinicReceiptService');
const ClinicResult = require('./en-US/ClinicResult');
const ClinicPrescription = require('./en-US/ClinicPrescription');
const ClinicPreMedicine = require('./en-US/ClinicPreMedicine');
const DoctorReport = require('./en-US/DoctorReport');
const CustomerReport = require('./en-US/CustomerReport');
const EmployeeReport = require('./en-US/EmployeeReport');
const SupplierReport = require('./en-US/SupplierReport');

module.exports = {
  'app.common.validate.max300':
    'Please enter the correct format up to 300 characters',
  'app.table.column.no': '#',
  'app.tooltip.remove': 'Delete',
  'app.tooltip.edit': 'Update',
  'app.title.export': 'Create news points',
  'app.title.changePlace': 'Change place',
  'app.title.selectPlace': 'Select place',
  'app.title.accountSettings': 'Account Settings',
  'app.user.permissions': 'Grant permission',
  'app.title.create': 'Add {name}',
  'app.title.update': 'Update {name}',
  'app.confirm.remove': 'Are you sure you want to delete the record?',
  'app.confirm.reset': 'Definitely want to cancel?',
  'app.search.placeHolder': 'Search by name {functionName}',
  'app.search.label': 'Name {name}',
  'app.search.button': 'Search',
  'app.search.status': 'Status',
  'app.common.action': '#',
  'app.common.yes': 'Yes',
  'app.common.no': 'No',
  'app.common.deleteBtn.cancelText': 'Cancel',
  'app.common.statusTag.-1': 'Delete',
  'app.common.statusTag.-2': 'Not activated',
  'app.common.statusTag.-3': 'Pending',
  'app.common.statusTag.1': 'Activated',
  'app.common.statusTag.0': 'Hide',
  'app.common.status.placeholder': 'Status search',
  'app.common.type.placeholder': 'Search {name}',
  'app.common.placeholder.dateCreated': 'Date created',
  'app.common.placeholder.dateUpdated': 'Date updated',
  'app.common.placeholder.rangepicker.0': 'Start day',
  'app.common.placeholder.rangepicker.1': 'End date',
  'app.common.crudBtns.0': 'Come back',
  'app.common.crudBtns.1': 'Refresh',
  'app.common.crudBtns.2': 'Save',
  'app.common.crudBtns.3': 'Export report',
  'app.common.crudBtns.4': 'Save',
  'app.common.searchBtn': 'Search',
  'app.common.different': 'Different',
  'app.common.inDay': 'In day',
  'app.common.inWeek': 'In week',
  'app.common.inMonth': 'In month',
  'app.common.forgotBtn': 'Send email',
  'app.common.delete.success': 'Delete record successfully!',
  'app.common.edit.success': 'Successfully updated!',
  'app.common.login.success': 'Successfully login!',
  'app.common.export.success': 'Export statistics {name} successfully!',
  'app.common.create.success': 'Add {name} successfully!',
  'app.common.permissions.success': 'Grant permissions successfully!',
  'app.common.switch.lang': 'Switch language',
  'app.common.error.server.msg': 'An error occurred!',
  'app.common.crud.error.update.change': 'Please change at least 1 field',
  'app.common.crud.validate.input': 'Please enter information',
  'app.common.crud.validate.select': 'Please select information',
  'app.common.crud.validate.fomatUnit':
    'Please enter between 1 and 50 characters including letters, numbers and starting with a letter',
  'app.common.crud.validate.fomatMedi':
    'Please enter between 3 and 50 characters including letters, numbers /-, and starting with a letter',
  'app.common.crud.validate.fomat':
    'Please enter between 3 and 50 characters including letters, numbers and starting with a letter',
  'app.common.crud.validate.nameUrl':
    'Please enter at least 3 characters including letters and special characters',
  'app.common.crud.validate.fomatNew':
    'Please enter at least 3 characters including letters, numbers and starting with a letter',
  'app.common.crud.validate.formatName':
    'Please enter at least 3 characters including letters, numbers and unsigned special characters',
  'app.common.crud.validate.url': 'Please enter correct url format',
  'app.common.crud.validate.phone': 'Please enter correct phone number format',
  'app.common.crud.validate.number': 'Please enter correct number format',
  'app.common.crud.validate.email': 'Please enter correct email format',
  'app.common.crud.validate.password':
    'Please enter a password containing at least 6 characters, including letters and numbers',
  'app.common.crud.validate.phone_email':
    'Please enter the correct phone number or email format',
  'app.common.crud.validate.type':
    'Please enter the correct format {name} from 3 to 50 characters',
  'app.common.validate.max': 'Please enter up to {max} characters!',
  'app.common.changeStatus.success': 'Status update successful!',
  'app.common.validate.message': 'Please enter a message!',
  'app.common.validate.max200': 'Please enter up to 200 characters!',

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
};
