import axios from 'axios';
import { stringify } from 'qs';

const getListMedicineTransfer = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/medicineTransfer?${stringify(params)}`
  );
const getOneMedicineTransfer = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/medicineTransfer/${id}`);
const createMedicineTransfer = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/medicineTransfer`, params);
const updateMedicineTransfer = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/medicineTransfer/${id}`, params);
const updateStatusMedicineTransfer = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/medicineTransfer/updateStatus/${id}`,
    params
  );
const deleteMedicineTransfer = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/medicineTransfer/${id}`);

export {
  getListMedicineTransfer,
  getOneMedicineTransfer,
  createMedicineTransfer,
  updateMedicineTransfer,
  updateStatusMedicineTransfer,
  deleteMedicineTransfer,
};
