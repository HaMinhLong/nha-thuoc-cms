import axios from 'axios';
import { stringify } from 'qs';

const getListWarehouseUser = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/warehouseUser?${stringify(params)}`);
const createWarehouseUser = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/warehouseUser`, params);
const deleteWarehouseUser = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/warehouseUser/${id}`);

export {
  getListWarehouseUser,
  createWarehouseUser,
  deleteWarehouseUser,
};
