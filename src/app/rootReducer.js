import userGroupReducer from '../features/userGroup/userGroupSlice';
import userReducer from '../features/user/userSlice';
import menuReducer from '../features/menu/menuSlice';
import configReducer from '../features/config/configSlice';
import userGroupRoleReducer from '../features/userGroupRole/userGroupRoleSlice';
import authReducer from '../features/auth/authSlice';
import provinceReducer from '../features/province/provinceSlice';

export const rootReducer = {
  userGroup: userGroupReducer,
  user: userReducer,
  menu: menuReducer,
  config: configReducer,
  userGroupRole: userGroupRoleReducer,
  auth: authReducer,
  province: provinceReducer,
};
