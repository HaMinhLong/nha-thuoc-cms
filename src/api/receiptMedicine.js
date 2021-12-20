import axios from 'axios';
import { stringify } from 'qs';
const getListReceiptMedicine = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/receiptMedicine?${stringify(params)}`
  );
const getOneReceiptMedicine = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/receiptMedicine/${id}`);
const createReceiptMedicine = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/receiptMedicine`, params);
const updateReceiptMedicine = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/receiptMedicine/${id}`, params);
const deleteReceiptMedicine = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/receiptMedicine/${id}`);

export {
  getListReceiptMedicine,
  getOneReceiptMedicine,
  createReceiptMedicine,
  updateReceiptMedicine,
  deleteReceiptMedicine,
};
