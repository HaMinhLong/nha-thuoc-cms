import axios from 'axios';
import { stringify } from 'qs';
const getListApothecary = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/apothecary?${stringify(params)}`);
const getOneApothecary = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/apothecary/${id}`);
const createApothecary = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/apothecary`, params);
const updateApothecary = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/apothecary/${id}`, params);
const updateStatusApothecary = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/apothecary/updateStatus/${id}`,
    params
  );
const deleteApothecary = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/apothecary/${id}`);

export {
  getListApothecary,
  getOneApothecary,
  createApothecary,
  updateApothecary,
  updateStatusApothecary,
  deleteApothecary,
};
