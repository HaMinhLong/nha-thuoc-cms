/* eslint-disable react/no-danger */
/* eslint-disable camelcase */
import moment from 'moment';
import './styles.scss';

export const template_1 = (
  dataPrint,
  currentHealthFacility,
  users,
  receitId,
  usersDoctorName,
  usersDoctorNameQ,
  descriptionsQ,
  province,
  serviceName
) => (
  <table
    style={{
      width: '95%',
      fontSize: '13px',
      fontFamily: 'Times New Roman',
      paddingLeft: '15px',
      paddingRight: '15px',
      margin: 'auto',
    }}
  >
    <tr>
      <td colSpan={5}>
        <div
          style={{
            width: '35%',
            float: 'left',
            color: '#348de5',
            margin: '10px 0',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              fontSize: 14,
              textTransform: 'uppercase',
            }}
          >
            {`SỞ Y TẾ ${province || ''}`}
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: 14,
              fontWeight: 600,
              textDecoration: 'underline',
              textTransform: 'uppercase',
            }}
          >
            {` ${currentHealthFacility?.healthFacilityName} `}
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: 10,
              textTransform: 'uppercase',
            }}
          >
            {`Đ/C:  ${currentHealthFacility.address} ĐT:${currentHealthFacility?.mobile} `}
          </div>
        </div>
        <div
          style={{
            width: '60%',
            float: 'right',
            color: '#348de5',
            margin: '10px 0',
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#E64C4C',
              textTransform: 'uppercase',
            }}
          >
            {`KẾT QUẢ ${serviceName}`}
          </div>
          <span
            style={{
              width: '60%',
              float: 'left',
              marginTop: 10,
              fontWeight: 600,
            }}
          >
            Họ và tên:&nbsp;
            <span style={{ fontWeight: 500 }}>
              {dataPrint?.customer?.customerName}
            </span>
          </span>
          <span
            style={{
              width: '20%',
              float: 'right',
              marginTop: 10,
              fontWeight: 600,
            }}
          >
            Nam/nữ
          </span>
          <span
            style={{
              width: '20%',
              float: 'right',
              marginTop: 10,
              fontWeight: 600,
            }}
          >
            Tuổi:&nbsp;
            <span style={{ fontWeight: 500 }}>
              {Number(moment().year()) -
                Number(moment(dataPrint?.customer?.dateOfBirth).year()) || 0}
            </span>
          </span>
          <span style={{ width: '100%', float: 'left', fontWeight: 600 }}>
            Địa chỉ:{' '}
            <span style={{ fontWeight: 500 }}>
              {dataPrint?.customer?.address}
            </span>
          </span>
          <span style={{ width: '100%', float: 'left', fontWeight: 600 }}>
            Chuẩn đoán:
          </span>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: descriptionsQ }}
          className="descriptions"
        />
      </td>
    </tr>
    <tr>
      <td
        style={{ fontSize: 12 }}
        dangerouslySetInnerHTML={{
          __html: dataPrint?.description,
        }}
        colSpan={5}
      />
    </tr>
    <tr>
      <td colSpan={5}>
        <div
          style={{
            width: '40%',
            float: 'left',
            textAlign: 'center',
            color: '#348de5',
            marginTop: '10px',
          }}
          colSpan={3}
        >
          Bác sỹ chỉ định
          <br />
          <br />
          <br />
          <br />
          <br />
          {usersDoctorNameQ}
        </div>
        <div
          style={{
            width: '40%',
            float: 'right',
            textAlign: 'center',
            color: '#348de5',
            marginTop: '10px',
          }}
          colSpan={3}
        >
          Ngày {moment().format('DD')} tháng {moment().format('MM')} năm{' '}
          {moment().format('YYYY')}
          <br />
          Trường phòng xét nghiệm
          <br />
          <br />
          <br />
          <br />
          {usersDoctorName}
        </div>
      </td>
    </tr>
  </table>
);

