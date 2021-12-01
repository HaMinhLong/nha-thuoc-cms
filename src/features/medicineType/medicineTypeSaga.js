import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './medicineTypeSlice';
import {
  getListMedicineType,
  getOneMedicineType,
  createMedicineType,
  updateMedicineType,
  updateStatusMedicineType,
  deleteMedicineType,
} from '../../api/medicineType';

function* getList({ payload, callback }) {
  const { data } = yield call(getListMedicineType, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListMedicineType, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneMedicineType, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createMedicineType, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateMedicineType, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusMedicineType, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteMedicineType, id);
  if (callback) callback(data);
}

export function* medicineTypeSaga() {
  yield takeLatest('medicineType/fetch', getList);
  yield takeLatest('medicineType/getOne', getOne);
  yield takeLatest('medicineType/add', create);
  yield takeLatest('medicineType/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('medicineType/update', updateRecord);
  yield takeLatest('medicineType/updateStatus', updateStatus);
  yield takeLatest('medicineType/delete', deleteRecord);
}
