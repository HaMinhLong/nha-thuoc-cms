import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './unitSlice';
import {
  getListUnit,
  getOneUnit,
  createUnit,
  updateUnit,
  updateStatusUnit,
  deleteUnit,
} from '../../api/unit';

function* getList({ payload, callback }) {
  const { data } = yield call(getListUnit, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListUnit, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneUnit, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createUnit, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateUnit, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusUnit, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteUnit, id);
  if (callback) callback(data);
}

export function* unitSaga() {
  yield takeLatest('unit/fetch', getList);
  yield takeLatest('unit/getOne', getOne);
  yield takeLatest('unit/add', create);
  yield takeLatest('unit/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('unit/update', updateRecord);
  yield takeLatest('unit/updateStatus', updateStatus);
  yield takeLatest('unit/delete', deleteRecord);
}
