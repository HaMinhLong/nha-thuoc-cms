import axios from 'axios';
import { stringify } from 'qs';

const getListHealthFacility = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/healthFacility?${stringify(params)}`
  );
const getOneHealthFacility = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/healthFacility/${id}`);
const createHealthFacility = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/healthFacility`, params);
const updateHealthFacility = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/healthFacility/${id}`, params);
const updateStatusHealthFacility = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/healthFacility/updateStatus/${id}`,
    params
  );
const deleteHealthFacility = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/healthFacility/${id}`);

export {
  getListHealthFacility,
  getOneHealthFacility,
  createHealthFacility,
  updateHealthFacility,
  updateStatusHealthFacility,
  deleteHealthFacility,
};
