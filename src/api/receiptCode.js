import axios from 'axios';
import { stringify } from 'qs';
const getOneReceiptCode = (params) =>
  axios.get(`${process.env.REACT_APP_SERVER}/receiptCode?${stringify(params)}`);
const updateReceiptCode = (id) =>
  axios.put(`${process.env.REACT_APP_SERVER}/receiptCode/${id}`);

export { getOneReceiptCode, updateReceiptCode };
