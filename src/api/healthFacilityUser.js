import axios from 'axios';
import { stringify } from 'qs';

const getListHealthFacilityUser = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/healthFacilityUser?${stringify(params)}`
  );
const getOneHealthFacilityUser = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/healthFacilityUser/${id}`);
const createHealthFacilityUser = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/healthFacilityUser`, params);
const bulkCreateHealthFacilityUser = (params) =>
  axios.post(
    `${process.env.REACT_APP_SERVER}/healthFacilityUser/bulkCreate`,
    params
  );
const updateHealthFacilityUser = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/healthFacilityUser/${id}`, params);
const deleteHealthFacilityUser = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/healthFacilityUser/${id}`);

export {
  getListHealthFacilityUser,
  getOneHealthFacilityUser,
  createHealthFacilityUser,
  bulkCreateHealthFacilityUser,
  updateHealthFacilityUser,
  deleteHealthFacilityUser,
};
