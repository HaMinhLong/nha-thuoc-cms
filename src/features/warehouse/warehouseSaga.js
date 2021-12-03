import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './warehouseSlice';
import {
  getListWarehouse,
  getOneWarehouse,
  createWarehouse,
  updateWarehouse,
  updateStatusWarehouse,
  deleteWarehouse,
} from '../../api/warehouse';

function* getList({ payload, callback }) {
  const { data } = yield call(getListWarehouse, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListWarehouse, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneWarehouse, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createWarehouse, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateWarehouse, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusWarehouse, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteWarehouse, id);
  if (callback) callback(data);
}

export function* warehouseSaga() {
  yield takeLatest('warehouse/fetch', getList);
  yield takeLatest('warehouse/getOne', getOne);
  yield takeLatest('warehouse/add', create);
  yield takeLatest('warehouse/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('warehouse/update', updateRecord);
  yield takeLatest('warehouse/updateStatus', updateStatus);
  yield takeLatest('warehouse/delete', deleteRecord);
}
