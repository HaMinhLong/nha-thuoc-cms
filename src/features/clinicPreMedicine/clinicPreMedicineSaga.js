import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './clinicPreMedicineSlice';
import {
  getListClinicPreMedicine,
  getOneClinicPreMedicine,
  createClinicPreMedicine,
  updateClinicPreMedicine,
  deleteClinicPreMedicine,
} from '../../api/clinicPreMedicine';

function* getList({ payload, callback }) {
  const { data } = yield call(getListClinicPreMedicine, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListClinicPreMedicine, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneClinicPreMedicine, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createClinicPreMedicine, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateClinicPreMedicine, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteClinicPreMedicine, id);
  if (callback) callback(data);
}

export function* clinicPreMedicineSaga() {
  yield takeLatest('clinicPreMedicine/fetch', getList);
  yield takeLatest('clinicPreMedicine/getOne', getOne);
  yield takeLatest('clinicPreMedicine/add', create);
  yield takeLatest('clinicPreMedicine/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('clinicPreMedicine/update', updateRecord);
  yield takeLatest('clinicPreMedicine/delete', deleteRecord);
}
