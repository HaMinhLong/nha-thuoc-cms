import axios from 'axios';
import { stringify } from 'qs';

const getListUnit = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/unit?${stringify(params)}`);
const getOneUnit = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/unit/${id}`);
const createUnit = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/unit`, params);
const updateUnit = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/unit/${id}`, params);
const updateStatusUnit = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/unit/updateStatus/${id}`, params);
const deleteUnit = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/unit/${id}`);

export {
  getListUnit,
  getOneUnit,
  createUnit,
  updateUnit,
  updateStatusUnit,
  deleteUnit,
};
