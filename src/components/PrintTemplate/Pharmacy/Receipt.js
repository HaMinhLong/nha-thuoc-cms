import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { formatNumber } from '../../../utils/utils';
import '../../../utils/css/stylePrint.scss';

const Receipt = ({ intl, isMobile, title, dataMedicines, dataCustomer }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const [currentUser, setCurrentUser] = useState({});
  const [currentHealthFacility, setCurrentHealthFacility] = useState({});
  let total = 0;
  dataMedicines.map((item) => {
    total += item?.medicineIssueMedicines?.total;
  });
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

  return (
    <div
      style={{
        color: '#000',
        padding: '10px 3vw',
      }}
      className="printContainer"
    >
      <p style={{ fontWeight: 'bold', fontSize: 12 }}>
        {currentHealthFacility?.healthFacilityName?.toUpperCase()}
      </p>
      <p>
        {`Đ/c: ${currentHealthFacility?.ward?.wardName}, ${currentHealthFacility?.district?.districtName}, ${currentHealthFacility?.province?.provinceName}`}
      </p>
      <p>
        <span>{`ĐT: ${currentHealthFacility?.mobile}`}</span>
        <span style={{ marginLeft: '28%' }}>
          Số phiếu:{' '}
          <span style={{ fontWeight: 'bold' }}>
            {dataCustomer?.medicineIssueCode}
          </span>
        </span>
      </p>
      {/* <p style={{ marginBottom: 0, }}>
    {`Số hóa đơn: ${dataCustomer?.invoiceCode}`}
  </p> */}
      <p
        style={{
          marginBottom: 0,
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
        }}
      >
        {title || 'PHIẾU THU'}
      </p>
      <p>
        <strong>Khách hàng: </strong>
        {dataCustomer?.customerName || ''}
      </p>
      <p>
        <strong>Địa chỉ: </strong>
        {dataCustomer?.address || ''}
      </p>
      <p>
        <span>
          <strong>Điện thoại: </strong>
          <span style={{ fontWeight: 'bold' }}>
            {dataCustomer?.mobile || ''}
          </span>
        </span>
      </p>
      <p>
        <strong>Ghi chú: </strong>
        {dataCustomer?.description || ''}
      </p>
      <div className="tablePrint">
        <table>
          <thead>
            <tr>
              <th>Tên thuốc</th>
              <th> SL</th>
              <th> Đơn giá</th>
              <th> Giảm giá</th>
              <th> VAT</th>
              <th> Tổng</th>
            </tr>
          </thead>
          <tbody>
            {dataMedicines?.map((item) => (
              <tr>
                <td> {`${item?.medicine?.medicineName}`}</td>
                <td>{`${item?.medicineIssueMedicines?.amount}`}</td>
                <td>{`${formatNumber(
                  item?.medicineIssueMedicines?.price
                )}`}</td>
                <td>{`${formatNumber(
                  item?.medicineIssueMedicines?.discount || 0
                )}`}</td>
                <td>{`${formatNumber(
                  item?.medicineIssueMedicines?.tax || 0
                )}`}</td>
                <td>{`${formatNumber(
                  item?.medicineIssueMedicines?.total
                )}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="footer">
        <p>
          <span style={{ width: '40%' }} className="totalInfo">
            Thành tiền:
          </span>
          <span style={{ float: 'right' }} className="totalInfo1">
            {`${formatNumber(total || 0)} VND`}
          </span>
        </p>

        <p>
          <span style={{ width: '40%' }} className="totalInfo">
            Tổng thanh toán:
          </span>
          <span style={{ float: 'right' }} className="totalInfo1">
            {`${formatNumber(total || 0)} VND`}
          </span>
        </p>
        <p
          style={{
            width: '40%',
            fontWeight: 'bold',
            textAlign: 'center',
            display: 'inline-table',
            marginTop: 10,
          }}
        />
        <p
          style={{
            width: '60%',
            textAlign: 'center',
            display: 'inline-table',
            marginTop: 10,
          }}
        >
          {`Ngày ${moment(dataCustomer?.createdAt).format('DD')} tháng ${moment(
            dataCustomer?.createdAt
          ).format('MM')} năm ${moment(dataCustomer?.createdAt).format(
            'YYYY'
          )}`}
          <br />
          Người thu
        </p>
        <p
          style={{ width: '40%', textAlign: 'center', display: 'inline-table' }}
        >
          {dataCustomer?.name}
        </p>
        <p
          style={{ width: '60%', textAlign: 'center', display: 'inline-table' }}
        >
          {currentUser.fullName}
        </p>
      </div>
    </div>
  );
};

export default Receipt;
