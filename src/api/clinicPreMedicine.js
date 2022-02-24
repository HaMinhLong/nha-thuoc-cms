import axios from 'axios';
import { stringify } from 'qs';
const getListClinicPreMedicine = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/clinicPreMedicine?${stringify(params)}`
  );
const getOneClinicPreMedicine = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/clinicPreMedicine/${id}`);
const createClinicPreMedicine = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/clinicPreMedicine`, params);
const updateClinicPreMedicine = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/clinicPreMedicine/${id}`, params);
const deleteClinicPreMedicine = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/clinicPreMedicine/${id}`);

export {
  getListClinicPreMedicine,
  getOneClinicPreMedicine,
  createClinicPreMedicine,
  updateClinicPreMedicine,
  deleteClinicPreMedicine,
};