export const template_2 = (
  dataPrint,
  currentHealthFacility,
  users,
  receitId,
  usersDoctorName,
  usersDoctorNameQ,
  descriptionsQ,
  province,
  serviceName
) => (
  <table
    style={{
      width: '95%',
      fontSize: '13px',
      fontFamily: 'Times New Roman',
      paddingLeft: '15px',
      paddingRight: '15px',
      margin: 'auto',
    }}
  >
    <tr>
      <td>
        <div style={{ color: '#348de5', margin: '10px auto' }}>
          <div
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {`SỞ Y TẾ ${province || ''}`}
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: 20,
              fontWeight: 600,
              color: '#E64C4C',
              textTransform: 'uppercase',
            }}
          >
            {` ${currentHealthFacility?.healthFacilityName} `}
          </div>
          <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
            {`Địa chỉ: ${currentHealthFacility?.address}`}
          </div>
          <div
            style={{
              textAlign: 'center',
              fontWeight: 600,
              color: '#E64C4C',
              fontSize: 14,
            }}
          >
            {`Điện thoại: ${currentHealthFacility?.mobile}`}
          </div>
        </div>
        <div style={{ color: '#348de5', margin: '10px auto' }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#E64C4C',
              textTransform: 'uppercase',
            }}
          >
            {`KẾT QUẢ ${serviceName}`}
          </div>
          <span
            style={{
              width: '60%',
              float: 'left',
              marginTop: 10,
              fontWeight: 600,
            }}
          >
            Họ và tên:&nbsp;
            <span style={{ fontWeight: 500 }}>
              {dataPrint?.customer?.customerName}
            </span>
          </span>
          <span
            style={{
              width: '20%',
              float: 'right',
              marginTop: 10,
              fontWeight: 600,
            }}
          >
            Nam/nữ
          </span>
          <span
            style={{
              width: '20%',
              float: 'right',
              marginTop: 10,
              fontWeight: 600,
            }}
          >
            Tuổi:&nbsp;
            <span style={{ fontWeight: 500 }}>
              {Number(moment().year()) -
                Number(moment(dataPrint?.customer?.dateOfBirth).year()) || 0}
            </span>
          </span>
          <span style={{ width: '100%', float: 'left', fontWeight: 600 }}>
            Địa chỉ:{' '}
            <span style={{ fontWeight: 500 }}>
              {dataPrint?.customer?.address}
            </span>
          </span>
          <span style={{ width: '100%', float: 'left', fontWeight: 600 }}>
            Chuẩn đoán:
          </span>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: descriptionsQ }}
          className="descriptions"
        />
      </td>
    </tr>
    <tr>
      <td>
        <span
          style={{
            width: '100%',
            float: 'left',
            fontWeight: 600,
            color: '#348de5',
          }}
        >
          Kết quả:
        </span>
        <div
          dangerouslySetInnerHTML={{
            __html: dataPrint?.description,
          }}
        />
      </td>
    </tr>
    <tr>
      <td colSpan={5}>
        <div
          style={{
            width: '40%',
            float: 'left',
            textAlign: 'center',
            color: '#348de5',
            marginTop: '10px',
          }}
          colSpan={3}
        >
          Bác sỹ chỉ định
          <br />
          <br />
          <br />
          <br />
          <br />
          {usersDoctorNameQ}
        </div>
        <div
          style={{
            width: '40%',
            float: 'right',
            textAlign: 'center',
            color: '#348de5',
            marginTop: '10px',
          }}
          colSpan={3}
        >
          Ngày {moment().format('DD')} tháng {moment().format('MM')} năm{' '}
          {moment().format('YYYY')}
          <br />
          <br />
          <br />
          <br />
          {usersDoctorName}
        </div>
      </td>
    </tr>
  </table>
);

export const template_3 = (
  dataPrint,
  currentHealthFacility,
  users,
  receitId,
  usersDoctorName,
  usersDoctorNameQ,
  descriptionsQ,
  province,
  serviceName
) => (
  <table
    style={{
      width: '95%',
      fontSize: '13px',
      fontFamily: 'Times New Roman',
      paddingLeft: '15px',
      paddingRight: '15px',
      margin: 'auto',
    }}
  >
    <tr>
      <td>
        <div style={{ color: '#348de5', margin: '10px auto' }}>
          <div
            style={{
              textAlign: 'right',
              fontSize: 18,
              paddingTop: 10,
              fontWeight: 600,
              color: '#E64C4C',
              textTransform: 'uppercase',
            }}
          >
            {` ${currentHealthFacility?.healthFacilityName} `}
          </div>
          <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 600 }}>
            {currentHealthFacility?.address}
          </div>
          <div
            style={{
              textAlign: 'right',
              fontWeight: 600,
              color: '#E64C4C',
              fontSize: 14,
            }}
          >
            {`Điện thoại: ${currentHealthFacility?.mobile}`}
          </div>
        </div>
        <div style={{ color: '#348de5', margin: '10px auto' }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            {`KẾT QUẢ ${serviceName}`}
          </div>
          <div
            style={{
              textAlign: 'center',
              background: '#C0C0C0',
              color: '#000',
            }}
          >
            THÔNG TIN BỆNH NHÂN
          </div>
          <span
            style={{
              width: '60%',
              float: 'left',
              marginTop: 10,
              fontWeight: 600,
            }}
          >
            Họ và tên:&nbsp;
            <span style={{ fontWeight: 500 }}>
              {dataPrint?.customer?.customerName}
            </span>
          </span>
          <span
            style={{
              width: '20%',
              float: 'right',
              marginTop: 10,
              fontWeight: 600,
            }}
          >
            Nam/nữ
          </span>
          <span
            style={{
              width: '20%',
              float: 'right',
              marginTop: 10,
              fontWeight: 600,
            }}
          >
            Tuổi:&nbsp;
            <span style={{ fontWeight: 500 }}>
              {Number(moment().year()) -
                Number(moment(dataPrint?.customer?.dateOfBirth).year()) || 0}
            </span>
          </span>
          <span style={{ width: '100%', float: 'left', fontWeight: 600 }}>
            Địa chỉ:{' '}
            <span style={{ fontWeight: 500 }}>
              {dataPrint?.customer?.address}
            </span>
          </span>
          <span style={{ width: '100%', float: 'left', fontWeight: 600 }}>
            Chuẩn đoán:
          </span>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: descriptionsQ }}
          className="descriptions"
        />
      </td>
    </tr>
    <tr>
      <td>
        <div
          style={{ textAlign: 'center', background: '#C0C0C0', color: '#000' }}
        >
          KẾT QUẢ
        </div>
        <div
          style={{ fontSize: 12 }}
          dangerouslySetInnerHTML={{
            __html: dataPrint?.description,
          }}
        />
      </td>
    </tr>
    <tr>
      <td colSpan={5}>
        <div
          style={{
            width: '40%',
            float: 'left',
            textAlign: 'center',
            color: '#348de5',
            marginTop: '10px',
          }}
          colSpan={3}
        >
          Bác sỹ chỉ định
          <br />
          <br />
          <br />
          <br />
          <br />
          {usersDoctorNameQ}
        </div>
        <div
          style={{
            width: '40%',
            float: 'right',
            textAlign: 'center',
            color: '#348de5',
            marginTop: '10px',
          }}
          colSpan={3}
        >
          Ngày {moment().format('DD')} tháng {moment().format('MM')} năm{' '}
          {moment().format('YYYY')}
          <br />
          <br />
          <br />
          <br />
          {usersDoctorName}
        </div>
      </td>
    </tr>
  </table>
);

