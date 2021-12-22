import { put, call, takeLatest } from 'redux-saga/effects';
import { save, query } from './warehouseUserSlice';
import {
  getListWarehouseUser,
  createWarehouseUser,
  deleteWarehouseUser,
} from '../../api/warehouseUser';

function* getList({ payload, callback }) {
  const { data } = yield call(getListWarehouseUser, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListWarehouseUser, payload);
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createWarehouseUser, payload);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteWarehouseUser, id);
  if (callback) callback(data);
}

export function* warehouseUserSaga() {
  yield takeLatest('warehouseUser/fetch', getList);
  yield takeLatest('warehouseUser/add', create);
  yield takeLatest('warehouseUser/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('warehouseUser/delete', deleteRecord);
}
