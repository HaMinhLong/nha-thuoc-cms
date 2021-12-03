import axios from 'axios';
import { stringify } from 'qs';

const getListMedicineUnit = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/medicineUnit?${stringify(params)}`
  );
const getOneMedicineUnit = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/medicineUnit/${id}`);
const createMedicineUnit = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/medicineUnit`, params);
const updateMedicineUnit = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/medicineUnit/${id}`, params);
const deleteMedicineUnit = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/medicineUnit/${id}`);

export {
  getListMedicineUnit,
  getOneMedicineUnit,
  createMedicineUnit,
  updateMedicineUnit,
  deleteMedicineUnit,
};