export const template_4 = (
  dataPrint,
  currentHealthFacility,
  users,
  receitId,
  usersDoctorName,
  usersDoctorNameQ,
  descriptionsQ,
  province,
  serviceName
) => (
  <table
    style={{
      width: '95%',
      fontSize: '13px',
      fontFamily: 'Times New Roman',
      paddingLeft: '15px',
      paddingRight: '15px',
      margin: 'auto',
    }}
  >
    <tr>
      <td>
        <div style={{ color: '#348de5', margin: '10px auto' }}>
          <div
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {`SỞ Y TẾ ${province || ''}`}
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: 18,
              paddingTop: 10,
              fontWeight: 600,
              color: '#E64C4C',
              textTransform: 'uppercase',
            }}
          >
            {` ${currentHealthFacility?.healthFacilityName} `}
          </div>
          <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 600 }}>
            {`Địa chỉ: ${currentHealthFacility?.address}`}
          </div>
          <div
            style={{
              textAlign: 'center',
              fontWeight: 600,
              color: '#E64C4C',
              fontSize: 14,
            }}
          >
            {`Điện thoại: ${currentHealthFacility?.mobile}`}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#E64C4C',
              marginTop: 15,
              textTransform: 'uppercase',
            }}
          >
            {`KẾT QUẢ ${serviceName}`}
          </div>
          <span
            style={{
              width: '60%',
              float: 'left',
              marginTop: 10,
              fontWeight: 600,
              padding: '5px',
              border: '1px solid #828282',
            }}
          >
            Họ và tên:&nbsp;
            <span style={{ fontWeight: 500 }}>
              {dataPrint?.customer?.customerName}
            </span>
          </span>
          <span
            style={{
              width: '20%',
              float: 'right',
              marginTop: 10,
              fontWeight: 600,
              padding: '5px',
              border: '1px solid #828282',
            }}
          >
            Nam/nữ
          </span>
          <span
            style={{
              width: '20%',
              float: 'right',
              marginTop: 10,
              fontWeight: 600,
              padding: '5px',
              border: '1px solid #828282',
            }}
          >
            Tuổi:&nbsp;
            <span style={{ fontWeight: 500 }}>
              {Number(moment().year()) -
                Number(moment(dataPrint?.customer?.dateOfBirth).year()) || 0}
            </span>
          </span>
          <span
            style={{
              width: '100%',
              float: 'left',
              fontWeight: 600,
              padding: '5px',
              border: '1px solid #828282',
            }}
          >
            Địa chỉ:{' '}
            <span style={{ fontWeight: 500 }}>
              {dataPrint?.customer?.address}
            </span>
          </span>
          <span
            style={{
              width: '100%',
              float: 'left',
              fontWeight: 600,
              padding: '5px',
              border: '1px solid #828282',
            }}
          >
            Chuẩn đoán:
          </span>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: descriptionsQ }}
          className="descriptions"
        />
      </td>
    </tr>
    <tr>
      <td>
        <div
          style={{ fontSize: 12 }}
          dangerouslySetInnerHTML={{
            __html: dataPrint?.description,
          }}
        />
      </td>
    </tr>
    <tr>
      <td colSpan={5}>
        <div
          style={{
            width: '40%',
            float: 'left',
            textAlign: 'center',
            color: '#348de5',
            marginTop: '10px',
          }}
          colSpan={3}
        >
          Bác sỹ chỉ định
          <br />
          <br />
          <br />
          <br />
          <br />
          {usersDoctorNameQ}
        </div>
        <div
          style={{
            width: '40%',
            float: 'right',
            textAlign: 'center',
            color: '#348de5',
            marginTop: '10px',
          }}
          colSpan={3}
        >
          Ngày {moment().format('DD')} tháng {moment().format('MM')} năm{' '}
          {moment().format('YYYY')}
          <br />
          <br />
          <br />
          <br />
          {usersDoctorName}
        </div>
      </td>
    </tr>
  </table>
);

