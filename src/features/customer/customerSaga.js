import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './customerSlice';
import {
  getListCustomer,
  getOneCustomer,
  createCustomer,
  updateCustomer,
  updateStatusCustomer,
  deleteCustomer,
} from '../../api/customer';

function* getList({ payload, callback }) {
  const { data } = yield call(getListCustomer, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListCustomer, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneCustomer, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createCustomer, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateCustomer, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusCustomer, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteCustomer, id);
  if (callback) callback(data);
}

export function* customerSaga() {
  yield takeLatest('customer/fetch', getList);
  yield takeLatest('customer/getOne', getOne);
  yield takeLatest('customer/add', create);
  yield takeLatest('customer/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('customer/update', updateRecord);
  yield takeLatest('customer/updateStatus', updateStatus);
  yield takeLatest('customer/delete', deleteRecord);
}
