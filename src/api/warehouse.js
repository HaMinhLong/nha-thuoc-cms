import axios from 'axios';
import { stringify } from 'qs';

const getListWarehouse = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/warehouse?${stringify(params)}`);
const getOneWarehouse = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/warehouse/${id}`);
const createWarehouse = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/warehouse`, params);
const updateWarehouse = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/warehouse/${id}`, params);
const updateStatusWarehouse = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/warehouse/updateStatus/${id}`,
    params
  );
const deleteWarehouse = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/warehouse/${id}`);

export {
  getListWarehouse,
  getOneWarehouse,
  createWarehouse,
  updateWarehouse,
  updateStatusWarehouse,
  deleteWarehouse,
};
