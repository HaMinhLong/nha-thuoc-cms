import axios from 'axios';
import { stringify } from 'qs';

const getListPrintForm = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/printForm?${stringify(params)}`);
const getOnePrintForm = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/printForm/${id}`);
const createPrintForm = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/printForm`, params);
const updatePrintForm = (id, params) =>
  axios.put(`${process.env.REACT_APP_SERVER}/printForm/${id}`, params);
const updateStatusPrintForm = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/printForm/updateStatus/${id}`,
    params
  );
const deletePrintForm = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/printForm/${id}`);

export {
  getListPrintForm,
  getOnePrintForm,
  createPrintForm,
  updatePrintForm,
  updateStatusPrintForm,
  deletePrintForm,
};
