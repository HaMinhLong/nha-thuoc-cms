import axios from 'axios';
import { stringify } from 'qs';

const getListProducerGroup = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/producerGroup?${stringify(params)}`
  );
const getOneProducerGroup = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/producerGroup/${id}`);
const createProducerGroup = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/producerGroup`, params);
const updateProducerGroup = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/producerGroup/${id}`, params);
const updateStatusProducerGroup = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/producerGroup/updateStatus/${id}`,
    params
  );
const deleteProducerGroup = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/producerGroup/${id}`);

export {
  getListProducerGroup,
  getOneProducerGroup,
  createProducerGroup,
  updateProducerGroup,
  updateStatusProducerGroup,
  deleteProducerGroup,
};
