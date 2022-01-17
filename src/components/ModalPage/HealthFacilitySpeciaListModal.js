import React, { useState, useEffect } from 'react';
import {
  Button,
  Popconfirm,
  Modal,
  Tooltip,
  notification,
  PageHeader,
  Card,
  Spin,
} from 'antd';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { formatNumber } from '../../utils/utils';
import Table from '../../components/Table';
import HealthFacilitySpeciaListAddModal from './HealthFacilitySpeciaListAddModal';

const PAGE_SIZE = process.env.REACT_APP_PAGE_SIZE;

const HealthFacilitySpeciaListModal = ({
  intl,
  isMobile,
  visible,
  titleModal,
  dataEdit,
  getList,
}) => {
  const dispatch = useDispatch();
  const [checkFirst, setCheckFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleAddSpecialist, setVisibleAddSpecialist] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState([]);
  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      changeModal('show');
      getSpecialist(dataEdit?.id);
    }
  }, [visible]);

  const changeModal = (value) => {
    if (value === 'show') {
      setVisibleModal(!visibleModal);
    } else if (value === 'close') {
      setVisibleModal(false);
      setData([]);
      setPagination([]);
    }
  };
  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };
  const getSpecialist = (id) => {
    if (id) {
      let params = {
        filter: JSON.stringify({ healthFacilityId: id }),
        range: JSON.stringify([0, PAGE_SIZE]),
        sort: JSON.stringify(['createdAt', 'DESC']),
      };
      setLoading(true);
      dispatch({
        type: 'healthFacilitySpecialist/fetch',
        payload: params,
        callback: (res) => {
          setLoading(false);
          if (res?.success) {
            const { list } = res?.results;
            const { pagination } = res?.results;
            setData(list);
            setPagination(pagination);
          }
        },
      });
    } else {
      setData([]);
      setPagination([]);
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
      type: 'healthFacilitySpecialist/fetch',
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
  const deleteRecord = (id) => {
    dispatch({
      type: 'healthFacilitySpecialist/delete',
      payload: {
        id: id,
      },
      callback: (res) => {
        if (res?.success === true) {
          openNotification(
            'success',
            intl.formatMessage({ id: 'app.common.delete.success' }),
            '#f6ffed'
          );
          getSpecialist(dataEdit?.id);
        } else if (res?.success === false) {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };
  const columns = [
    {
      dataIndex: null,
      title: intl.formatMessage({ id: 'app.table.column.no' }),
      align: 'center',
      width: isMobile ? 50 : '5%',
      render: (text, record, index) =>
        formatNumber(
          index + (pagination.current - 1) * pagination.pageSize + 1
        ),
      fixed: isMobile,
    },
    {
      dataIndex: 'specialistName',
      name: 'specialistName',
      width: isMobile ? 250 : '50%',
      title: <FormattedMessage id="app.specialist.list.col0" />,
      align: 'left',
      sorter: () => {},
      fixed: isMobile,
    },
    {
      dataIndex: null,
      title: intl.formatMessage({ id: 'app.common.action' }),
      align: 'center',
      width: !isMobile ? '15%' : 170,
      render: (cell, row) => (
        <React.Fragment>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip
              title={
                !isMobile && intl.formatMessage({ id: 'app.tooltip.remove' })
              }
            >
              <Popconfirm
                placement="bottom"
                title={<FormattedMessage id="app.confirm.remove" />}
                onConfirm={() =>
                  deleteRecord(
                    row?.healthFacilities?.[0]?.healthFacilitySpecialists?.id
                  )
                }
              >
                <Button
                  icon={
                    <i
                      className="fas fa-trash"
                      style={{ marginRight: '5px' }}
                    />
                  }
                  className="btn_edit"
                  type="ghost"
                  shape="circle"
                  style={{ marginLeft: '5px' }}
                >
                  <FormattedMessage id="app.tooltip.remove" />
                </Button>
              </Popconfirm>
            </Tooltip>
          </div>
        </React.Fragment>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Modal
        width={isMobile ? '100%' : '70%'}
        style={{
          top: isMobile ? 0 : 30,
          margin: '0 auto',
        }}
        bodyStyle={{
          minHeight: '70vh',
          padding: '0px 0px 10px',
          background: '#F4F4F4',
        }}
        confirmLoading={loading}
        onCancel={() => changeModal('close')}
        visible={visibleModal}
        footer={null}
      >
        <PageHeader
          title={titleModal}
          extra={[
            <Tooltip
              title={
                <p
                  style={{
                    fontWeight: '600',
                    fontSize: 18,
                    textTransform: 'uppercase',
                  }}
                >
                  {!isMobile &&
                    intl.formatMessage({
                      id: 'app.specialist.create.header',
                    })}
                </p>
              }
            >
              <Button
                onClick={() => setVisibleAddSpecialist(!visibleAddSpecialist)}
                style={{ marginRight: 30 }}
                icon={
                  <i className="fas fa-plus" style={{ marginRight: '5px' }} />
                }
                type="primary"
              >
                Thêm mới
              </Button>
            </Tooltip>,
          ]}
        >
          <Spin spinning={loading}>
            <Card
              bordered={false}
              style={{ boxShadow: '0px 0px 5px #00000029' }}
              bodyStyle={{ padding: '10px 10px 20px 10px', minHeight: '70vh' }}
            >
              <Table
                loading={loading}
                rowKey="id"
                dataSource={data}
                pagination={pagination}
                scroll={{ x: isMobile ? 1200 : '100vh', y: '60vh' }}
                columns={columns}
                onChange={handleTableChange}
              />
            </Card>
          </Spin>
        </PageHeader>
      </Modal>
      <HealthFacilitySpeciaListAddModal
        intl={intl}
        isMobile={isMobile}
        specialistData={data}
        healthFacilityId={dataEdit?.id}
        visible={visibleAddSpecialist}
        getList={getSpecialist}
      />
    </React.Fragment>
  );
};

export default HealthFacilitySpeciaListModal;
