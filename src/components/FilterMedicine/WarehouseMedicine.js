import React, { useState, Fragment } from 'react';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { Input, Col, Row, Button } from 'antd';
import { fnKhongDau, formatNumber } from '../../utils/utils';

const WarehouseMedicine = (props) => {
  const {
    onChange,
    disabled,
    medicineUnits,
    medicines,
    intl,
    getListMedicineUnit,
    resetFields,
  } = props;
  const [value, setValue] = useState(props.value);
  const [data, setData] = useState(props.dataArr);

  const handleClickMedicine = (item) => {
    if (getListMedicineUnit) {
      getListMedicineUnit(item.id);
    }
    resetFields();
    if (onChange) {
      onChange(item);
    }
    setValue(item.id);
  };

  if (medicines.id) {
    return (
      <div
        style={{
          width: 'inherit',
          whiteSpace: 'normal',
          background: '#F8F8F8',
          // borderRadius: '6px',
          padding: '10px 20px',
          margin: '10px 0',
          cursor: 'pointer',
          // border: '2px solid #E5E5E5',
          fontWeight: '400',
          color: '#222',
          boxShadow: 'rgb(0 0 0 / 16%) 0px 0px 5px',
        }}
        key="select"
      >
        <div style={{ fontSize: '22px', fontWeight: 600 }}>
          {medicines?.medicineName}
        </div>
        <div
          style={{
            opacity: '0.7',
            lineHeight: 1,
            marginBottom: '20px',
            fontWeight: 500,
            position: 'relative',
          }}
        >
          {medicines?.registrationNumber}
        </div>
        {!disabled && (
          <div
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              cursor: 'pointer',
              color: '#fff',
              background: 'red',
              padding: '3px 10px',
              borderRadius: 5,
              fontWeight: '600',
            }}
            onClick={() => {
              if (onChange) {
                onChange([]);
              }
              setValue('');
            }}
          >
            <CloseOutlined />
          </div>
        )}
        <div style={{ marginBottom: 20 }}>
          {intl.formatMessage({ id: 'app.medicine.list.col2' })}:{' '}
          <span style={{ color: '#0079d1', fontWeight: 500 }}>
            {medicines?.standard}
          </span>
        </div>
        <div style={{ marginBottom: 20 }}>
          {intl.formatMessage({ id: 'app.medicine.list.col7' })}:{' '}
          <span style={{ color: '#0079d1', fontWeight: 500 }}>
            {medicines?.medicineType?.medicineTypeName}
          </span>
        </div>
        <div style={{ marginBottom: 20 }}>
          {intl.formatMessage({ id: 'app.medicine.list.col3' })}:{' '}
          <span style={{ color: '#0079d1', fontWeight: 500 }}>
            {medicines?.activeIngredientName}
          </span>
        </div>
        <div style={{ marginBottom: 20 }}>
          {intl.formatMessage({ id: 'app.medicine.list.col4' })}:{' '}
          <span style={{ color: '#0079d1', fontWeight: 500 }}>
            {medicines?.concentration}
          </span>
        </div>
        <div style={{ marginBottom: 20 }}>
          {intl.formatMessage({ id: 'app.medicine.list.col10' })}:{' '}
          <span style={{ color: '#0079d1', fontWeight: 500 }}>
            {medicines?.producer?.producerName || ''}
          </span>{' '}
        </div>
        <div style={{ marginBottom: 20 }}>
          {intl.formatMessage({ id: 'app.medicine.list.col12' })}:{' '}
          <span style={{ color: '#0079d1', fontWeight: 500 }}>
            {medicines.country}
          </span>
        </div>
      </div>
    );
  }
  return (
    <Fragment>
      <Row
        style={{
          padding: '0 5px',
        }}
        gutter={20}
      >
        <Col span={20}>
          <Input
            placeholder="Nhập tên thuốc, mã vạch để tìm kiếm"
            // onChange={(e) => search(e.target.value)}
          />
        </Col>
        <Col span={4}>
          <Button
            icon={<SearchOutlined />}
            style={{ borderRadius: '50%' }}
            type="primary"
          />
        </Col>
      </Row>
      <div
        style={{
          height: '500px',
          overflowY: 'auto',
          padding: '0 5px',
        }}
      >
        {data?.map((item) => (
          <div
            style={{
              width: 'inherit',
              whiteSpace: 'normal',
              background: value === item.id ? '#fbe6bc' : '#FFFFFF',
              boxShadow:
                value === item.id ? '' : 'rgba(0, 0, 0, 0.16) 0px 0px 5px',
              borderRadius: '6px',
              padding: '10px 20px',
              margin: '10px 0',
              cursor: 'pointer',
              border:
                value === item.id ? '1px solid #faad14' : '1px solid #bbb',
              fontWeight: '500',
            }}
            key={item.id}
            onClick={() => handleClickMedicine(item)}
          >
            <span style={{ color: '#20A8D8' }}>{item.medicineName}</span>
            {item.registrationNumber && (
              <>
                {' '}
                - Số đăng ký:{' '}
                <span style={{ color: '#f86c6b' }}>
                  {item.registrationNumber}
                </span>
              </>
            )}
            &nbsp;-&nbsp;
            <span>
              <span>
                Tồn kho:&nbsp;
                <span style={{ color: '#f86c6b' }}>
                  {formatNumber(
                    item?.warehouses?.[0]?.warehouseMedicines?.inStock
                  ) || 0}{' '}
                  {
                    medicineUnits?.find(
                      (unit) =>
                        unit.id ===
                        item?.warehouses?.[0]?.warehouseMedicines?.unitId
                    )?.unitName
                  }
                </span>
              </span>
            </span>
            <span>
              {' '}
              - Nhà sản xuất:{' '}
              <span style={{ color: '#4dbd74' }}>
                {item?.producer?.producerName || ''}
              </span>{' '}
              - <span>{item?.country}</span>
            </span>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default WarehouseMedicine;
