import React, { useState, useEffect } from 'react';
import { Row, notification } from 'antd';
import { useDispatch } from 'react-redux';
import { EnvironmentFilled } from '@ant-design/icons';
import { formatNumber } from '../../utils/utils';
import Table from '../../components/Table';
import '../../utils/css/selectHealthFacility.scss';

const PAGE_SIZE = process.env.REACT_APP_PAGE_SIZE;

const SelectHealthFacility = ({ isMobile, intl }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState([]);
  const userId = localStorage.getItem('id');
  useEffect(() => {
    getHealthFacilities(userId);
  }, []);

  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };
  const getHealthFacilities = (id) => {
    if (id) {
      let params = {
        filter: JSON.stringify({ userId: id }),
        range: JSON.stringify([0, PAGE_SIZE]),
        sort: JSON.stringify(['createdAt', 'DESC']),
      };
      setLoading(true);
      dispatch({
        type: 'healthFacilityUser/fetch',
        payload: params,
        callback: (res) => {
          setLoading(false);
          if (res?.success) {
            const { list } = res?.results;
            const { pagination } = res?.results;
            setData(list);
            setPagination(pagination);
          } else {
            openNotification('error', res.message, '#fff1f0');
          }
        },
      });
    } else {
      setData([]);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const sort = [
      (sorter && sorter.column && sorter.column.name) || 'createdAt',
      sorter && sorter.order === 'descend' ? 'ASC' : 'DESC',
    ];
    const query = {
      filter: JSON.stringify({}),
      range: JSON.stringify([
        pagination.current * pagination.pageSize - pagination.pageSize,
        pagination.current * pagination.pageSize,
      ]),
      sort: JSON.stringify(sort),
    };
    dispatch({
      type: 'healthFacilityUser/fetch',
      payload: query,
      callback: (res) => {
        setLoading(false);
        if (res?.success) {
          const { list } = res?.results;
          const { pagination } = res?.results;
          setData(list);
          setPagination(pagination);
        } else {
          openNotification('error', res.message, '#fff1f0');
        }
      },
    });
  };
  const handleSelectHealthFacility = (id) => {
    localStorage.setItem('healthFacilityId', id);
    window.location = '/dashboard';
  };
  const stylesName = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1175BB',
  };
  const columns = [
    {
      dataIndex: 'stt',
      title: '#',
      align: 'center',
      width: isMobile ? 50 : '5%',
      render: (text, record, index) =>
        formatNumber(
          index + (pagination.current - 1) * pagination.pageSize + 1
        ),
      fixed: isMobile,
    },
    {
      dataIndex: 'healthFacilityName',
      width: isMobile ? 200 : '30%',
      name: 'healthFacilityName',
      title: 'Tên cơ sở',
      align: 'left',
      // fixed: isMobile,
      render: (cell) => <span style={stylesName}>{cell}</span>,
    },
    {
      dataIndex: 'mobile',
      title: 'Số điện thoại',
      align: 'left',
      name: 'mobile',
      width: isMobile ? 50 : '15%',
    },
    {
      dataIndex: 'address',
      width: isMobile ? 200 : '50%',
      name: 'address',
      title: 'Địa chỉ',
      align: 'left',
      render: (text, record) => (
        <span>
          {`${record.address && `${record.address}, `}
        ${`${record?.ward?.wardName}, `} 
        ${`${record?.district?.districtName}, `} 
        ${record?.province?.provinceName}`}
        </span>
      ),
    },
  ];
  return (
    <React.Fragment>
      <div className="select-place">
        <div className="select-place__header"></div>
        <div className="bodySelect">
          <Row className="rowSelect">
            <h2 className="title">
              Danh sách cơ sở <EnvironmentFilled />
            </h2>
          </Row>
          <div className="rowSelect" style={{ paddingTop: 15 }}>
            <Table
              loading={loading}
              rowKey="id"
              dataSource={data}
              pagination={pagination}
              scroll={{ x: isMobile ? 1200 : '100vh', y: '58vh' }}
              columns={columns}
              rowClassName="rowSelectTab"
              onChange={handleTableChange}
              onRow={(record) => ({
                onClick: () => handleSelectHealthFacility(record.id),
              })}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default SelectHealthFacility;
