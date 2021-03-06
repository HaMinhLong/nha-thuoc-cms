import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'antd';
import HeaderContent from '../../layouts/HeaderContent';
import { useDispatch } from 'react-redux';
import '../../utils/css/styleWebContact.scss';

const List = ({ headerPage }) => {
  const dispatch = useDispatch();
  const [userTotal, setUserTotal] = useState(0);
  const [medicineTotal, setMedicineTotal] = useState(0);
  const [customerTotal, setCustomerTotal] = useState(0);
  const [healthFacilityTotal, setHealthFacilityTotal] = useState(0);

  useEffect(() => {
    dispatch({
      type: 'user/fetchLazyLoading',
      payload: {},
      callback: (res) => {
        if (res?.success) {
          const { pagination } = res?.results;
          setUserTotal(pagination.total);
        }
      },
    });

    dispatch({
      type: 'medicine/fetchLazyLoading',
      payload: {},
      callback: (res) => {
        if (res?.success) {
          const { pagination } = res?.results;
          setMedicineTotal(pagination.total);
        }
      },
    });

    dispatch({
      type: 'customer/fetchLazyLoading',
      payload: {},
      callback: (res) => {
        if (res?.success) {
          const { pagination } = res?.results;
          setCustomerTotal(pagination.total);
        }
      },
    });

    dispatch({
      type: 'healthFacility/fetchLazyLoading',
      payload: {},
      callback: (res) => {
        if (res?.success) {
          const { pagination } = res?.results;
          setHealthFacilityTotal(pagination.total);
        }
      },
    });
  }, []);

  console.log('userTotal', userTotal);

  return (
    <>
      {headerPage}
      <HeaderContent title="Dashboard">
        <Row gutter={[15, 15]}>
          <Col xs={24} md={12} lg={12} xl={6}>
            <Card
              bodyStyle={{
                textAlign: 'left',
                padding: '12px 24px',
              }}
              style={{
                height: 160,
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 5px',
                background: '#FF5370',
                color: 'white',
                width: '100%',
              }}
              title={
                <span style={{ color: 'white' }}>
                  T??i kho???n s??? d???ng h??? th???ng
                </span>
              }
              bordered={false}
            >
              <p>S??? l?????ng t??i kho???n: {userTotal}</p>
              <span className="icon_dashBoard">
                <i className="fas fa-chart-line" />
              </span>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={12} xl={6}>
            <Card
              bodyStyle={{
                textAlign: 'left',
                padding: '12px 24px',
              }}
              style={{
                height: 160,
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 5px',
                background: '#67D9B7',
                color: 'white',
                width: '100%',
              }}
              title={<span style={{ color: 'white' }}>Thu???c</span>}
              bordered={false}
            >
              <p>S??? l?????ng thu???c: {medicineTotal}</p>
              <span className="icon_dashBoard">
                <i className="far fa-file-alt" />
              </span>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={12} xl={6}>
            <Card
              bodyStyle={{
                textAlign: 'left',
                padding: '12px 24px',
              }}
              style={{
                height: 160,
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 5px',
                background: '#4197FB',
                color: 'white',
                width: '100%',
              }}
              title={<span style={{ color: 'white' }}>Kh??ch h??ng</span>}
              bordered={false}
            >
              <p>S??? l?????ng kh??ch h??ng: {customerTotal}</p>
              <span className="icon_dashBoard">
                <i className="fas fa-chart-line" />
              </span>
            </Card>
          </Col>
          <Col xs={24} md={12} lg={12} xl={6}>
            <Card
              bodyStyle={{
                textAlign: 'left',
                padding: '12px 24px',
              }}
              style={{
                height: 160,
                boxShadow: 'rgba(0, 0, 0, 0.16) 0px 0px 5px',
                background: '#F9B54C',
                color: 'white',
                width: '100%',
              }}
              title={<span style={{ color: 'white' }}>C?? s??? y t???</span>}
              bordered={false}
            >
              <p>S??? l?????ng CSYT: {healthFacilityTotal}</p>
              <span className="icon_dashBoard">
                <i className="far fa-file-alt" />
              </span>
            </Card>
          </Col>
        </Row>
      </HeaderContent>
    </>
  );
};

export default List;
