import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './clinicPrescriptionSlice';
import {
  getListClinicPrescription,
  getOneClinicPrescription,
  createClinicPrescription,
  updateClinicPrescription,
  deleteClinicPrescription,
} from '../../api/clinicPrescription';

function* getList({ payload, callback }) {
  const { data } = yield call(getListClinicPrescription, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListClinicPrescription, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneClinicPrescription, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createClinicPrescription, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateClinicPrescription, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteClinicPrescription, id);
  if (callback) callback(data);
}

export function* clinicPrescriptionSaga() {
  yield takeLatest('clinicPrescription/fetch', getList);
  yield takeLatest('clinicPrescription/getOne', getOne);
  yield takeLatest('clinicPrescription/add', create);
  yield takeLatest('clinicPrescription/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('clinicPrescription/update', updateRecord);
  yield takeLatest('clinicPrescription/delete', deleteRecord);
}
