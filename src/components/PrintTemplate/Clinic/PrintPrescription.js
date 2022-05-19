import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import '../../../utils/css/stylePrint.scss';
import { healthFacility } from '../../../features/healthFacility/healthFacilitySlice';

const PrintPrescription = ({ dataPrint }) => {
  const list = useSelector(healthFacility);
  const currentHealthFacility = list.info;

  return (
    <div
      style={{ color: '#000', padding: '10px 20px' }}
      className="printContainer"
    >
      <p style={{ fontWeight: 'bold', fontSize: 14 }}>
        {currentHealthFacility?.healthFacilityName?.toUpperCase()}
      </p>
      <p>{`Đ/c: ${currentHealthFacility?.address}`}</p>
      <p>{`Số phiếu: ${dataPrint?.receiptCode}`}</p>
      <p style={{ textAlign: 'center', fontSize: 19, fontWeight: 'bold' }}>
        ĐƠN THUỐC
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: 'bold',
          textDecoration: 'underline',
        }}
      >
        I. THÔNG TIN BỆNH NHÂN
      </p>
      <p>
        <span style={{ width: '65%', marginBottom: '0', float: 'left' }}>
          {`Họ và tên: `}
          <span style={{ fontWeight: 'bold' }}>
            {dataPrint?.customer?.customerName}
          </span>
        </span>
        <span style={{ width: '35%', marginBottom: '0', float: 'right' }}>
          {`Tuổi: `}
          <span style={{ fontWeight: 'bold' }}>
            {Number(moment().year()) -
              Number(moment(dataPrint?.customer?.dateOfBirth).year())}
          </span>
        </span>
      </p>
      <p>
        <span style={{ width: '65%', marginBottom: '0', float: 'left' }}>
          {`Số điện thoại: `}
          <span style={{ fontWeight: 'bold' }}>
            {dataPrint?.customer?.mobile}
          </span>
        </span>
        <span style={{ width: '35%', marginBottom: '0', float: 'right' }}>
          {`Giới tính: `}
          <span style={{ fontWeight: 'bold' }}>
            {(dataPrint?.customer?.gender === 1 ? 'Nữ' : 'Nam') || 'Nam/Nữ'}
          </span>
        </span>
      </p>
      <p>
        {`Địa chỉ: `}
        <span style={{ fontWeight: 'bold' }}>
          {dataPrint?.customer?.address}
        </span>
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: 'bold',
          textDecoration: 'underline',
          marginBottom: '0',
        }}
      >
        II. THÔNG TIN ĐƠN THUỐC
      </p>
      <div style={{ padding: '5px 20px', marginBottom: '15px' }}>
        {dataPrint?.clinicPreMedicines?.map((item, index) => (
          <p key={item.id} style={{ marginBottom: '0' }}>
            <span>
              <span style={{ fontWeight: 'bold' }}>{`${index + 1}. ${
                item?.medicineName
              }`}</span>
            </span>
            <span style={{ float: 'right', marginRight: '30%' }}>
              <span style={{ fontWeight: 'bold' }}>{item?.amount}</span>{' '}
              {item?.unitName}
            </span>
          </p>
        ))}
      </div>
      <div className="footer">
        <div
          style={{
            width: '50%',
            textAlign: 'left',
            display: 'inline-table',
            float: 'left',
          }}
        >
          <h3 style={{ textDecoration: 'underline' }}>Lời dặn bác sĩ:</h3>
          {dataPrint?.description}
        </div>
        <div
          style={{
            width: '50%',
            textAlign: 'center',
            display: 'inline-table',
            float: 'right',
          }}
        >
          <p style={{ marginBottom: '0' }}>
            {`Ngày ${moment(dataPrint?.createdAt).format('DD')} tháng ${moment(
              dataPrint?.createdAt
            ).format('MM')} năm ${moment(dataPrint?.createdAt).format('YYYY')}`}
          </p>
          <p style={{ marginBottom: '0' }}>Bác sĩ khám bệnh</p>
          <p style={{ marginTop: '25px' }}>{dataPrint?.doctorName}</p>
        </div>
      </div>
      {/* <p style={{ width: '50%', textAlign: 'center', display: 'inline-table', float: 'right' }}>
      
    </p>
    <p
      style={{
        width: '50%',
        textAlign: 'center',
        display: 'inline-table',
        marginTop: '100px',
        float: 'right',
      }}
    >
      {customers && customers.name}
    </p> */}
    </div>
  );
};

export default PrintPrescription;
