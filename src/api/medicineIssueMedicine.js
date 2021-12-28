import axios from 'axios';
import { stringify } from 'qs';
const getListMedicineIssueMedicine = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/medicineIssueMedicine?${stringify(params)}`
  );
const getOneMedicineIssueMedicine = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/medicineIssueMedicine/${id}`);
const createMedicineIssueMedicine = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/medicineIssueMedicine`, params);
const updateMedicineIssueMedicine = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/medicineIssueMedicine/${id}`,
    params
  );
const deleteMedicineIssueMedicine = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/medicineIssueMedicine/${id}`);

export {
  getListMedicineIssueMedicine,
  getOneMedicineIssueMedicine,
  createMedicineIssueMedicine,
  updateMedicineIssueMedicine,
  deleteMedicineIssueMedicine,
};
