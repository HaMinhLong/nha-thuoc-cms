import { put, call, takeLatest } from 'redux-saga/effects';
import { save, query } from './paperSizeTypeSlice';
import { getListPaperSizeType } from '../../api/paperSizeType';

function* getList({ payload, callback }) {
  const { data } = yield call(getListPaperSizeType, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListPaperSizeType, payload);
  if (callback) callback(data);
}

export function* paperSizeTypeSaga() {
  yield takeLatest('paperSizeType/fetch', getList);
  yield takeLatest('paperSizeType/fetchLazyLoading', fetchLazyLoading);
}
