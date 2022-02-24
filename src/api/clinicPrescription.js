import axios from 'axios';
import { stringify } from 'qs';
const getListClinicPrescription = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/clinicPrescription?${stringify(params)}`
  );
const getOneClinicPrescription = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/clinicPrescription/${id}`);
const createClinicPrescription = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/clinicPrescription`, params);
const updateClinicPrescription = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/clinicPrescription/${id}`, params);
const deleteClinicPrescription = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/clinicPrescription/${id}`);

export {
  getListClinicPrescription,
  getOneClinicPrescription,
  createClinicPrescription,
  updateClinicPrescription,
  deleteClinicPrescription,
};
