import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './placeSlice';
import {
  getListPlace,
  getOnePlace,
  createPlace,
  updatePlace,
  updateStatusPlace,
  deletePlace,
} from '../../api/place';

function* getList({ payload, callback }) {
  const { data } = yield call(getListPlace, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListPlace, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOnePlace, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createPlace, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updatePlace, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusPlace, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deletePlace, id);
  if (callback) callback(data);
}

export function* placeSaga() {
  yield takeLatest('place/fetch', getList);
  yield takeLatest('place/getOne', getOne);
  yield takeLatest('place/add', create);
  yield takeLatest('place/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('place/update', updateRecord);
  yield takeLatest('place/updateStatus', updateStatus);
  yield takeLatest('place/delete', deleteRecord);
}
