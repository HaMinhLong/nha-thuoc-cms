import axios from 'axios';
import { stringify } from 'qs';

const getListSpecialist = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/specialist?${stringify(params)}`);
const getOneSpecialist = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/specialist/${id}`);
const createSpecialist = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/specialist`, params);
const updateSpecialist = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/specialist/${id}`, params);
const updateStatusSpecialist = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/specialist/updateStatus/${id}`,
    params
  );
const deleteSpecialist = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/specialist/${id}`);

export {
  getListSpecialist,
  getOneSpecialist,
  createSpecialist,
  updateSpecialist,
  updateStatusSpecialist,
  deleteSpecialist,
};
