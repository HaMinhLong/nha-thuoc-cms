import axios from 'axios';
import { stringify } from 'qs';
const getListCustomerReport = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/customerReport?${stringify(params)}`
  );
const getListEmployeeReport = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/employeeReport?${stringify(params)}`
  );
const getListSupplierReport = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/supplierReport?${stringify(params)}`
  );
const getListExpiredMedicineReport = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/expiredMedicineReport?${stringify(params)}`
  );
const getListExpiredMedicineReportV2 = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/expiredMedicineReportv2?${stringify(
      params
    )}`
  );
const getListMedicineReport = (params) =>
  axios.get(
    `${process.env.REACT_APP_SERVER}/medicineReport?${stringify(params)}`
  );

export {
  getListCustomerReport,
  getListEmployeeReport,
  getListSupplierReport,
  getListExpiredMedicineReport,
  getListExpiredMedicineReportV2,
  getListMedicineReport,
};
