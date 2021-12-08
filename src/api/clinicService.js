import axios from 'axios';
import { stringify } from 'qs';
const getListClinicService = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/clinicService?${stringify(params)}`
  );
const getOneClinicService = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/clinicService/${id}`);
const createClinicService = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/clinicService`, params);
const updateClinicService = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/clinicService/${id}`, params);
const updateStatusClinicService = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/clinicService/updateStatus/${id}`,
    params
  );
const deleteClinicService = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/clinicService/${id}`);

export {
  getListClinicService,
  getOneClinicService,
  createClinicService,
  updateClinicService,
  updateStatusClinicService,
  deleteClinicService,
};
