import { put, call, takeLatest } from 'redux-saga/effects';
import { save, query } from './workScheduleSlice';
import {
  getListWorkSchedule,
  updateWorkSchedule,
} from '../../api/workSchedule';

function* getList({ payload, callback }) {
  const { data } = yield call(getListWorkSchedule, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListWorkSchedule, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { params }, callback }) {
  const { data } = yield call(updateWorkSchedule, params);
  if (callback) callback(data);
}

export function* workScheduleSaga() {
  yield takeLatest('workSchedule/fetch', getList);
  yield takeLatest('workSchedule/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('workSchedule/update', updateRecord);
}
