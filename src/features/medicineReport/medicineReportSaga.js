import { call, takeLatest } from 'redux-saga/effects';
import { getListCustomerReport } from '../../api/medicineReport';

function* getList({ payload, callback }) {
  const { data } = yield call(getListCustomerReport, payload);

  if (callback) callback(data);
}

export function* medicineReportSaga() {
  yield takeLatest('medicineReport/customerReport', getList);
}
