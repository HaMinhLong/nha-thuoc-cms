import axios from 'axios';
import { stringify } from 'qs';
const getListClinicType = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/clinicType?${stringify(params)}`);
export { getListClinicType };
