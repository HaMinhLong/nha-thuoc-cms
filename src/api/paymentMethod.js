import axios from 'axios';
import { stringify } from 'qs';

const getListPaymentMethod = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/paymentMethod?${stringify(params)}`
  );
const getOnePaymentMethod = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/paymentMethod/${id}`);
const createPaymentMethod = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/paymentMethod`, params);
const updatePaymentMethod = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/paymentMethod/${id}`, params);
const updateStatusPaymentMethod = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/paymentMethod/updateStatus/${id}`,
    params
  );
const deletePaymentMethod = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/paymentMethod/${id}`);

export {
  getListPaymentMethod,
  getOnePaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  updateStatusPaymentMethod,
  deletePaymentMethod,
};
