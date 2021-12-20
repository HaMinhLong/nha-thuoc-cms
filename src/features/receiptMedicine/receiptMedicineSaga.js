import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './receiptMedicineSlice';
import {
  getListReceiptMedicine,
  getOneReceiptMedicine,
  createReceiptMedicine,
  updateReceiptMedicine,
  deleteReceiptMedicine,
} from '../../api/receiptMedicine';

function* getList({ payload, callback }) {
  const { data } = yield call(getListReceiptMedicine, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListReceiptMedicine, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneReceiptMedicine, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createReceiptMedicine, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateReceiptMedicine, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteReceiptMedicine, id);
  if (callback) callback(data);
}

export function* receiptMedicineSaga() {
  yield takeLatest('receiptMedicine/fetch', getList);
  yield takeLatest('receiptMedicine/getOne', getOne);
  yield takeLatest('receiptMedicine/add', create);
  yield takeLatest('receiptMedicine/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('receiptMedicine/update', updateRecord);
  yield takeLatest('receiptMedicine/delete', deleteRecord);
}
