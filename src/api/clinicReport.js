import axios from 'axios';
import { stringify } from 'qs';
const getListDoctorReport = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/doctorReport?${stringify(params)}`
  );

export { getListDoctorReport };
