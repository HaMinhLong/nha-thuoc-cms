import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './medicalFacilityGroupSlice';
import {
  getListMedicalFacilityGroup,
  getOneMedicalFacilityGroup,
  createMedicalFacilityGroup,
  updateMedicalFacilityGroup,
  updateStatusMedicalFacilityGroup,
  deleteMedicalFacilityGroup,
} from '../../api/medicalFacilityGroup';

function* getList({ payload, callback }) {
  const { data } = yield call(getListMedicalFacilityGroup, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListMedicalFacilityGroup, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneMedicalFacilityGroup, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createMedicalFacilityGroup, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateMedicalFacilityGroup, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusMedicalFacilityGroup, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteMedicalFacilityGroup, id);
  if (callback) callback(data);
}

export function* medicalFacilityGroupSaga() {
  yield takeLatest('medicalFacilityGroup/fetch', getList);
  yield takeLatest('medicalFacilityGroup/getOne', getOne);
  yield takeLatest('medicalFacilityGroup/add', create);
  yield takeLatest('medicalFacilityGroup/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('medicalFacilityGroup/update', updateRecord);
  yield takeLatest('medicalFacilityGroup/updateStatus', updateStatus);
  yield takeLatest('medicalFacilityGroup/delete', deleteRecord);
}
