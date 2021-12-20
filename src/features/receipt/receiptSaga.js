import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './receiptSlice';
import {
  getListReceipt,
  getOneReceipt,
  createReceipt,
  updateReceipt,
  updateStatusReceipt,
  deleteReceipt,
} from '../../api/receipt';

function* getList({ payload, callback }) {
  const { data } = yield call(getListReceipt, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListReceipt, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneReceipt, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createReceipt, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateReceipt, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusReceipt, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteReceipt, id);
  if (callback) callback(data);
}

export function* receiptSaga() {
  yield takeLatest('receipt/fetch', getList);
  yield takeLatest('receipt/getOne', getOne);
  yield takeLatest('receipt/add', create);
  yield takeLatest('receipt/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('receipt/update', updateRecord);
  yield takeLatest('receipt/updateStatus', updateStatus);
  yield takeLatest('receipt/delete', deleteRecord);
}
