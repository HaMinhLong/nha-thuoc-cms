import axios from 'axios';
import { stringify } from 'qs';

const getListHealthFacilitySpecialist = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/healthFacilitySpecialist?${stringify(
      params
    )}`
  );
const getOneHealthFacilitySpecialist = (id) =>
  axios.get(`${process.env.REACT_APP_SERVER}/healthFacilitySpecialist/${id}`);
const createHealthFacilitySpecialist = (params) =>
  axios.post(
    `${process.env.REACT_APP_SERVER}/healthFacilitySpecialist`,
    params
  );
const bulkCreateHealthFacilitySpecialist = (params) =>
  axios.post(
    `${process.env.REACT_APP_SERVER}/healthFacilitySpecialist/bulkCreate`,
    params
  );
const updateHealthFacilitySpecialist = (id, params) =>
  axios.put(
    `${process.env.REACT_APP_SERVER}/healthFacilitySpecialist/${id}`,
    params
  );
const deleteHealthFacilitySpecialist = (id) =>
  axios.delete(
    `${process.env.REACT_APP_SERVER}/healthFacilitySpecialist/${id}`
  );

export {
  getListHealthFacilitySpecialist,
  getOneHealthFacilitySpecialist,
  createHealthFacilitySpecialist,
  bulkCreateHealthFacilitySpecialist,
  updateHealthFacilitySpecialist,
  deleteHealthFacilitySpecialist,
};
