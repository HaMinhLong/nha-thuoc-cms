import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './apothecarySlice';
import {
  getListApothecary,
  getOneApothecary,
  createApothecary,
  updateApothecary,
  updateStatusApothecary,
  deleteApothecary,
} from '../../api/apothecary';

function* getList({ payload, callback }) {
  const { data } = yield call(getListApothecary, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListApothecary, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneApothecary, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createApothecary, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateApothecary, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusApothecary, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteApothecary, id);
  if (callback) callback(data);
}

export function* apothecarySaga() {
  yield takeLatest('apothecary/fetch', getList);
  yield takeLatest('apothecary/getOne', getOne);
  yield takeLatest('apothecary/add', create);
  yield takeLatest('apothecary/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('apothecary/update', updateRecord);
  yield takeLatest('apothecary/updateStatus', updateStatus);
  yield takeLatest('apothecary/delete', deleteRecord);
}