export const template_5 = (
  dataPrint,
  currentHealthFacility,
  users,
  receitId,
  usersDoctorName,
  usersDoctorNameQ,
  descriptionsQ,
  province,
  serviceName
) => (
  <table
    style={{
      width: '95%',
      fontSize: '13px',
      fontFamily: 'Times New Roman',
      paddingLeft: '15px',
      paddingRight: '15px',
      margin: 'auto',
    }}
  >
    <tr>
      <td>
        <div style={{ color: '#348de5', margin: '10px 0' }}>
          <div
            style={{
              textAlign: 'center',
              fontSize: 16,
              paddingTop: 5,
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
          >
            {`SỞ Y TẾ ${province || ''}`}
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: 20,
              paddingTop: 5,
              fontWeight: 600,
              color: '#E64C4C',
              textTransform: 'uppercase',
            }}
          >
            {` ${currentHealthFacility?.healthFacilityName} `}
          </div>
          <div
            style={{
              textAlign: 'center',
              fontSize: 14,
              paddingTop: 5,
              fontWeight: 600,
            }}
          >
            {`Địa chỉ: ${currentHealthFacility?.address}`}
          </div>
          <div
            style={{
              textAlign: 'center',
              fontWeight: 600,
              color: '#E64C4C',
              fontSize: 14,
            }}
          >
            {`Điện thoại: ${currentHealthFacility?.mobile}`}
          </div>
        </div>
        <div style={{ color: '#348de5', margin: '10px 0' }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              textAlign: 'center',
              color: '#E64C4C',
              textTransform: 'uppercase',
            }}
          >
            {`KẾT QUẢ ${serviceName}`}
          </div>
          <span
            style={{
              width: '60%',
              float: 'left',
              marginTop: 10,
              fontWeight: 600,
              textAlign: 'left',
            }}
          >
            Họ và tên:&nbsp;
            <span style={{ fontWeight: 500 }}>
              {dataPrint?.customer?.customerName}
            </span>
          </span>
          <span
            style={{
              width: '20%',
              float: 'right',
              marginTop: 10,
              fontWeight: 600,
              textAlign: 'right',
            }}
          >
            Nam/nữ
          </span>
          <span
            style={{
              width: '20%',
              float: 'right',
              marginTop: 10,
              fontWeight: 600,
              textAlign: 'right',
            }}
          >
            Tuổi:&nbsp;
            <span style={{ fontWeight: 500 }}>
              {Number(moment().year()) -
                Number(moment(dataPrint?.customer?.dateOfBirth).year()) || 0}
            </span>
          </span>
          <span style={{ width: '100%', float: 'left', fontWeight: 600 }}>
            Địa chỉ:{' '}
            <span style={{ fontWeight: 500 }}>
              {dataPrint?.customer?.address}
            </span>
          </span>
          <span style={{ width: '100%', float: 'left', fontWeight: 600 }}>
            Kết quả chuẩn đoán:
          </span>
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: dataPrint?.description,
          }}
          className="descriptions"
        />
      </td>
    </tr>
    <tr>
      <td colSpan={5}>
        <div
          style={{
            width: '40%',
            float: 'left',
            textAlign: 'center',
            color: '#348de5',
            marginTop: '10px',
          }}
          colSpan={3}
        />
        <div
          style={{
            width: '40%',
            float: 'right',
            textAlign: 'center',
            color: '#348de5',
            marginTop: '10px',
          }}
          colSpan={3}
        >
          Ngày {moment().format('DD')} tháng {moment().format('MM')} năm{' '}
          {moment().format('YYYY')}
          <br />
          Bác sĩ khám
          <br />
          <br />
          <br />
          <br />
          {usersDoctorName}
        </div>
      </td>
    </tr>
  </table>
);
