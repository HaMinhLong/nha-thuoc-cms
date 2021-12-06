import axios from 'axios';
import { stringify } from 'qs';

const getListWorkSchedule = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/workSchedule?${stringify(params)}`
  );
const updateWorkSchedule = (params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/workSchedule/update`, params);

export { getListWorkSchedule, updateWorkSchedule };
