import { put, call, takeLatest } from 'redux-saga/effects';
import { save, query } from './clinicTimeSlice';
import {
  getListClinicTime,
  updateStatusClinicTime,
} from '../../api/clinicTime';

function* getList({ payload, callback }) {
  const { data } = yield call(getListClinicTime, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListClinicTime, payload);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusClinicTime, id, params);
  if (callback) callback(data);
}

export function* clinicTimeSaga() {
  yield takeLatest('clinicTime/fetch', getList);
  yield takeLatest('clinicTime/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('clinicTime/updateStatus', updateStatus);
}
