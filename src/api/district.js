import axios from 'axios';
import { stringify } from 'qs';

const getListDistrict = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/district?${stringify(params)}`);
const getOneDistrict = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/district/${id}`);
const createDistrict = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/district`, params);
const updateDistrict = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/district/${id}`, params);
const updateStatusDistrict = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/district/updateStatus/${id}`,
    params
  );
const deleteDistrict = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/district/${id}`);

export {
  getListDistrict,
  getOneDistrict,
  createDistrict,
  updateDistrict,
  updateStatusDistrict,
  deleteDistrict,
};
