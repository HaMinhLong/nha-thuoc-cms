import axios from 'axios';
import { stringify } from 'qs';

const getListMedicineIssue = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/medicineIssue?${stringify(params)}`
  );
const getOneMedicineIssue = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/medicineIssue/${id}`);
const createMedicineIssue = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/medicineIssue`, params);
const updateMedicineIssue = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/medicineIssue/${id}`, params);
const updateStatusMedicineIssue = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/medicineIssue/updateStatus/${id}`,
    params
  );
const deleteMedicineIssue = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/medicineIssue/${id}`);

export {
  getListMedicineIssue,
  getOneMedicineIssue,
  createMedicineIssue,
  updateMedicineIssue,
  updateStatusMedicineIssue,
  deleteMedicineIssue,
};
