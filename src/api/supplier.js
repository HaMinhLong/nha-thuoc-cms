import axios from 'axios';
import { stringify } from 'qs';

const getListSupplier = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/supplier?${stringify(params)}`);
const getOneSupplier = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/supplier/${id}`);
const createSupplier = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/supplier`, params);
const updateSupplier = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/supplier/${id}`, params);
const updateStatusSupplier = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/supplier/updateStatus/${id}`,
    params
  );
const deleteSupplier = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/supplier/${id}`);

export {
  getListSupplier,
  getOneSupplier,
  createSupplier,
  updateSupplier,
  updateStatusSupplier,
  deleteSupplier,
};
