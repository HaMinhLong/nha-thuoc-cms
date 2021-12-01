import axios from 'axios';
import { stringify } from 'qs';

const getListMedicineType = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/medicineType?${stringify(params)}`
  );
const getOneMedicineType = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/medicineType/${id}`);
const createMedicineType = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/medicineType`, params);
const updateMedicineType = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/medicineType/${id}`, params);
const updateStatusMedicineType = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/medicineType/updateStatus/${id}`,
    params
  );
const deleteMedicineType = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/medicineType/${id}`);

export {
  getListMedicineType,
  getOneMedicineType,
  createMedicineType,
  updateMedicineType,
  updateStatusMedicineType,
  deleteMedicineType,
};
