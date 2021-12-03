import axios from 'axios';
import { stringify } from 'qs';

const getListPaperSizeType = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/paperSizeType?${stringify(params)}`
  );

export { getListPaperSizeType };
