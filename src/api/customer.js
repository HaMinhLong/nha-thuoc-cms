import axios from 'axios';
import { stringify } from 'qs';

const getListCustomer = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/customer?${stringify(params)}`);
const getOneCustomer = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/customer/${id}`);
const createCustomer = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/customer`, params);
const updateCustomer = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/customer/${id}`, params);
const updateStatusCustomer = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/customer/updateStatus/${id}`,
    params
  );
const deleteCustomer = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/customer/${id}`);

export {
  getListCustomer,
  getOneCustomer,
  createCustomer,
  updateCustomer,
  updateStatusCustomer,
  deleteCustomer,
};
