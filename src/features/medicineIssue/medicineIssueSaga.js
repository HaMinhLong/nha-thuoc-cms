import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './medicineIssueSlice';
import {
  getListMedicineIssue,
  getOneMedicineIssue,
  createMedicineIssue,
  updateMedicineIssue,
  updateStatusMedicineIssue,
  deleteMedicineIssue,
} from '../../api/medicineIssue';

function* getList({ payload, callback }) {
  const { data } = yield call(getListMedicineIssue, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListMedicineIssue, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneMedicineIssue, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createMedicineIssue, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateMedicineIssue, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusMedicineIssue, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteMedicineIssue, id);
  if (callback) callback(data);
}

export function* medicineIssueSaga() {
  yield takeLatest('medicineIssue/fetch', getList);
  yield takeLatest('medicineIssue/getOne', getOne);
  yield takeLatest('medicineIssue/add', create);
  yield takeLatest('medicineIssue/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('medicineIssue/update', updateRecord);
  yield takeLatest('medicineIssue/updateStatus', updateStatus);
  yield takeLatest('medicineIssue/delete', deleteRecord);
}
