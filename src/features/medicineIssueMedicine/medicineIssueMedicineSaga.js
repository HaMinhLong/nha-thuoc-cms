import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './medicineIssueMedicineSlice';
import {
  getListMedicineIssueMedicine,
  getOneMedicineIssueMedicine,
  createMedicineIssueMedicine,
  updateMedicineIssueMedicine,
  deleteMedicineIssueMedicine,
} from '../../api/medicineIssueMedicine';

function* getList({ payload, callback }) {
  const { data } = yield call(getListMedicineIssueMedicine, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListMedicineIssueMedicine, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneMedicineIssueMedicine, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createMedicineIssueMedicine, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateMedicineIssueMedicine, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteMedicineIssueMedicine, id);
  if (callback) callback(data);
}

export function* medicineIssueMedicineSaga() {
  yield takeLatest('medicineIssueMedicine/fetch', getList);
  yield takeLatest('medicineIssueMedicine/getOne', getOne);
  yield takeLatest('medicineIssueMedicine/add', create);
  yield takeLatest('medicineIssueMedicine/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('medicineIssueMedicine/update', updateRecord);
  yield takeLatest('medicineIssueMedicine/delete', deleteRecord);
}
