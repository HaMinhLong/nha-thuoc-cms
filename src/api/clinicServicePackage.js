import axios from 'axios';
import { stringify } from 'qs';
const getListClinicServicePackage = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/clinicServicePackage?${stringify(params)}`
  );
const getOneClinicServicePackage = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/clinicServicePackage/${id}`);
const createClinicServicePackage = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/clinicServicePackage`, params);
const updateClinicServicePackage = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/clinicServicePackage/${id}`,
    params
  );
const updateStatusClinicServicePackage = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/clinicServicePackage/updateStatus/${id}`,
    params
  );
const deleteClinicServicePackage = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/clinicServicePackage/${id}`);

export {
  getListClinicServicePackage,
  getOneClinicServicePackage,
  createClinicServicePackage,
  updateClinicServicePackage,
  updateStatusClinicServicePackage,
  deleteClinicServicePackage,
};
