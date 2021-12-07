import { put, call, takeLatest } from 'redux-saga/effects';
import { save, query } from './clinicTypeSlice';
import { getListClinicType } from '../../api/clinicType';

function* getList({ payload, callback }) {
  const { data } = yield call(getListClinicType, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListClinicType, payload);
  if (callback) callback(data);
}

export function* clinicTypeSaga() {
  yield takeLatest('clinicType/fetch', getList);
  yield takeLatest('clinicType/fetchLazyLoading', fetchLazyLoading);
}
