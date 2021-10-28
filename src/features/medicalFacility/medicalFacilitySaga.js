import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './medicalFacilitySlice';
import {
  getListMedicalFacility,
  getOneMedicalFacility,
  createMedicalFacility,
  updateMedicalFacility,
  updateStatusMedicalFacility,
  deleteMedicalFacility,
} from '../../api/medicalFacility';

function* getList({ payload, callback }) {
  const { data } = yield call(getListMedicalFacility, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListMedicalFacility, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneMedicalFacility, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createMedicalFacility, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateMedicalFacility, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusMedicalFacility, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteMedicalFacility, id);
  if (callback) callback(data);
}

export function* medicalFacilitySaga() {
  yield takeLatest('medicalFacility/fetch', getList);
  yield takeLatest('medicalFacility/getOne', getOne);
  yield takeLatest('medicalFacility/add', create);
  yield takeLatest('medicalFacility/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('medicalFacility/update', updateRecord);
  yield takeLatest('medicalFacility/updateStatus', updateStatus);
  yield takeLatest('medicalFacility/delete', deleteRecord);
}
