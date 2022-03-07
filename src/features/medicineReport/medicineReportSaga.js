import { call, takeLatest } from 'redux-saga/effects';
import {
  getListCustomerReport,
  getListEmployeeReport,
  getListSupplierReport,
  getListExpiredMedicineReport,
  getListExpiredMedicineReportV2,
  getListMedicineReport,
} from '../../api/medicineReport';

function* getList({ payload, callback }) {
  const { data } = yield call(getListCustomerReport, payload);
  if (callback) callback(data);
}
function* getListEmployee({ payload, callback }) {
  const { data } = yield call(getListEmployeeReport, payload);
  if (callback) callback(data);
}
function* getListSupplier({ payload, callback }) {
  const { data } = yield call(getListSupplierReport, payload);
  if (callback) callback(data);
}
function* getListExpiredMedicine({ payload, callback }) {
  const { data } = yield call(getListExpiredMedicineReport, payload);
  if (callback) callback(data);
}
function* getListExpiredMedicineV2({ payload, callback }) {
  const { data } = yield call(getListExpiredMedicineReportV2, payload);
  if (callback) callback(data);
}
function* getListMedicine({ payload, callback }) {
  const { data } = yield call(getListMedicineReport, payload);
  if (callback) callback(data);
}

export function* medicineReportSaga() {
  yield takeLatest('medicineReport/customerReport', getList);
  yield takeLatest('medicineReport/employeeReport', getListEmployee);
  yield takeLatest('medicineReport/supplierReport', getListSupplier);
  yield takeLatest('medicineReport/expiredMedicine', getListExpiredMedicine);
  yield takeLatest(
    'medicineReport/expiredMedicinev2',
    getListExpiredMedicineV2
  );
  yield takeLatest('medicineReport/medicine', getListMedicine);
}
