import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './paymentMethodSlice';
import {
  getListPaymentMethod,
  getOnePaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  updateStatusPaymentMethod,
  deletePaymentMethod,
} from '../../api/paymentMethod';

function* getList({ payload, callback }) {
  const { data } = yield call(getListPaymentMethod, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListPaymentMethod, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOnePaymentMethod, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createPaymentMethod, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updatePaymentMethod, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusPaymentMethod, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deletePaymentMethod, id);
  if (callback) callback(data);
}

export function* paymentMethodSaga() {
  yield takeLatest('paymentMethod/fetch', getList);
  yield takeLatest('paymentMethod/getOne', getOne);
  yield takeLatest('paymentMethod/add', create);
  yield takeLatest('paymentMethod/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('paymentMethod/update', updateRecord);
  yield takeLatest('paymentMethod/updateStatus', updateStatus);
  yield takeLatest('paymentMethod/delete', deleteRecord);
}
