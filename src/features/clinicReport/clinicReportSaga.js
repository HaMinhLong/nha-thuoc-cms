import { call, takeLatest } from 'redux-saga/effects';
import {
  getListDoctorReport,
  getListCustomerReport,
} from '../../api/clinicReport';

function* getList({ payload, callback }) {
  const { data } = yield call(getListDoctorReport, payload);

  if (callback) callback(data);
}
function* getListCustomer({ payload, callback }) {
  const { data } = yield call(getListCustomerReport, payload);

  if (callback) callback(data);
}

export function* clinicReportSaga() {
  yield takeLatest('clinicReport/doctorReport', getList);
  yield takeLatest('clinicReport/customerReport', getListCustomer);
}
