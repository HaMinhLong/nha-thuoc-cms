import axios from 'axios';
import { stringify } from 'qs';

const getListMedicalFacilityGroup = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/medicalFacilityGroup?${stringify(params)}`
  );
const getOneMedicalFacilityGroup = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/medicalFacilityGroup/${id}`);
const createMedicalFacilityGroup = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/medicalFacilityGroup`, params);
const updateMedicalFacilityGroup = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/medicalFacilityGroup/${id}`,
    params
  );
const updateStatusMedicalFacilityGroup = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/medicalFacilityGroup/updateStatus/${id}`,
    params
  );
const deleteMedicalFacilityGroup = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/medicalFacilityGroup/${id}`);

export {
  getListMedicalFacilityGroup,
  getOneMedicalFacilityGroup,
  createMedicalFacilityGroup,
  updateMedicalFacilityGroup,
  updateStatusMedicalFacilityGroup,
  deleteMedicalFacilityGroup,
};
