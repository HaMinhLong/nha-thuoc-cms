import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './clinicReceiptServiceSlice';
import {
  getListClinicReceiptService,
  getOneClinicReceiptService,
  createClinicReceiptService,
  updateClinicReceiptService,
  deleteClinicReceiptService,
} from '../../api/clinicReceiptService';

function* getList({ payload, callback }) {
  const { data } = yield call(getListClinicReceiptService, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListClinicReceiptService, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneClinicReceiptService, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createClinicReceiptService, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateClinicReceiptService, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteClinicReceiptService, id);
  if (callback) callback(data);
}

export function* clinicReceiptServiceSaga() {
  yield takeLatest('clinicReceiptService/fetch', getList);
  yield takeLatest('clinicReceiptService/getOne', getOne);
  yield takeLatest('clinicReceiptService/add', create);
  yield takeLatest('clinicReceiptService/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('clinicReceiptService/update', updateRecord);
  yield takeLatest('clinicReceiptService/delete', deleteRecord);
}
