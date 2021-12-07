import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { useDispatch } from 'react-redux';
import {
  template_1,
  template_2,
  template_3,
  template_4,
  template_5,
} from './templateServices';

const PrintResults = ({ dataPrint, receiptIdProps, ref }) => {
  const dispatch = useDispatch();
  const [receiptId, setReceiptId] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [currentHealthFacility, setCurrentHealthFacility] = useState({});
  const token = localStorage.getItem('token');
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  useEffect(() => {
    getCurrentUser();
    getHealthFacility();
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
  const getHealthFacility = () => {
    dispatch({
      type: 'healthFacility/getOne',
      payload: {
        id: healthFacilityId,
      },
      callback: (res) => {
        if (res?.success) {
          const { list } = res.results;
          setCurrentHealthFacility(list);
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
  const usersDoctorName = '……………………………';
  const usersDoctorNameQ = '……………………………';
  const descriptionsQ = '';
  const province = currentHealthFacility?.province?.provinceName;
  const nameServices = dataPrint?.nameServices;
  const templateReceiptPrintsId = dataPrint?.templateReceiptPrints;
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
      nameServices
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
      nameServices
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
      nameServices
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
      nameServices
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
      nameServices
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
    nameServices
  );
};

export default PrintResults;
