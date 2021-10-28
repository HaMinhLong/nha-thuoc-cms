import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './wardSlice';
import {
  getListWard,
  getOneWard,
  createWard,
  updateWard,
  updateStatusWard,
  deleteWard,
} from '../../api/ward';

function* getList({ payload, callback }) {
  const { data } = yield call(getListWard, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListWard, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneWard, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createWard, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateWard, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusWard, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteWard, id);
  if (callback) callback(data);
}

export function* wardSaga() {
  yield takeLatest('ward/fetch', getList);
  yield takeLatest('ward/getOne', getOne);
  yield takeLatest('ward/add', create);
  yield takeLatest('ward/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('ward/update', updateRecord);
  yield takeLatest('ward/updateStatus', updateStatus);
  yield takeLatest('ward/delete', deleteRecord);
}
