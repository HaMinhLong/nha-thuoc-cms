import axios from 'axios';
import { stringify } from 'qs';
const getListClinicReceiptService = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/clinicReceiptService?${stringify(params)}`
  );
const getOneClinicReceiptService = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/clinicReceiptService/${id}`);
const createClinicReceiptService = (params) =>
  axios.post(`${process.env.REACT_APP_SERVER}/clinicReceiptService`, params);
const updateClinicReceiptService = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/clinicReceiptService/${id}`,
    params
  );
const deleteClinicReceiptService = (id) =>
  axios.delete(`${process.env.REACT_APP_SERVER}/clinicReceiptService/${id}`);

export {
  getListClinicReceiptService,
  getOneClinicReceiptService,
  createClinicReceiptService,
  updateClinicReceiptService,
  deleteClinicReceiptService,
};
