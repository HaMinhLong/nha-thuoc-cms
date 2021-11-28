import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './customerGroupSlice';
import {
  getListCustomerGroup,
  getOneCustomerGroup,
  createCustomerGroup,
  updateCustomerGroup,
  updateStatusCustomerGroup,
  deleteCustomerGroup,
} from '../../api/customerGroup';

function* getList({ payload, callback }) {
  const { data } = yield call(getListCustomerGroup, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListCustomerGroup, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneCustomerGroup, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createCustomerGroup, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateCustomerGroup, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusCustomerGroup, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteCustomerGroup, id);
  if (callback) callback(data);
}

export function* customerGroupSaga() {
  yield takeLatest('customerGroup/fetch', getList);
  yield takeLatest('customerGroup/getOne', getOne);
  yield takeLatest('customerGroup/add', create);
  yield takeLatest('customerGroup/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('customerGroup/update', updateRecord);
  yield takeLatest('customerGroup/updateStatus', updateStatus);
  yield takeLatest('customerGroup/delete', deleteRecord);
}
