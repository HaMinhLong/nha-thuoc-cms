import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './packagesSlice';
import {
  getListPackage,
  getOnePackage,
  createPackage,
  updatePackage,
  updateStatusPackage,
  deletePackage,
} from '../../api/packages';

function* getList({ payload, callback }) {
  const { data } = yield call(getListPackage, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListPackage, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOnePackage, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createPackage, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updatePackage, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusPackage, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deletePackage, id);
  if (callback) callback(data);
}

export function* packagesSaga() {
  yield takeLatest('package/fetch', getList);
  yield takeLatest('package/getOne', getOne);
  yield takeLatest('package/add', create);
  yield takeLatest('package/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('package/update', updateRecord);
  yield takeLatest('package/updateStatus', updateStatus);
  yield takeLatest('package/delete', deleteRecord);
}
