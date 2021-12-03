import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './printFormSlice';
import {
  getListPrintForm,
  getOnePrintForm,
  createPrintForm,
  updatePrintForm,
  updateStatusPrintForm,
  deletePrintForm,
} from '../../api/printForm';

function* getList({ payload, callback }) {
  const { data } = yield call(getListPrintForm, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListPrintForm, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOnePrintForm, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createPrintForm, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updatePrintForm, id, params);
  if (callback) callback(data);
}
function* updateStatus({ payload: { id, params }, callback }) {
  const { data } = yield call(updateStatusPrintForm, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deletePrintForm, id);
  if (callback) callback(data);
}

export function* printFormSaga() {
  yield takeLatest('printForm/fetch', getList);
  yield takeLatest('printForm/getOne', getOne);
  yield takeLatest('printForm/add', create);
  yield takeLatest('printForm/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('printForm/update', updateRecord);
  yield takeLatest('printForm/updateStatus', updateStatus);
  yield takeLatest('printForm/delete', deleteRecord);
}
