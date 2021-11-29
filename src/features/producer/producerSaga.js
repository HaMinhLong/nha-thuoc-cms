import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './producerSlice';
import {
  getListProducer,
  getOneProducer,
  createProducer,
  updateProducer,
  updateStatusProducer,
  deleteProducer,
} from '../../api/producer';

function* getList({ payload, callback }) {
  const { data } = yield call(getListProducer, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListProducer, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneProducer, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createProducer, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateProducer, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusProducer, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteProducer, id);
  if (callback) callback(data);
}

export function* producerSaga() {
  yield takeLatest('producer/fetch', getList);
  yield takeLatest('producer/getOne', getOne);
  yield takeLatest('producer/add', create);
  yield takeLatest('producer/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('producer/update', updateRecord);
  yield takeLatest('producer/updateStatus', updateStatus);
  yield takeLatest('producer/delete', deleteRecord);
}
