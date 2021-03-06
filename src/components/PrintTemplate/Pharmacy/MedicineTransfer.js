import React, { useState, useEffect } from 'react';
import { notification } from 'antd';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { formatNumber } from '../../../utils/utils';
import '../../../utils/css/stylePrint.scss';

const Receipt = ({
  intl,
  isMobile,
  title,
  dataMedicines,
  dataForm,
  fullName,
  warehouseName,
  warehouseTransferName,
  medicineTransferCode,
  dataInfo,
}) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const [currentUser, setCurrentUser] = useState({});
  const [currentHealthFacility, setCurrentHealthFacility] = useState({});
  let total = 0;
  dataMedicines.map((item) => {
    total += item?.medicineTransferMedicines?.total;
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
        {`??/c: ${currentHealthFacility?.ward?.wardName}, ${currentHealthFacility?.district?.districtName}, ${currentHealthFacility?.province?.provinceName}`}
      </p>
      <p>
        <span>{`??T: ${currentHealthFacility?.mobile}`}</span>
        <span style={{ marginLeft: '28%' }}>
          S??? phi???u:{' '}
          <span style={{ fontWeight: 'bold' }}>
            {medicineTransferCode.medicineTransferCode ||
              dataInfo.medicineTransferCode}
          </span>
        </span>
      </p>
      {/* <p style={{ marginBottom: 0, }}>
    {`S??? h??a ????n: ${dataForm?.invoiceCode}`}
  </p> */}
      <p
        style={{
          marginBottom: 0,
          textAlign: 'center',
          fontSize: 20,
          fontWeight: 'bold',
        }}
      >
        {title || 'PHI???U THU'}
      </p>
      <p>
        <strong>Ng?????i xu???t h??a ????n: </strong>
        {fullName || currentUser.fullName}
      </p>
      <p>
        <strong>Kho h??ng xu???t: </strong>
        {warehouseName || ''}
      </p>
      <p>
        <strong>Kho h??ng nh???n: </strong>
        {warehouseTransferName || ''}
      </p>
      <p>
        <strong>Ghi ch??: </strong>
        {dataForm?.description || ''}
      </p>
      <div className="tablePrint">
        <table>
          <thead>
            <tr>
              <th>T??n thu???c</th>
              <th> SL</th>
              <th> ????n gi??</th>
              <th> Gi???m gi??</th>
              <th> VAT</th>
              <th> T???ng</th>
            </tr>
          </thead>
          <tbody>
            {dataMedicines?.map((item) => (
              <tr>
                <td> {`${item?.medicine?.medicineName}`}</td>
                <td>{`${item?.medicineTransferMedicines?.amount}`}</td>
                <td>{`${formatNumber(
                  item?.medicineTransferMedicines?.price
                )}`}</td>
                <td>{`${formatNumber(
                  item?.medicineTransferMedicines?.discount || 0
                )}`}</td>
                <td>{`${formatNumber(
                  item?.medicineTransferMedicines?.tax || 0
                )}`}</td>
                <td>{`${formatNumber(
                  item?.medicineTransferMedicines?.total
                )}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="footer">
        <p>
          <span style={{ width: '40%' }} className="totalInfo">
            Th??nh ti???n:
          </span>
          <span style={{ float: 'right' }} className="totalInfo1">
            {`${formatNumber(total || 0)} VND`}
          </span>
        </p>

        <p>
          <span style={{ width: '40%' }} className="totalInfo">
            T???ng thanh to??n:
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
          {`Ng??y ${moment(dataForm?.createdAt).format('DD')} th??ng ${moment(
            dataForm?.createdAt
          ).format('MM')} n??m ${moment(dataForm?.createdAt).format('YYYY')}`}
          <br />
          Ng?????i thu
        </p>
        <p
          style={{ width: '40%', textAlign: 'center', display: 'inline-table' }}
        >
          {dataForm?.name}
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
