import { call, takeLatest } from 'redux-saga/effects';
import { getListDoctorReport } from '../../api/clinicReport';

function* getList({ payload, callback }) {
  const { data } = yield call(getListDoctorReport, payload);

  if (callback) callback(data);
}

export function* clinicReportSaga() {
  yield takeLatest('clinicReport/doctorReport', getList);
}
