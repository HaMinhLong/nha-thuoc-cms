import { put, call, takeLatest } from 'redux-saga/effects';
import { save, info, query } from './healthFacilityUserSlice';
import {
  getListHealthFacilityUser,
  getOneHealthFacilityUser,
  createHealthFacilityUser,
  bulkCreateHealthFacilityUser,
  updateHealthFacilityUser,
  deleteHealthFacilityUser,
} from '../../api/healthFacilityUser';

function* getList({ payload, callback }) {
  const { data } = yield call(getListHealthFacilityUser, payload);

  if (data && data.success) {
    yield put(save(data.results || {}));
  }
  yield put(query(payload));
  if (callback) callback(data);
}
function* fetchLazyLoading({ payload, callback }) {
  const { data } = yield call(getListHealthFacilityUser, payload);
  if (callback) callback(data);
}
function* getOne({ payload: { id }, callback }) {
  const { data } = yield call(getOneHealthFacilityUser, id);
  if (data) {
    yield put(info(data.results.list || {}));
  }
  if (callback) callback(data);
}
function* create({ payload, callback }) {
  const { data } = yield call(createHealthFacilityUser, payload);
  if (callback) callback(data);
}
function* bulkCreate({ payload, callback }) {
  const { data } = yield call(bulkCreateHealthFacilityUser, payload);
  if (callback) callback(data);
}
function* updateRecord({ payload: { id, params }, callback }) {
  const { data } = yield call(updateHealthFacilityUser, id, params);
  if (callback) callback(data);
}
function* deleteRecord({ payload: { id }, callback }) {
  const { data } = yield call(deleteHealthFacilityUser, id);
  if (callback) callback(data);
}

export function* healthFacilityUserSaga() {
  yield takeLatest('healthFacilityUser/fetch', getList);
  yield takeLatest('healthFacilityUser/getOne', getOne);
  yield takeLatest('healthFacilityUser/add', create);
  yield takeLatest('healthFacilityUser/bulkCreate', bulkCreate);
  yield takeLatest('healthFacilityUser/fetchLazyLoading', fetchLazyLoading);
  yield takeLatest('healthFacilityUser/update', updateRecord);
  yield takeLatest('healthFacilityUser/delete', deleteRecord);
}
