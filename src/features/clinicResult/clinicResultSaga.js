import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './clinicResultSlice';
import {
  getListClinicResult,
  getOneClinicResult,
  createClinicResult,
  updateClinicResult,
  deleteClinicResult,
} from '../../api/clinicResult';

function* getList({ payload, callback }) {
  const { data } = yield call(getListClinicResult, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListClinicResult, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneClinicResult, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createClinicResult, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateClinicResult, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteClinicResult, id);
  if (callback) callback(data);
}

export function* clinicResultSaga() {
  yield takeLatest('clinicResult/fetch', getList);
  yield takeLatest('clinicResult/getOne', getOne);
  yield takeLatest('clinicResult/add', create);
  yield takeLatest('clinicResult/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('clinicResult/update', updateRecord);
  yield takeLatest('clinicResult/delete', deleteRecord);
}
