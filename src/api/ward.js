import axios from 'axios';
import { stringify } from 'qs';

const getListWard = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/ward?${stringify(params)}`);
const getOneWard = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/ward/${id}`);
const createWard = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/ward`, params);
const updateWard = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/ward/${id}`, params);
const updateStatusWard = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/ward/updateStatus/${id}`, params);
const deleteWard = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/ward/${id}`);

export {
  getListWard,
  getOneWard,
  createWard,
  updateWard,
  updateStatusWard,
  deleteWard,
};
