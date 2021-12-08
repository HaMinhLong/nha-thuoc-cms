import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './clinicServiceSlice';
import {
  getListClinicService,
  getOneClinicService,
  createClinicService,
  updateClinicService,
  updateStatusClinicService,
  deleteClinicService,
} from '../../api/clinicService';

function* getList({ payload, callback }) {
  const { data } = yield call(getListClinicService, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListClinicService, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneClinicService, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createClinicService, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateClinicService, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusClinicService, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteClinicService, id);
  if (callback) callback(data);
}

export function* clinicServiceSaga() {
  yield takeLatest('clinicService/fetch', getList);
  yield takeLatest('clinicService/getOne', getOne);
  yield takeLatest('clinicService/add', create);
  yield takeLatest('clinicService/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('clinicService/update', updateRecord);
  yield takeLatest('clinicService/updateStatus', updateStatus);
  yield takeLatest('clinicService/delete', deleteRecord);
}
