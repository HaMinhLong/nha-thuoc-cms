import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './medicineUnitSlice';
import {
  getListMedicineUnit,
  getOneMedicineUnit,
  createMedicineUnit,
  updateMedicineUnit,
  deleteMedicineUnit,
} from '../../api/medicineUnit';

function* getList({ payload, callback }) {
  const { data } = yield call(getListMedicineUnit, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListMedicineUnit, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneMedicineUnit, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createMedicineUnit, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateMedicineUnit, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteMedicineUnit, id);
  if (callback) callback(data);
}

export function* medicineUnitSaga() {
  yield takeLatest('medicineUnit/fetch', getList);
  yield takeLatest('medicineUnit/getOne', getOne);
  yield takeLatest('medicineUnit/add', create);
  yield takeLatest('medicineUnit/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('medicineUnit/update', updateRecord);
  yield takeLatest('medicineUnit/delete', deleteRecord);
}
