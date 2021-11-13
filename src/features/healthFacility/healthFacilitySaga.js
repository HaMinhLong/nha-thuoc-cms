import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './healthFacilitySlice';
import {
  getListHealthFacility,
  getOneHealthFacility,
  createHealthFacility,
  updateHealthFacility,
  updateStatusHealthFacility,
  deleteHealthFacility,
} from '../../api/healthFacility';

function* getList({ payload, callback }) {
  const { data } = yield call(getListHealthFacility, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListHealthFacility, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneHealthFacility, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createHealthFacility, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateHealthFacility, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusHealthFacility, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteHealthFacility, id);
  if (callback) callback(data);
}

export function* healthFacilitySaga() {
  yield takeLatest('healthFacility/fetch', getList);
  yield takeLatest('healthFacility/getOne', getOne);
  yield takeLatest('healthFacility/add', create);
  yield takeLatest('healthFacility/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('healthFacility/update', updateRecord);
  yield takeLatest('healthFacility/updateStatus', updateStatus);
  yield takeLatest('healthFacility/delete', deleteRecord);
}
