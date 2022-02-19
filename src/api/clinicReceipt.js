import axios from 'axios';
import { stringify } from 'qs';
const getListClinicReceipt = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/clinicReceipt?${stringify(params)}`
  );
const getOneClinicReceipt = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/clinicReceipt/${id}`);
const createClinicReceipt = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/clinicReceipt`, params);
const updateClinicReceipt = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/clinicReceipt/${id}`, params);
const updateStatusClinicReceipt = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/clinicReceipt/updateStatus/${id}`,
    params
  );
const deleteClinicReceipt = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/clinicReceipt/${id}`);

export {
  getListClinicReceipt,
  getOneClinicReceipt,
  createClinicReceipt,
  updateClinicReceipt,
  updateStatusClinicReceipt,
  deleteClinicReceipt,
};
