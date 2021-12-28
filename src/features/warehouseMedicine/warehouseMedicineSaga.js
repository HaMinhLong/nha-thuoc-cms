import { put, call, takeLatest } from 'redux-saga/effects';
import { save, query } from './warehouseMedicineSlice';
import { getListWarehouseMedicine } from '../../api/warehouseMedicine';

function* getList({ payload, callback }) {
  const { data } = yield call(getListWarehouseMedicine, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListWarehouseMedicine, payload);
  if (callback) callback(data);
}
export function* warehouseMedicineSaga() {
  yield takeLatest('warehouseMedicine/fetch', getList);
  yield takeLatest('warehouseMedicine/fetchLazyLoading', fetchLazyLoading);
}
