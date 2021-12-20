import axios from 'axios';
import { stringify } from 'qs';
const getListReceipt = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/receipt?${stringify(params)}`);
const getOneReceipt = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/receipt/${id}`);
const createReceipt = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/receipt`, params);
const updateReceipt = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/receipt/${id}`, params);
const updateStatusReceipt = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/receipt/updateStatus/${id}`,
    params
  );
const deleteReceipt = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/receipt/${id}`);

export {
  getListReceipt,
  getOneReceipt,
  createReceipt,
  updateReceipt,
  updateStatusReceipt,
  deleteReceipt,
};
