import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './producerGroupSlice';
import {
  getListProducerGroup,
  getOneProducerGroup,
  createProducerGroup,
  updateProducerGroup,
  updateStatusProducerGroup,
  deleteProducerGroup,
} from '../../api/producerGroup';

function* getList({ payload, callback }) {
  const { data } = yield call(getListProducerGroup, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListProducerGroup, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneProducerGroup, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createProducerGroup, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateProducerGroup, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusProducerGroup, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteProducerGroup, id);
  if (callback) callback(data);
}

export function* producerGroupSaga() {
  yield takeLatest('producerGroup/fetch', getList);
  yield takeLatest('producerGroup/getOne', getOne);
  yield takeLatest('producerGroup/add', create);
  yield takeLatest('producerGroup/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('producerGroup/update', updateRecord);
  yield takeLatest('producerGroup/updateStatus', updateStatus);
  yield takeLatest('producerGroup/delete', deleteRecord);
}
