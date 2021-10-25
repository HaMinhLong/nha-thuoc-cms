import axios from 'axios';
import { stringify } from 'qs';

const getListProvince = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/province?${stringify(params)}`);
const getOneProvince = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/province/${id}`);
const createProvince = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/province`, params);
const updateProvince = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/province/${id}`, params);
const updateStatusProvince = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/province/updateStatus/${id}`,
    params
  );
const deleteProvince = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/province/${id}`);

export {
  getListProvince,
  getOneProvince,
  createProvince,
  updateProvince,
  updateStatusProvince,
  deleteProvince,
};
