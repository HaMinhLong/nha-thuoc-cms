import axios from 'axios';
import { stringify } from 'qs';

const getListMedicalFacility = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/medicalFacility?${stringify(params)}`
  );
const getOneMedicalFacility = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/medicalFacility/${id}`);
const createMedicalFacility = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/medicalFacility`, params);
const updateMedicalFacility = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/medicalFacility/${id}`, params);
const updateStatusMedicalFacility = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/medicalFacility/updateStatus/${id}`,
    params
  );
const deleteMedicalFacility = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/medicalFacility/${id}`);

export {
  getListMedicalFacility,
  getOneMedicalFacility,
  createMedicalFacility,
  updateMedicalFacility,
  updateStatusMedicalFacility,
  deleteMedicalFacility,
};
