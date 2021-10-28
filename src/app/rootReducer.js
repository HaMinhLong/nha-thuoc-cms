import userGroupReducer from '../features/userGroup/userGroupSlice';
import userReducer from '../features/user/userSlice';
import menuReducer from '../features/menu/menuSlice';
import configReducer from '../features/config/configSlice';
import userGroupRoleReducer from '../features/userGroupRole/userGroupRoleSlice';
import authReducer from '../features/auth/authSlice';
import provinceReducer from '../features/province/provinceSlice';
import districtReducer from '../features/district/districtSlice';
import wardReducer from '../features/ward/wardSlice';
import paymentMethodReducer from '../features/paymentMethod/paymentMethodSlice';
import medicalFacilityGroupReducer from '../features/medicalFacilityGroup/medicalFacilityGroupSlice';
import specialistReducer from '../features/specialist/specialistSlice';

export const rootReducer = {
  userGroup: userGroupReducer,
  user: userReducer,
  menu: menuReducer,
  config: configReducer,
  userGroupRole: userGroupRoleReducer,
  auth: authReducer,
  province: provinceReducer,
  district: districtReducer,
  ward: wardReducer,
  paymentMethod: paymentMethodReducer,
  medicalFacilityGroup: medicalFacilityGroupReducer,
  specialist: specialistReducer,
};
