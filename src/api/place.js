import axios from 'axios';
import { stringify } from 'qs';

const getListPlace = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/place?${stringify(params)}`);
const getOnePlace = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/place/${id}`);
const createPlace = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/place`, params);
const updatePlace = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/place/${id}`, params);
const updateStatusPlace = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/place/updateStatus/${id}`, params);
const deletePlace = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/place/${id}`);

export {
  getListPlace,
  getOnePlace,
  createPlace,
  updatePlace,
  updateStatusPlace,
  deletePlace,
};
