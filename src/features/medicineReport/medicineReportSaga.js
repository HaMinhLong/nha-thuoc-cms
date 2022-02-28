import { call, takeLatest } from 'redux-saga/effects';
import {
  getListCustomerReport,
  getListEmployeeReport,
  getListSupplierReport,
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

export function* medicineReportSaga() {
  yield takeLatest('medicineReport/customerReport', getList);
  yield takeLatest('medicineReport/employeeReport', getListEmployee);
  yield takeLatest('medicineReport/supplierReport', getListSupplier);
}
