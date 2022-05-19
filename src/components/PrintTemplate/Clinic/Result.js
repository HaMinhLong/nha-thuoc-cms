import React, { useEffect, useState } from 'react';
import { notification } from 'antd';
import {
  template_1,
  template_2,
  template_3,
  template_4,
  template_5,
} from './templateServices';
import { useDispatch, useSelector } from 'react-redux';
import { healthFacility } from '../../../features/healthFacility/healthFacilitySlice';

const Result = ({ dataPrint }) => {
  const dispatch = useDispatch();
  const list = useSelector(healthFacility);
  const currentHealthFacility = list.info;
  const token = localStorage.getItem('token');
  const [receiptId, setReceiptId] = useState({});
  const [currentUser, setCurrentUser] = useState({});

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

  const templateReceiptPrintsId = 1189;
  const province = currentHealthFacility?.province?.provinceName;
  const nameServices = dataPrint?.nameServices;
  const descriptionsQ = '';
  const usersDoctorName = '……………………………';
  const usersDoctorNameQ = '……………………………';

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

export default Result;
