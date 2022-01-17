import userGroupReducer from '../features/userGroup/userGroupSlice';
import userReducer from '../features/user/userSlice';
import menuReducer from '../features/menu/menuSlice';
import configReducer from '../features/config/configSlice';
import userGroupRoleReducer from '../features/userGroupRole/userGroupRoleSlice';
import authReducer from '../features/auth/authSlice';
import provinceReducer from '../features/province/provinceSlice';
import districtReducer from '../features/district/districtSlice';
import wardReducer from '../features/ward/wardSlice';
import paymentMethodReducer from '../features/paymentMethod/paymentMethodSlice';
import medicalFacilityGroupReducer from '../features/medicalFacilityGroup/medicalFacilityGroupSlice';
import specialistReducer from '../features/specialist/specialistSlice';
import medicalFacilityReducer from '../features/medicalFacility/medicalFacilitySlice';
import placeReducer from '../features/place/placeSlice';
import healthFacilityReducer from '../features/healthFacility/healthFacilitySlice';
import healthFacilitySpecialistReducer from '../features/healthFacilitySpecialist/healthFacilitySpecialistSlice';
import healthFacilityUserReducer from '../features/healthFacilityUser/healthFacilityUserSlice';
import supplierGroupReducer from '../features/supplierGroup/supplierGroupSlice';
import supplierReducer from '../features/supplier/supplierSlice';
import producerGroupReducer from '../features/producerGroup/producerGroupSlice';
import producerReducer from '../features/producer/producerSlice';
import customerGroupReducer from '../features/customerGroup/customerGroupSlice';
import customerReducer from '../features/customer/customerSlice';
import medicineReducer from '../features/medicine/medicineSlice';
import medicineUnitReducer from '../features/medicineUnit/medicineUnitSlice';
import medicineTypeReducer from '../features/medicineType/medicineTypeSlice';
import apothecaryReducer from '../features/apothecary/apothecarySlice';
import packagesReducer from '../features/packages/packagesSlice';
import unitReducer from '../features/unit/unitSlice';
import warehouseReducer from '../features/warehouse/warehouseSlice';
import printFormReducer from '../features/printForm/printFormSlice';
import paperSizeTypeReducer from '../features/paperSizeType/paperSizeTypeSlice';
import workScheduleReducer from '../features/workSchedule/workScheduleSlice';
import clinicTypeReducer from '../features/clinicType/clinicTypeSlice';
import clinicServicePackageReducer from '../features/clinicServicePackage/clinicServicePackageSlice';
import clinicServiceReducer from '../features/clinicService/clinicServiceSlice';
import receiptReducer from '../features/receipt/receiptSlice';
import receiptCodeReducer from '../features/receiptCode/receiptCodeSlice';
import receiptMedicineReducer from '../features/receiptMedicine/receiptMedicineSlice';
import warehouseUserReducer from '../features/warehouseUser/warehouseUserSlice';
import medicineIssueReducer from '../features/medicineIssue/medicineIssueSlice';
import medicineIssueMedicineReducer from '../features/medicineIssueMedicine/medicineIssueMedicineSlice';
import warehouseMedicineReducer from '../features/warehouseMedicine/warehouseMedicineSlice';
import consumableReducer from '../features/consumable/consumableSlice';
import medicineTransferReducer from '../features/medicineTransfer/medicineTransferSlice';
import clinicTimeReducer from '../features/clinicTime/clinicTimeSlice';
import medicalRegisterReducer from '../features/medicalRegister/medicalRegisterSlice';

export const rootReducer = {
  userGroup: userGroupReducer,
  user: userReducer,
  menu: menuReducer,
  config: configReducer,
  userGroupRole: userGroupRoleReducer,
  auth: authReducer,
  province: provinceReducer,
  district: districtReducer,
  ward: wardReducer,
  paymentMethod: paymentMethodReducer,
  medicalFacilityGroup: medicalFacilityGroupReducer,
  specialist: specialistReducer,
  place: placeReducer,
  medicalFacility: medicalFacilityReducer,
  healthFacility: healthFacilityReducer,
  healthFacilitySpecialist: healthFacilitySpecialistReducer,
  healthFacilityUser: healthFacilityUserReducer,
  supplierGroup: supplierGroupReducer,
  supplier: supplierReducer,
  producerGroup: producerGroupReducer,
  producer: producerReducer,
  customerGroup: customerGroupReducer,
  customer: customerReducer,
  medicine: medicineReducer,
  medicineUnit: medicineUnitReducer,
  medicineType: medicineTypeReducer,
  apothecary: apothecaryReducer,
  packages: packagesReducer,
  unit: unitReducer,
  warehouse: warehouseReducer,
  printForm: printFormReducer,
  paperSizeType: paperSizeTypeReducer,
  workSchedule: workScheduleReducer,
  clinicType: clinicTypeReducer,
  clinicServicePackage: clinicServicePackageReducer,
  clinicService: clinicServiceReducer,
  receipt: receiptReducer,
  receiptCode: receiptCodeReducer,
  receiptMedicine: receiptMedicineReducer,
  warehouseUser: warehouseUserReducer,
  medicineIssue: medicineIssueReducer,
  medicineIssueMedicine: medicineIssueMedicineReducer,
  warehouseMedicine: warehouseMedicineReducer,
  consumable: consumableReducer,
  medicineTransfer: medicineTransferReducer,
  clinicTime: clinicTimeReducer,
  medicalRegister: medicalRegisterReducer,
};
