import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './consumableSlice';
import {
  getListConsumable,
  getOneConsumable,
  createConsumable,
  updateConsumable,
  updateStatusConsumable,
  deleteConsumable,
} from '../../api/consumable';

function* getList({ payload, callback }) {
  const { data } = yield call(getListConsumable, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListConsumable, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneConsumable, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createConsumable, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateConsumable, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusConsumable, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteConsumable, id);
  if (callback) callback(data);
}

export function* consumableSaga() {
  yield takeLatest('consumable/fetch', getList);
  yield takeLatest('consumable/getOne', getOne);
  yield takeLatest('consumable/add', create);
  yield takeLatest('consumable/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('consumable/update', updateRecord);
  yield takeLatest('consumable/updateStatus', updateStatus);
  yield takeLatest('consumable/delete', deleteRecord);
}
