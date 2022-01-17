import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './medicalRegisterSlice';
import {
  getListMedicalRegister,
  getOneMedicalRegister,
  createMedicalRegister,
  updateMedicalRegister,
  updateStatusMedicalRegister,
  deleteMedicalRegister,
} from '../../api/medicalRegister';

function* getList({ payload, callback }) {
  const { data } = yield call(getListMedicalRegister, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListMedicalRegister, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneMedicalRegister, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createMedicalRegister, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateMedicalRegister, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusMedicalRegister, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteMedicalRegister, id);
  if (callback) callback(data);
}

export function* medicalRegisterSaga() {
  yield takeLatest('medicalRegister/fetch', getList);
  yield takeLatest('medicalRegister/getOne', getOne);
  yield takeLatest('medicalRegister/add', create);
  yield takeLatest('medicalRegister/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('medicalRegister/update', updateRecord);
  yield takeLatest('medicalRegister/updateStatus', updateStatus);
  yield takeLatest('medicalRegister/delete', deleteRecord);
}
