import axios from 'axios';
import { stringify } from 'qs';

const getListPackage = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/package?${stringify(params)}`);
const getOnePackage = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/package/${id}`);
const createPackage = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/package`, params);
const updatePackage = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/package/${id}`, params);
const updateStatusPackage = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/package/updateStatus/${id}`,
    params
  );
const deletePackage = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/package/${id}`);

export {
  getListPackage,
  getOnePackage,
  createPackage,
  updatePackage,
  updateStatusPackage,
  deletePackage,
};
