import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './medicineTransferSlice';
import {
  getListMedicineTransfer,
  getOneMedicineTransfer,
  createMedicineTransfer,
  updateMedicineTransfer,
  updateStatusMedicineTransfer,
  deleteMedicineTransfer,
} from '../../api/medicineTransfer';

function* getList({ payload, callback }) {
  const { data } = yield call(getListMedicineTransfer, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListMedicineTransfer, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneMedicineTransfer, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createMedicineTransfer, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateMedicineTransfer, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusMedicineTransfer, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteMedicineTransfer, id);
  if (callback) callback(data);
}

export function* medicineTransferSaga() {
  yield takeLatest('medicineTransfer/fetch', getList);
  yield takeLatest('medicineTransfer/getOne', getOne);
  yield takeLatest('medicineTransfer/add', create);
  yield takeLatest('medicineTransfer/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('medicineTransfer/update', updateRecord);
  yield takeLatest('medicineTransfer/updateStatus', updateStatus);
  yield takeLatest('medicineTransfer/delete', deleteRecord);
}
