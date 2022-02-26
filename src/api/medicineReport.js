import axios from 'axios';
import { stringify } from 'qs';
const getListCustomerReport = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/customerReport?${stringify(params)}`
  );

export { getListCustomerReport };
