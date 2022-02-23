import axios from 'axios';
import { stringify } from 'qs';
const getListClinicResult = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/clinicResult?${stringify(params)}`
  );
const getOneClinicResult = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/clinicResult/${id}`);
const createClinicResult = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/clinicResult`, params);
const updateClinicResult = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/clinicResult/${id}`, params);
const deleteClinicResult = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/clinicResult/${id}`);

export {
  getListClinicResult,
  getOneClinicResult,
  createClinicResult,
  updateClinicResult,
  deleteClinicResult,
};
