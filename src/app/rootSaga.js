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
import { medicalFacilityGroupSaga } from '../features/medicalFacilityGroup/medicalFacilityGroupSaga';
import { specialistSaga } from '../features/specialist/specialistSaga';
import { medicalFacilitySaga } from '../features/medicalFacility/medicalFacilitySaga';
import { placeSaga } from '../features/place/placeSaga';
import { healthFacilitySaga } from '../features/healthFacility/healthFacilitySaga';
import { healthFacilitySpecialistSaga } from '../features/healthFacilitySpecialist/healthFacilitySpecialistSaga';
import { healthFacilityUserSaga } from '../features/healthFacilityUser/healthFacilityUserSaga';
import { supplierGroupSaga } from '../features/supplierGroup/supplierGroupSaga';
import { supplierSaga } from '../features/supplier/supplierSaga';
import { producerGroupSaga } from '../features/producerGroup/producerGroupSaga';
import { producerSaga } from '../features/producer/producerSaga';
import { customerGroupSaga } from '../features/customerGroup/customerGroupSaga';
import { customerSaga } from '../features/customer/customerSaga';
import { medicineTypeSaga } from '../features/medicineType/medicineTypeSaga';
import { apothecarySaga } from '../features/apothecary/apothecarySaga';
import { packagesSaga } from '../features/packages/packagesSaga';
import { unitSaga } from '../features/unit/unitSaga';

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
    medicalFacilityGroupSaga(),
    specialistSaga(),
    medicalFacilitySaga(),
    placeSaga(),
    healthFacilitySaga(),
    healthFacilitySpecialistSaga(),
    healthFacilityUserSaga(),
    supplierGroupSaga(),
    supplierSaga(),
    producerGroupSaga(),
    producerSaga(),
    customerGroupSaga(),
    customerSaga(),
    medicineTypeSaga(),
    apothecarySaga(),
    packagesSaga(),
    unitSaga(),
  ]);
}
