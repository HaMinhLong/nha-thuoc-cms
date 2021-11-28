import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './supplierSlice';
import {
  getListSupplier,
  getOneSupplier,
  createSupplier,
  updateSupplier,
  updateStatusSupplier,
  deleteSupplier,
} from '../../api/supplier';

function* getList({ payload, callback }) {
  const { data } = yield call(getListSupplier, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListSupplier, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneSupplier, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createSupplier, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateSupplier, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusSupplier, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteSupplier, id);
  if (callback) callback(data);
}

export function* supplierSaga() {
  yield takeLatest('supplier/fetch', getList);
  yield takeLatest('supplier/getOne', getOne);
  yield takeLatest('supplier/add', create);
  yield takeLatest('supplier/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('supplier/update', updateRecord);
  yield takeLatest('supplier/updateStatus', updateStatus);
  yield takeLatest('supplier/delete', deleteRecord);
}
