import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './provinceSlice';
import {
  getListProvince,
  getOneProvince,
  createProvince,
  updateProvince,
  updateStatusProvince,
  deleteProvince,
} from '../../api/province';

function* getList({ payload, callback }) {
  const { data } = yield call(getListProvince, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListProvince, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneProvince, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createProvince, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateProvince, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusProvince, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteProvince, id);
  if (callback) callback(data);
}

export function* provinceSaga() {
  yield takeLatest('province/fetch', getList);
  yield takeLatest('province/getOne', getOne);
  yield takeLatest('province/add', create);
  yield takeLatest('province/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('province/update', updateRecord);
  yield takeLatest('province/updateStatus', updateStatus);
  yield takeLatest('province/delete', deleteRecord);
}
