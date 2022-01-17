import axios from 'axios';
import { stringify } from 'qs';
const getListMedicalRegister = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/medicalRegister?${stringify(params)}`
  );
const getOneMedicalRegister = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/medicalRegister/${id}`);
const createMedicalRegister = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/medicalRegister`, params);
const updateMedicalRegister = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/medicalRegister/${id}`, params);
const updateStatusMedicalRegister = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/medicalRegister/updateStatus/${id}`,
    params
  );
const deleteMedicalRegister = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/medicalRegister/${id}`);

export {
  getListMedicalRegister,
  getOneMedicalRegister,
  createMedicalRegister,
  updateMedicalRegister,
  updateStatusMedicalRegister,
  deleteMedicalRegister,
};
