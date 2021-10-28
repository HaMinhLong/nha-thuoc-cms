import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './districtSlice';
import {
  getListDistrict,
  getOneDistrict,
  createDistrict,
  updateDistrict,
  updateStatusDistrict,
  deleteDistrict,
} from '../../api/district';

function* getList({ payload, callback }) {
  const { data } = yield call(getListDistrict, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListDistrict, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneDistrict, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createDistrict, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateDistrict, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusDistrict, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteDistrict, id);
  if (callback) callback(data);
}

export function* districtSaga() {
  yield takeLatest('district/fetch', getList);
  yield takeLatest('district/getOne', getOne);
  yield takeLatest('district/add', create);
  yield takeLatest('district/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('district/update', updateRecord);
  yield takeLatest('district/updateStatus', updateStatus);
  yield takeLatest('district/delete', deleteRecord);
}
