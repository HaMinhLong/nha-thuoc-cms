import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  template_1,
  template_2,
  template_3,
  template_4,
  template_5,
} from './templateServices';
import { healthFacility } from '../../../features/healthFacility/healthFacilitySlice';

const PrintResults = ({ dataPrint }) => {
  const dispatch = useDispatch();
  const list = useSelector(healthFacility);
  const currentHealthFacility = list.info;
  const [receiptId, setReceiptId] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = () => {
    dispatch({
      type: 'user/current',
      payload: token,
      callback: (res) => {
        if (res?.success) {
          const { list } = res.results;
          setCurrentUser(list);
        } else {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };

  const usersDoctorName = dataPrint?.doctorName;
  const usersDoctorNameQ = dataPrint?.doctorName;
  const descriptionsQ = '';
  const province = currentHealthFacility?.province?.provinceName;
  const serviceName = dataPrint?.serviceName;
  const templateReceiptPrintsId = dataPrint?.printFormId;

  if (Number(templateReceiptPrintsId) === 1189) {
    return template_1(
      dataPrint,
      currentHealthFacility,
      currentUser,
      receiptId,
      usersDoctorName,
      usersDoctorNameQ,
      descriptionsQ,
      province,
      serviceName
    );
  }

  if (Number(templateReceiptPrintsId) === 1289) {
    return template_2(
      dataPrint,
      currentHealthFacility,
      currentUser,
      receiptId,
      usersDoctorName,
      usersDoctorNameQ,
      descriptionsQ,
      province,
      serviceName
    );
  }

  if (Number(templateReceiptPrintsId) === 1389) {
    return template_3(
      dataPrint,
      currentHealthFacility,
      currentUser,
      receiptId,
      usersDoctorName,
      usersDoctorNameQ,
      descriptionsQ,
      province,
      serviceName
    );
  }

  if (Number(templateReceiptPrintsId) === 1489) {
    return template_4(
      dataPrint,
      currentHealthFacility,
      currentUser,
      receiptId,
      usersDoctorName,
      usersDoctorNameQ,
      descriptionsQ,
      province,
      serviceName
    );
  }

  if (Number(templateReceiptPrintsId) === 1589) {
    return template_5(
      dataPrint,
      currentHealthFacility,
      currentUser,
      receiptId,
      usersDoctorName,
      usersDoctorNameQ,
      descriptionsQ,
      province,
      serviceName
    );
  }

  return template_2(
    dataPrint,
    currentHealthFacility,
    currentUser,
    receiptId,
    usersDoctorName,
    usersDoctorNameQ,
    descriptionsQ,
    province,
    serviceName
  );
};

export default PrintResults;
