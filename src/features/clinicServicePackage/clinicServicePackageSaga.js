import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './clinicServicePackageSlice';
import {
  getListClinicServicePackage,
  getOneClinicServicePackage,
  createClinicServicePackage,
  updateClinicServicePackage,
  updateStatusClinicServicePackage,
  deleteClinicServicePackage,
} from '../../api/clinicServicePackage';

function* getList({ payload, callback }) {
  const { data } = yield call(getListClinicServicePackage, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListClinicServicePackage, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneClinicServicePackage, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createClinicServicePackage, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateClinicServicePackage, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusClinicServicePackage, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteClinicServicePackage, id);
  if (callback) callback(data);
}

export function* clinicServicePackageSaga() {
  yield takeLatest('clinicServicePackage/fetch', getList);
  yield takeLatest('clinicServicePackage/getOne', getOne);
  yield takeLatest('clinicServicePackage/add', create);
  yield takeLatest('clinicServicePackage/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('clinicServicePackage/update', updateRecord);
  yield takeLatest('clinicServicePackage/updateStatus', updateStatus);
  yield takeLatest('clinicServicePackage/delete', deleteRecord);
}
