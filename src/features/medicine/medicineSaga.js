import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './medicineSlice';
import {
  getListMedicine,
  getOneMedicine,
  createMedicine,
  updateMedicine,
  updateStatusMedicine,
  deleteMedicine,
} from '../../api/medicine';

function* getList({ payload, callback }) {
  const { data } = yield call(getListMedicine, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListMedicine, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneMedicine, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createMedicine, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateMedicine, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusMedicine, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteMedicine, id);
  if (callback) callback(data);
}

export function* medicineSaga() {
  yield takeLatest('medicine/fetch', getList);
  yield takeLatest('medicine/getOne', getOne);
  yield takeLatest('medicine/add', create);
  yield takeLatest('medicine/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('medicine/update', updateRecord);
  yield takeLatest('medicine/updateStatus', updateStatus);
  yield takeLatest('medicine/delete', deleteRecord);
}
