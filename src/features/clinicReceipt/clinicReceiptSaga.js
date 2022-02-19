import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './clinicReceiptSlice';
import {
  getListClinicReceipt,
  getOneClinicReceipt,
  createClinicReceipt,
  updateClinicReceipt,
  updateStatusClinicReceipt,
  deleteClinicReceipt,
} from '../../api/clinicReceipt';

function* getList({ payload, callback }) {
  const { data } = yield call(getListClinicReceipt, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListClinicReceipt, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneClinicReceipt, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createClinicReceipt, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateClinicReceipt, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusClinicReceipt, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteClinicReceipt, id);
  if (callback) callback(data);
}

export function* clinicReceiptSaga() {
  yield takeLatest('clinicReceipt/fetch', getList);
  yield takeLatest('clinicReceipt/getOne', getOne);
  yield takeLatest('clinicReceipt/add', create);
  yield takeLatest('clinicReceipt/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('clinicReceipt/update', updateRecord);
  yield takeLatest('clinicReceipt/updateStatus', updateStatus);
  yield takeLatest('clinicReceipt/delete', deleteRecord);
}
