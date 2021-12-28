import axios from 'axios';
import { stringify } from 'qs';

const getListWarehouseMedicine = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/warehouseMedicine?${stringify(params)}`
  );

export { getListWarehouseMedicine };
