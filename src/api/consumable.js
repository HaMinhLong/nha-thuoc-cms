import axios from 'axios';
import { stringify } from 'qs';

const getListConsumable = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/consumable?${stringify(params)}`);
const getOneConsumable = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/consumable/${id}`);
const createConsumable = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/consumable`, params);
const updateConsumable = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/consumable/${id}`, params);
const updateStatusConsumable = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/consumable/updateStatus/${id}`,
    params
  );
const deleteConsumable = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/consumable/${id}`);

export {
  getListConsumable,
  getOneConsumable,
  createConsumable,
  updateConsumable,
  updateStatusConsumable,
  deleteConsumable,
};
