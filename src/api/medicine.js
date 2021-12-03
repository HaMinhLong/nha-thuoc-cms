import axios from 'axios';
import { stringify } from 'qs';

const getListMedicine = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/medicine?${stringify(params)}`);
const getOneMedicine = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/medicine/${id}`);
const createMedicine = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/medicine`, params);
const updateMedicine = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/medicine/${id}`, params);
const updateStatusMedicine = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/medicine/updateStatus/${id}`,
    params
  );
const deleteMedicine = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/medicine/${id}`);

export {
  getListMedicine,
  getOneMedicine,
  createMedicine,
  updateMedicine,
  updateStatusMedicine,
  deleteMedicine,
};
