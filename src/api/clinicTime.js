import axios from 'axios';
import { stringify } from 'qs';
const getListClinicTime = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/clinicTime?${stringify(params)}`);
const updateStatusClinicTime = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/clinicTime/updateStatus/${id}`,
    params
  );

export { getListClinicTime, updateStatusClinicTime };
