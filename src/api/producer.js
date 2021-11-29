import axios from 'axios';
import { stringify } from 'qs';

const getListProducer = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/producer?${stringify(params)}`);
const getOneProducer = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/producer/${id}`);
const createProducer = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/producer`, params);
const updateProducer = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/producer/${id}`, params);
const updateStatusProducer = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/producer/updateStatus/${id}`,
    params
  );
const deleteProducer = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/producer/${id}`);

export {
  getListProducer,
  getOneProducer,
  createProducer,
  updateProducer,
  updateStatusProducer,
  deleteProducer,
};
