import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './supplierGroupSlice';
import {
  getListSupplierGroup,
  getOneSupplierGroup,
  createSupplierGroup,
  updateSupplierGroup,
  updateStatusSupplierGroup,
  deleteSupplierGroup,
} from '../../api/supplierGroup';

function* getList({ payload, callback }) {
  const { data } = yield call(getListSupplierGroup, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListSupplierGroup, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneSupplierGroup, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createSupplierGroup, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateSupplierGroup, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusSupplierGroup, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteSupplierGroup, id);
  if (callback) callback(data);
}

export function* supplierGroupSaga() {
  yield takeLatest('supplierGroup/fetch', getList);
  yield takeLatest('supplierGroup/getOne', getOne);
  yield takeLatest('supplierGroup/add', create);
  yield takeLatest('supplierGroup/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('supplierGroup/update', updateRecord);
  yield takeLatest('supplierGroup/updateStatus', updateStatus);
  yield takeLatest('supplierGroup/delete', deleteRecord);
}
