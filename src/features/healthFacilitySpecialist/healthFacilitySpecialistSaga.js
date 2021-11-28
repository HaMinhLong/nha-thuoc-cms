import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './healthFacilitySpecialistSlice';
import {
  getListHealthFacilitySpecialist,
  getOneHealthFacilitySpecialist,
  createHealthFacilitySpecialist,
  bulkCreateHealthFacilitySpecialist,
  updateHealthFacilitySpecialist,
  deleteHealthFacilitySpecialist,
} from '../../api/healthFacilitySpecialist';

function* getList({ payload, callback }) {
  const { data } = yield call(getListHealthFacilitySpecialist, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListHealthFacilitySpecialist, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneHealthFacilitySpecialist, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createHealthFacilitySpecialist, payload);
  if (callback) callback(data);
}
function* bulkCreate({ payload, callback }) {
  const { data } = yield call(bulkCreateHealthFacilitySpecialist, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateHealthFacilitySpecialist, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteHealthFacilitySpecialist, id);
  if (callback) callback(data);
}

export function* healthFacilitySpecialistSaga() {
  yield takeLatest('healthFacilitySpecialist/fetch', getList);
  yield takeLatest('healthFacilitySpecialist/getOne', getOne);
  yield takeLatest('healthFacilitySpecialist/add', create);
  yield takeLatest('healthFacilitySpecialist/bulkCreate', bulkCreate);
  yield takeLatest(
    'healthFacilitySpecialist/fetchLazyLoading',
    fetchLazyLoading
  );
  yield takeLatest('healthFacilitySpecialist/update', updateRecord);
  yield takeLatest('healthFacilitySpecialist/delete', deleteRecord);
}
