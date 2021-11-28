import axios from 'axios';
import { stringify } from 'qs';

const getListSupplierGroup = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/supplierGroup?${stringify(params)}`
  );
const getOneSupplierGroup = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/supplierGroup/${id}`);
const createSupplierGroup = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/supplierGroup`, params);
const updateSupplierGroup = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/supplierGroup/${id}`, params);
const updateStatusSupplierGroup = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/supplierGroup/updateStatus/${id}`,
    params
  );
const deleteSupplierGroup = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/supplierGroup/${id}`);

export {
  getListSupplierGroup,
  getOneSupplierGroup,
  createSupplierGroup,
  updateSupplierGroup,
  updateStatusSupplierGroup,
  deleteSupplierGroup,
};
