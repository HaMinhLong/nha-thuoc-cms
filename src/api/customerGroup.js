import axios from 'axios';
import { stringify } from 'qs';

const getListCustomerGroup = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/customerGroup?${stringify(params)}`
  );
const getOneCustomerGroup = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/customerGroup/${id}`);
const createCustomerGroup = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/customerGroup`, params);
const updateCustomerGroup = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/customerGroup/${id}`, params);
const updateStatusCustomerGroup = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/customerGroup/updateStatus/${id}`,
    params
  );
const deleteCustomerGroup = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/customerGroup/${id}`);

export {
  getListCustomerGroup,
  getOneCustomerGroup,
  createCustomerGroup,
  updateCustomerGroup,
  updateStatusCustomerGroup,
  deleteCustomerGroup,
};
