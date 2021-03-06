import { all } from 'redux-saga/effects';
import { userGroupSaga } from '../features/userGroup/userGroupSaga';
import { userSaga } from '../features/user/userSaga';
import { menuSaga } from '../features/menu/menuSaga';
import { configSaga } from '../features/config/configSaga';
import { userGroupRoleSaga } from '../features/userGroupRole/userGroupRoleSaga';
import { authSaga } from '../features/auth/authSaga';
import { provinceSaga } from '../features/province/provinceSaga';
import { districtSaga } from '../features/district/districtSaga';
import { wardSaga } from '../features/ward/wardSaga';
import { paymentMethodSaga } from '../features/paymentMethod/paymentMethodSaga';
import { medicalFacilityGroupSaga } from '../features/medicalFacilityGroup/medicalFacilityGroupSaga';
import { specialistSaga } from '../features/specialist/specialistSaga';
import { medicalFacilitySaga } from '../features/medicalFacility/medicalFacilitySaga';
import { placeSaga } from '../features/place/placeSaga';
import { healthFacilitySaga } from '../features/healthFacility/healthFacilitySaga';
import { healthFacilitySpecialistSaga } from '../features/healthFacilitySpecialist/healthFacilitySpecialistSaga';
import { healthFacilityUserSaga } from '../features/healthFacilityUser/healthFacilityUserSaga';
import { supplierGroupSaga } from '../features/supplierGroup/supplierGroupSaga';
import { supplierSaga } from '../features/supplier/supplierSaga';
import { producerGroupSaga } from '../features/producerGroup/producerGroupSaga';
import { producerSaga } from '../features/producer/producerSaga';
import { customerGroupSaga } from '../features/customerGroup/customerGroupSaga';
import { customerSaga } from '../features/customer/customerSaga';
import { medicineSaga } from '../features/medicine/medicineSaga';
import { medicineUnitSaga } from '../features/medicineUnit/medicineUnitSaga';
import { medicineTypeSaga } from '../features/medicineType/medicineTypeSaga';
import { apothecarySaga } from '../features/apothecary/apothecarySaga';
import { packagesSaga } from '../features/packages/packagesSaga';
import { unitSaga } from '../features/unit/unitSaga';
import { warehouseSaga } from '../features/warehouse/warehouseSaga';
import { printFormSaga } from '../features/printForm/printFormSaga';
import { paperSizeTypeSaga } from '../features/paperSizeType/paperSizeTypeSaga';
import { workScheduleSaga } from '../features/workSchedule/workScheduleSaga';
import { clinicTypeSaga } from '../features/clinicType/clinicTypeSaga';
import { clinicServicePackageSaga } from '../features/clinicServicePackage/clinicServicePackageSaga';
import { clinicServiceSaga } from '../features/clinicService/clinicServiceSaga';
import { receiptSaga } from '../features/receipt/receiptSaga';
import { receiptCodeSaga } from '../features/receiptCode/receiptCodeSaga';
import { receiptMedicineSaga } from '../features/receiptMedicine/receiptMedicineSaga';
import { warehouseUserSaga } from '../features/warehouseUser/warehouseUserSaga';
import { medicineIssueSaga } from '../features/medicineIssue/medicineIssueSaga';
import { medicineIssueMedicineSaga } from '../features/medicineIssueMedicine/medicineIssueMedicineSaga';
import { warehouseMedicineSaga } from '../features/warehouseMedicine/warehouseMedicineSaga';
import { consumableSaga } from '../features/consumable/consumableSaga';
import { medicineTransferSaga } from '../features/medicineTransfer/medicineTransferSaga';
import { clinicTimeSaga } from '../features/clinicTime/clinicTimeSaga';
import { medicalRegisterSaga } from '../features/medicalRegister/medicalRegisterSaga';
import { clinicReceiptSaga } from '../features/clinicReceipt/clinicReceiptSaga';
import { clinicReceiptServiceSaga } from '../features/clinicReceiptService/clinicReceiptServiceSaga';
import { clinicResultSaga } from '../features/clinicResult/clinicResultSaga';
import { clinicPrescriptionSaga } from '../features/clinicPrescription/clinicPrescriptionSaga';
import { clinicPreMedicineSaga } from '../features/clinicPreMedicine/clinicPreMedicineSaga';
import { clinicReportSaga } from '../features/clinicReport/clinicReportSaga';
import { medicineReportSaga } from '../features/medicineReport/medicineReportSaga';

export default function* rootSaga() {
  yield all([
    userGroupSaga(),
    userSaga(),
    menuSaga(),
    configSaga(),
    userGroupRoleSaga(),
    authSaga(),
    provinceSaga(),
    districtSaga(),
    wardSaga(),
    paymentMethodSaga(),
    medicalFacilityGroupSaga(),
    specialistSaga(),
    medicalFacilitySaga(),
    placeSaga(),
    healthFacilitySaga(),
    healthFacilitySpecialistSaga(),
    healthFacilityUserSaga(),
    supplierGroupSaga(),
    supplierSaga(),
    producerGroupSaga(),
    producerSaga(),
    customerGroupSaga(),
    customerSaga(),
    medicineSaga(),
    medicineUnitSaga(),
    medicineTypeSaga(),
    apothecarySaga(),
    packagesSaga(),
    unitSaga(),
    warehouseSaga(),
    printFormSaga(),
    paperSizeTypeSaga(),
    workScheduleSaga(),
    clinicTypeSaga(),
    clinicServicePackageSaga(),
    clinicServiceSaga(),
    receiptSaga(),
    receiptCodeSaga(),
    receiptMedicineSaga(),
    warehouseUserSaga(),
    medicineIssueSaga(),
    medicineIssueMedicineSaga(),
    warehouseMedicineSaga(),
    consumableSaga(),
    medicineTransferSaga(),
    clinicTimeSaga(),
    medicalRegisterSaga(),
    clinicReceiptSaga(),
    clinicReceiptServiceSaga(),
    clinicResultSaga(),
    clinicPrescriptionSaga(),
    clinicPreMedicineSaga(),
    clinicReportSaga(),
    medicineReportSaga(),
  ]);
}
