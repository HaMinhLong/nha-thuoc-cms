import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './specialistSlice';
import {
  getListSpecialist,
  getOneSpecialist,
  createSpecialist,
  updateSpecialist,
  updateStatusSpecialist,
  deleteSpecialist,
} from '../../api/specialist';

function* getList({ payload, callback }) {
  const { data } = yield call(getListSpecialist, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListSpecialist, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneSpecialist, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createSpecialist, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateSpecialist, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusSpecialist, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteSpecialist, id);
  if (callback) callback(data);
}

export function* specialistSaga() {
  yield takeLatest('specialist/fetch', getList);
  yield takeLatest('specialist/getOne', getOne);
  yield takeLatest('specialist/add', create);
  yield takeLatest('specialist/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('specialist/update', updateRecord);
  yield takeLatest('specialist/updateStatus', updateStatus);
  yield takeLatest('specialist/delete', deleteRecord);
}
