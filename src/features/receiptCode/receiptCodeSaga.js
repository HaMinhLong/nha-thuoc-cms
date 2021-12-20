import { put, call, takeLatest } from 'redux-saga/effects';
import { info } from './receiptCodeSlice';
import { getOneReceiptCode, updateReceiptCode } from '../../api/receiptCode';

function* getOne({ payload, callback }) {
  const { data } = yield call(getOneReceiptCode, payload);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* updateRecord({ payload: { id }, callback }) {
  const { data } = yield call(updateReceiptCode, id);
  if (callback) callback(data);
}
export function* receiptCodeSaga() {
  yield takeLatest('receiptCode/getOne', getOne);
  yield takeLatest('receiptCode/update', updateRecord);
}
