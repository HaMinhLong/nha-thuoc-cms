import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { formatNumber } from '../../../utils/utils';
import '../../../utils/css/stylePrint.scss';
import { healthFacility } from '../../../features/healthFacility/healthFacilitySlice';

const Receipt = ({ intl, isMobile, title, dataForm }) => {
  const dispatch = useDispatch();
  const list = useSelector(healthFacility);
  const currentHealthFacility = list.info;
  const token = localStorage.getItem('token');
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

  let tTotal = 0;
  let tDis = 0;
  let tVat = 0;

  dataForm?.clinicReceiptServices?.map((item) => {
    tTotal += Number(item.price) * Number(item.amount);
    tDis += item.discount;
    tVat += item.tax;
    return { tTotal, tDis, tVat };
  });

  return (
    <div style={{ margin: '0', padding: '0' }}>
      <div
        style={{
          color: '#000',
          height: '100%',
          padding: '4vh 2vw',
          width: '100%',
        }}
        className="printContainer"
      >
        <p style={{ fontWeight: 'bold', fontSize: 13 }}>
          {currentHealthFacility?.healthFacilityName?.toUpperCase()}
        </p>
        <p>{`Đ/c: ${currentHealthFacility?.address}`}</p>
        <p>
          <span>{`Điện thoại: ${currentHealthFacility?.mobile}`}</span>
          <span style={{ marginLeft: '5%' }}>
            Số phiếu:{' '}
            <span style={{ fontWeight: 'bold' }}>
              {dataForm?.clinicReceiptCode}
            </span>
          </span>
        </p>
        <p
          style={{
            marginBottom: 0,
            textAlign: 'center',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          PHIẾU THU
        </p>
        <p style={{ marginBottom: 0 }}>
          <strong>Khách hàng: </strong>
          {dataForm?.customerName?.toUpperCase()}
        </p>
        <p>
          <strong>Điện thoại: </strong>
          {dataForm?.mobile}
        </p>
        <p>
          <span>
            <strong>Địa chỉ: </strong>
            {dataForm?.address}
          </span>
          <span style={{ marginLeft: '20%' }}>
            <strong>Tuổi: </strong>
            {Number(moment().year()) -
              Number(moment(dataForm?.dateOfBirth).year())}
          </span>
        </p>
        <p>
          <strong>Ghi chú: </strong>
          {dataForm?.descriptions}
        </p>
        <div className="tablePrint">
          <table>
            <thead>
              <tr>
                <th>Gói dv</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Giảm</th>
                <th>VAT</th>
                <th>Tổng</th>
              </tr>
            </thead>
            <tbody>
              {dataForm?.clinicReceiptServices?.map((item) => (
                <tr key={item.id}>
                  <td>{`${item.clinicServiceName}`}</td>
                  <td>{`${item.amount}`}</td>
                  <td>{`${formatNumber(Number(item.price || 0))}`}</td>
                  <td>{`${formatNumber(Number(item.discount))}`}</td>
                  <td>{`${formatNumber(Number(item.tax))}`}</td>
                  <td>{`${formatNumber(Number(item.total))}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="footer">
          <p>
            <span
              style={{ width: '40%', fontWeight: 'bold' }}
              className="totalInfo"
            >
              Thành tiền
            </span>
            <span
              style={{ float: 'right', fontWeight: 'bold' }}
              className="totalInfo1"
            >
              {`${formatNumber(Number(tTotal))}`}
            </span>
          </p>
          <p>
            <span
              style={{ width: '40%', fontWeight: 'bold' }}
              className="totalInfo"
            >
              Giảm giá
            </span>
            <span
              style={{ float: 'right', fontWeight: 'bold' }}
              className="totalInfo1"
            >
              {`${formatNumber(tDis)}`}
            </span>
          </p>
          <p>
            <span
              style={{ width: '40%', fontWeight: 'bold' }}
              className="totalInfo"
            >
              VAT
            </span>
            <span
              style={{ float: 'right', fontWeight: 'bold' }}
              className="totalInfo1"
            >
              {`${formatNumber(tVat)}`}
            </span>
          </p>
          <p>
            <span
              style={{ width: '40%', fontWeight: 'bold' }}
              className="totalInfo"
            >
              Thanh toán
            </span>
            <span
              style={{ float: 'right', fontWeight: 'bold' }}
              className="totalInfo1"
            >
              {`${formatNumber(dataForm?.total)}`}
            </span>
          </p>
          <p
            style={{
              width: '40%',
              fontSize: '12px',
              textAlign: 'center',
              display: 'inline-table',
            }}
          />
          <p
            style={{
              width: '60%',
              fontSize: '12px',
              textAlign: 'center',
              display: 'inline-table',
            }}
          >
            {`Ngày ${moment(dataForm?.createdAt).format('DD')} tháng ${moment(
              dataForm?.createdAt
            ).format('MM')} năm ${moment(dataForm?.createdAt).format('YYYY')}`}
          </p>{' '}
          <p
            style={{
              width: '40%',
              fontWeight: 'bold',
              textAlign: 'center',
              display: 'inline-table',
            }}
          >
            Khách hàng
          </p>
          <p
            style={{
              width: '60%',
              fontWeight: 'bold',
              textAlign: 'center',
              display: 'inline-table',
            }}
          >
            Người thu
          </p>
          <p
            style={{
              width: '40%',
              textAlign: 'center',
              display: 'inline-table',
            }}
          >
            {dataForm?.customerName}
          </p>
          <p
            style={{
              width: '60%',
              textAlign: 'center',
              display: 'inline-table',
            }}
          >
            {currentUser.fullName}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
