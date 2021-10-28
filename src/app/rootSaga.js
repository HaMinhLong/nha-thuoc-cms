import { all } from 'redux-saga/effects';
import { userGroupSaga } from '../features/userGroup/userGroupSaga';
import { userSaga } from '../features/user/userSaga';
import { menuSaga } from '../features/menu/menuSaga';
import { configSaga } from '../features/config/configSaga';
import { userGroupRoleSaga } from '../features/userGroupRole/userGroupRoleSaga';
import { authSaga } from '../features/auth/authSaga';
import { provinceSaga } from '../features/province/provinceSaga';
import { districtSaga } from '../features/district/districtSaga';
import { wardSaga } from '../features/ward/wardSaga';
import { paymentMethodSaga } from '../features/paymentMethod/paymentMethodSaga';

export default function* rootSaga() {
  yield all([
    userGroupSaga(),
    userSaga(),
    menuSaga(),
    configSaga(),
    userGroupRoleSaga(),
    authSaga(),
    provinceSaga(),
    districtSaga(),
    wardSaga(),
    paymentMethodSaga(),
  ]);
}
