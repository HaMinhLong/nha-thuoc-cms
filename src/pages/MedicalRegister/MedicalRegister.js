import React, { Fragment, useState, useEffect } from 'react';
import { CaretDownOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Modal,
  Tag,
  notification,
  Tooltip,
  Result,
  Menu,
  Dropdown,
} from 'antd';
import { Link } from 'react-router-dom';
import HeaderContent from '../../layouts/HeaderContent';
import Table from '../../components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  medicalRegister,
  filter,
} from '../../features/medicalRegister/medicalRegisterSlice';
import '../../utils/css/styleList.scss';
import moment from 'moment';
import filterIcon from '../../static/web/images/filter.svg';
import { formatNumber } from '../../utils/utils';
import { Redirect } from 'react-router-dom';
import DoctorSelect from '../../components/Common/DoctorSelect';
import MedicalRegisterModal from '../../components/ModalPage/MedicalRegisterModal';
import ClinicReceiptModal from '../../components/ModalPage/ClinicReceiptModal';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const MedicalRegister = ({ isMobile, intl, headerPage }) => {
  let { id } = useParams();
  const userGroupId = localStorage.getItem('userGroupId');
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const dispatch = useDispatch();
  const list = useSelector(medicalRegister);
  const [loading, setLoading] = useState(false);
  const [dataGroupByList, setDataGroupByList] = useState([]);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [redirect, setRedirect] = useState('');
  const [permissions, setPermissions] = useState({});
  const [visibleClinicReceipt, setVisibleClinicReceipt] = useState(false);
  const [dataEditClinicReceiptServices, setDataEditClinicReceiptServices] =
    useState([]);
  const [dataClinicRegister, setDataClinicRegister] = useState({});
  const [dataClinicReceipt, setDataClinicReceipt] = useState({});

  useEffect(() => {
    getPermission();
    getList();
  }, []);

  if (redirect) {
    return <Redirect to={redirect} />;
  }
  const getPermission = () => {
    const params = {
      filter: JSON.stringify({ userGroupId: userGroupId }),
    };
    dispatch({
      type: 'userGroupRole/getOne',
      payload: {
        id: id,
        params: params,
      },
      callback: (res) => {
        if (res?.success) {
          const { list } = res.results;
          setPermissions(list);
        } else {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const getList = () => {
    const { query } = list;
    const queryFilter = list.filter;
    setLoading(true);
    let params = {
      filter: JSON.stringify({ healthFacilityId: healthFacilityId }),
      range: JSON.stringify([0, 100]),
      sort: JSON.stringify(['createdAt', 'DESC']),
      attributes: '',
    };
    let values = {};
    if (query && query.filter && query.filter !== '{}') {
      params = {
        ...params,
        filter: query.filter,
      };
      values = queryFilter;
    }
    if (query && query.range && query.range !== '{}') {
      params = {
        ...params,
        range: query.range,
      };
      values = queryFilter;
    }
    if (query && query.sort && query.sort !== '{}') {
      params = {
        ...params,
        sort: query.sort,
      };
      values = queryFilter;
    }
    dispatch(filter(values));
    dispatch({
      type: 'medicalRegister/fetch',
      payload: params,
      callback: (res) => {
        setLoading(false);
        setDataGroupByList(res?.results?.pagination?.dataGroupByList);
        if (res.success === false) {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const queryFilter = list.filter;
    const rangeValue = queryFilter.dateCreated || [];
    const fromDate =
      rangeValue.length > 0
        ? rangeValue[0].set({ hour: 0, minute: 0, second: 0 })
        : '';
    const toDate =
      rangeValue.length > 0
        ? rangeValue[1].set({ hour: 23, minute: 59, second: 59 })
        : '';
    const queryName = {
      customerName: queryFilter.customerName && queryFilter.customerName.trim(),
      mobile: queryFilter && queryFilter.mobile,
      userId: queryFilter && queryFilter.userId,
      status: queryFilter && queryFilter.status,
      fromDate: fromDate,
      toDate: toDate,
      healthFacilityId,
    };
    if (!(queryFilter.customerName && queryFilter.customerName.trim())) {
      delete queryName.customerName;
    }
    if (!queryFilter.mobile) {
      delete queryName.mobile;
    }
    if (!queryFilter.userId) {
      delete queryName.userId;
    }
    if (!queryFilter.status) {
      delete queryName.status;
    }
    if (rangeValue.length === 0) {
      delete queryName.fromDate;
      delete queryName.toDate;
    }
    const sort = [
      (sorter && sorter.column && sorter.column.name) || 'createdAt',
      sorter && sorter.order === 'descend' ? 'ASC' : 'DESC',
    ];
    const query = {
      filter: JSON.stringify(queryName),
      range: JSON.stringify([
        pagination.current * pagination.pageSize - pagination.pageSize,
        pagination.current * pagination.pageSize,
      ]),
      sort: JSON.stringify(sort),
      attributes: '',
    };
    dispatch(filter(queryFilter));
    dispatch({
      type: 'medicalRegister/fetch',
      payload: query,
      callback: (res) => {
        setLoading(false);
      },
    });
  };

  const handleSearch = (values) => {
    setLoading(true);
    const rangeValue = values.dateCreated || [];
    const fromDate =
      rangeValue.length > 0
        ? rangeValue[0].set({ hour: 0, minute: 0, second: 0 })
        : '';
    const toDate =
      rangeValue.length > 0
        ? rangeValue[1].set({ hour: 23, minute: 59, second: 59 })
        : '';
    const queryName = {
      customerName: values.customerName && values.customerName.trim(),
      mobile: values && values.mobile,
      userId: values && values.userId,
      status: values && values.status,
      fromDate: fromDate,
      toDate: toDate,
      healthFacilityId,
    };
    if (!(values.customerName && values.customerName.trim())) {
      delete queryName.customerName;
    }
    if (!values.mobile) {
      delete queryName.mobile;
    }
    if (!values.userId) {
      delete queryName.userId;
    }
    if (!values.status) {
      delete queryName.status;
    }
    if (rangeValue.length === 0) {
      delete queryName.fromDate;
      delete queryName.toDate;
    }
    const query = {
      filter: JSON.stringify(queryName),
      range: JSON.stringify([0, 100]),
      sort: JSON.stringify(['createdAt', 'DESC']),
      attributes: '',
    };
    dispatch(filter(values));
    dispatch({
      type: 'medicalRegister/fetch',
      payload: query,
      callback: (res) => {
        setLoading(false);
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

  const deleteRecord = (item) => {
    const itemTime = {
      isClose: false,
    };
    dispatch({
      type: 'clinicTime/updateStatus',
      payload: {
        id: item.clinicTimeId,
        params: itemTime,
      },
    });
    dispatch({
      type: 'medicalRegister/delete',
      payload: {
        id: item.id,
      },
      callback: (res) => {
        if (res?.success === true) {
          openNotification(
            'success',
            intl.formatMessage({ id: 'app.common.delete.success' }),
            '#f6ffed'
          );
          getList();
        } else if (res?.success === false) {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const renderForm = () => {
    const queryFilter = list.filter;
    let filter = {};
    if (queryFilter && queryFilter !== '{}') {
      filter = queryFilter;
    }
    const formItemLayout = {
      labelCol: {
        ss: { span: 7 },
        sm: { span: 7 },
        md: { span: 7 },
        lg: { span: 7 },
        xl: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 17 },
        sm: { span: 17 },
        md: { span: 17 },
        lg: { span: 17 },
        xl: { span: 17 },
      },
      style: { marginBottom: 0 },
      labelAlign: 'left',
    };
    return (
      <Form
        onFinish={handleSearch}
        initialValues={{
          customerName: filter.customerName || '',
          mobile: filter.mobile || '',
          userId: filter.userId || undefined,
          status: filter.status || undefined,
          dateCreated: filter.dateCreated || [],
        }}
      >
        <Row gutter={{ md: 0, lg: 8, xl: 16 }}>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="customerName"
              label={<FormattedMessage id="app.medicalRegister.list.col4" />}
              {...formItemLayout}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'app.medicalRegister.search.col0',
                })}
                size="small"
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="mobile"
              label={<FormattedMessage id="app.medicalRegister.list.col3" />}
              {...formItemLayout}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'app.medicalRegister.search.col1',
                })}
                size="small"
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="userId"
              label={<FormattedMessage id="app.medicalRegister.list.col7" />}
              {...formItemLayout}
            >
              <DoctorSelect
                placeholder={intl.formatMessage({
                  id: 'app.medicalRegister.search.col2',
                })}
                isMobile={isMobile}
                intl={intl}
                allowClear
                size="small"
              />
            </FormItem>
          </Col>
          <Col xl={8} md={12} xs={24}>
            <FormItem
              name="status"
              label={<FormattedMessage id="app.medicalRegister.list.col9" />}
              {...formItemLayout}
            >
              <Select
                allowClear
                placeholder={intl.formatMessage({
                  id: 'app.common.status.placeholder',
                })}
                size="small"
              >
                <Select.Option key={0}>
                  {intl.formatMessage({ id: 'app.medicalRegister.list.col10' })}
                </Select.Option>
                <Select.Option key={1}>
                  {intl.formatMessage({ id: 'app.medicalRegister.list.col11' })}
                </Select.Option>
                <Select.Option key={2}>
                  {intl.formatMessage({ id: 'app.medicalRegister.list.col12' })}
                </Select.Option>
                <Select.Option key={3}>
                  {intl.formatMessage({ id: 'app.medicalRegister.list.col13' })}
                </Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col xl={8} md={12} xs={24}>
            <FormItem
              name="dateCreated"
              label={
                <FormattedMessage id="app.common.placeholder.dateCreated" />
              }
              {...formItemLayout}
            >
              <RangePicker
                style={{ width: '100%' }}
                placeholder={[
                  intl.formatMessage({
                    id: 'app.common.placeholder.rangepicker.0',
                  }),
                  intl.formatMessage({
                    id: 'app.common.placeholder.rangepicker.1',
                  }),
                ]}
                format={['DD/MM/YYYY', 'DD/MM/YYYY']}
                ranges={{
                  Today: [moment(), moment()],
                }}
                size="small"
              />
            </FormItem>
          </Col>
          <Col
            xl={8}
            md={12}
            xs={24}
            style={
              isMobile
                ? {
                    display: ' flex',
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                  }
                : {
                    display: ' flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }
            }
          >
            <Button type="primary" htmlType="submit" className="buttonSubmit">
              <i className="fa fa-search" />
              &nbsp;
              <FormattedMessage id="app.search.button" />
            </Button>
          </Col>
        </Row>
      </Form>
    );
  };

  const handleButton = (cell, row) => {
    const menu = (
      <Menu className="menu_icon">
        {permissions.isResult && row.status !== 0 && (
          <Menu.Item key="1">
            {intl.formatMessage({ id: 'app.medicalRegister.list.col15' })}
          </Menu.Item>
        )}
        {permissions.isUpdate && row.status === 0 && (
          <Menu.Item
            key="2"
            onClick={() => {
              setDataClinicRegister(row);
              setDataClinicReceipt({});

              setDataEditClinicReceiptServices([
                {
                  id: row?.clinicService?.id,
                  clinicTypeId:
                    row?.clinicService?.clinicServicePackage?.clinicType?.id,
                  clinicTypeName:
                    row?.clinicService?.clinicServicePackage?.clinicType
                      ?.clinicTypeName,
                  clinicServicePackageId:
                    row?.clinicService?.clinicServicePackage?.id,
                  clinicServiceId: row?.clinicService?.id,
                  clinicServiceName: row?.clinicService?.clinicServiceName,
                  userId: row?.userId,
                  price: Number(row?.clinicService?.price),
                  amount: 1,
                  total: Number(row?.clinicService?.price),
                  discount: 0,
                  discountType: 1,
                  tax: 0,
                  taxType: 1,
                  flag: -1,
                },
              ]);
              setVisibleClinicReceipt(!visibleClinicReceipt);
            }}
          >
            {intl.formatMessage({ id: 'app.medicalRegister.list.col16' })}
          </Menu.Item>
        )}
        {permissions.isUpdate && row.status !== 0 && (
          <Menu.Item
            key="3"
            onClick={() => {
              setDataClinicRegister(row);
              setDataClinicReceipt({ id: row?.clinicReceipts?.[0].id });
              setDataEditClinicReceiptServices([
                {
                  id: row?.clinicService?.id,
                  clinicTypeId:
                    row?.clinicService?.clinicServicePackage?.clinicType?.id,
                  clinicTypeName:
                    row?.clinicService?.clinicServicePackage?.clinicType
                      ?.clinicTypeName,
                  clinicServicePackageId:
                    row?.clinicService?.clinicServicePackage?.id,
                  clinicServiceId: row?.clinicService?.id,
                  clinicServiceName: row?.clinicService?.clinicServiceName,
                  userId: row?.userId,
                  price: Number(row?.clinicService?.price),
                  amount: 1,
                  total: Number(row?.clinicService?.price),
                  discount: 0,
                  discountType: 1,
                  tax: 0,
                  taxType: 1,
                  flag: 1,
                },
              ]);
              setVisibleClinicReceipt(!visibleClinicReceipt);
            }}
          >
            {intl.formatMessage({ id: 'app.medicalRegister.list.col17' })}
          </Menu.Item>
        )}
      </Menu>
    );

    return (
      <>
        {permissions.isUpdate && (
          <Tooltip
            title={!isMobile && intl.formatMessage({ id: 'app.tooltip.edit' })}
          >
            <Button
              onClick={() => {
                setVisibleModal(!visibleModal);
                setDataEdit(row);
              }}
              icon={<i className="fas fa-pen" style={{ marginRight: '5px' }} />}
              className="btn_edit"
              type="ghost"
              shape="circle"
              style={{ marginRight: 8 }}
            >
              <FormattedMessage id="app.tooltip.edit" />
            </Button>
          </Tooltip>
        )}
        <Dropdown
          overlay={menu}
          trigger={['click']}
          placement="bottomLeft"
          arrow
        >
          <Button className="btn_edit" shape="circle">
            Khác
            <i
              className="fas fa-caret-down"
              style={{ marginLeft: '5px', fontSize: '16px' }}
            />
          </Button>
        </Dropdown>
      </>
    );
  };

  // Xử lý tên trạng thái
  const renderChangeStatus = (activeTab) => {
    // log('activeTab', activeTab);
    const label = {
      status: '',
      receipt: '',
    };
    if (activeTab === '0') {
      label.status = intl.formatMessage({
        id: 'app.medicalRegister.list.col10',
      });
      label.type = 'error';
      label.color = '#f5222d';
    }
    if (activeTab === '1') {
      label.status = intl.formatMessage({
        id: 'app.medicalRegister.list.col11',
      });
      label.type = 'warning';
      label.color = '#fa8c16';
    }
    if (activeTab === '2') {
      label.status = intl.formatMessage({
        id: 'app.medicalRegister.list.col12',
      });
      label.type = 'processing';
      label.color = '#1890ff';
    }
    if (activeTab === '3') {
      label.status = intl.formatMessage({
        id: 'app.medicalRegister.list.col13',
      });
      label.type = 'success';
      label.color = '#52c41a';
    }
    return label;
  };

  const data = (list.data && list.data.list) || [];
  const pagination = (list.data && list.data.pagination) || [];

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
      dataIndex: 'customer',
      name: 'customer',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.medicalRegister.list.col4" />,
      align: 'left',
      sorter: () => {},
      fixed: isMobile,
      render: (cell) => <span>{cell?.customerName}</span>,
    },
    {
      dataIndex: 'customer',
      name: 'customer',
      width: isMobile ? 150 : '10%',
      title: <FormattedMessage id="app.medicalRegister.list.col3" />,
      align: 'center',
      sorter: () => {},
      render: (cell) => <span>{cell?.mobile}</span>,
    },
    {
      dataIndex: 'clinicService',
      name: 'clinicService',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.medicalRegister.list.col1" />,
      align: 'center',
      sorter: () => {},
      render: (cell) => <span>{cell?.clinicServiceName}</span>,
    },
    {
      dataIndex: 'user',
      name: 'user',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.medicalRegister.list.col7" />,
      align: 'center',
      sorter: () => {},
      render: (cell) => <span>{cell?.fullName}</span>,
    },
    {
      dataIndex: 'createdAt',
      title: intl.formatMessage({ id: 'app.common.placeholder.dateCreated' }),
      align: 'center',
      width: !isMobile && '9%',
      sorter: () => {},
      render: (cell) => (
        <React.Fragment>
          {moment(cell && cell).format('HH:mm DD/MM/YYYY')}
        </React.Fragment>
      ),
    },
    {
      dataIndex: 'status',
      name: 'status',
      title: <FormattedMessage id="app.medicalRegister.list.col9" />,
      align: 'center',
      width: !isMobile ? '9%' : 170,
      sorter: () => {},
      render: (cell, row) => {
        const label = renderChangeStatus(cell.toString());
        return (
          <React.Fragment>
            <Tag color={label.type} style={{ width: '80%' }}>
              {label.status}
            </Tag>
          </React.Fragment>
        );
      },
    },
    {
      dataIndex: null,
      title: intl.formatMessage({ id: 'app.common.action' }),
      align: 'center',
      width: !isMobile ? '15%' : 170,
      render: (cell, row) => (
        <React.Fragment>{handleButton(cell, row)}</React.Fragment>
      ),
    },
  ];

  return (
    <Fragment>
      {permissions ? (
        <>
          {headerPage}
          <HeaderContent
            title={<FormattedMessage id="app.medicalRegister.list.header" />}
            action={
              <React.Fragment>
                {permissions.isAdd && (
                  <Tooltip
                    title={
                      !isMobile &&
                      intl.formatMessage({
                        id: 'app.medicalRegister.create.header',
                      })
                    }
                  >
                    <Button
                      icon={
                        <i
                          className="fas fa-plus"
                          style={{ marginRight: '5px' }}
                        />
                      }
                      className="buttonThemMoi"
                      onClick={() => {
                        setVisibleModal(!visibleModal);
                        setDataEdit({});
                      }}
                    >
                      {intl.formatMessage(
                        { id: 'app.title.create' },
                        { name: '(F2)' }
                      )}
                    </Button>
                  </Tooltip>
                )}
              </React.Fragment>
            }
          >
            <Row>
              <Col
                md={dataGroupByList && dataGroupByList.length > 0 ? 18 : 24}
                xs={0}
              >
                <div className="tableListForm">{renderForm()}</div>
              </Col>
              {dataGroupByList && dataGroupByList.length > 0 && (
                <Col md={6} xs={24}>
                  <Row
                    gutter={10}
                    style={{
                      marginLeft: 'unset',
                      marginRight: 'unset',
                      padding: '0 5px',
                      borderBottom: '1px solid #00000033',
                      borderLeft: '1px solid #00000033',
                      height: '100%',
                      borderRadius: '4px 4px 0 0',
                    }}
                  >
                    {dataGroupByList?.map((item) => {
                      const label = renderChangeStatus(item.status.toString());
                      return (
                        <React.Fragment key={item.status}>
                          <Col xl={12} xs={24}>
                            <span style={{ fontWeight: 500, fontSize: '14px' }}>
                              {label.status}:
                            </span>
                            <span
                              style={{
                                color: label.color,
                                fontSize: '16px',
                                fontWeight: 600,
                                cursor: 'pointer',
                              }}
                            >
                              &nbsp;{item.count}&nbsp;
                              <CaretDownOutlined
                                style={{ fontSize: '14px', marginTop: '10px' }}
                              />
                            </span>
                          </Col>
                        </React.Fragment>
                      );
                    })}
                  </Row>
                </Col>
              )}
            </Row>
            <div
              className="buttonModalFilter"
              onClick={() => setVisibleFilter(true)}
            >
              {intl.formatMessage({ id: 'app.common.searchBtn' })}&nbsp;
              <img width="25" height="25" src={filterIcon} alt="tìm kiếm" />
            </div>
            <Modal
              title={intl.formatMessage({ id: 'app.common.searchBtn' })}
              width="100%"
              style={{ top: 0 }}
              maskStyle={{
                background: '#fff',
              }}
              visible={visibleFilter}
              className="modalFilter"
              onCancel={() => setVisibleFilter(false)}
              footer={[]}
            >
              {renderForm()}
            </Modal>
            <Table
              loading={loading}
              rowKey="id"
              dataSource={data}
              pagination={pagination}
              scroll={{ x: isMobile ? 1200 : '100vh', y: '60vh' }}
              columns={columns}
              onChange={handleTableChange}
            />
          </HeaderContent>
        </>
      ) : (
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button type="primary">
              <Link to="/dashboard">Back Home</Link>
            </Button>
          }
        />
      )}
      <MedicalRegisterModal
        isMobile={isMobile}
        intl={intl}
        visible={visibleModal}
        getList={getList}
        dataEdit={dataEdit}
        titleModal={intl.formatMessage({
          id: 'app.medicalRegister.list.title',
        })}
      />
      <ClinicReceiptModal
        intl={intl}
        isMobile={isMobile}
        titleModal={intl.formatMessage({ id: 'app.clinicReceipt.list.title' })}
        visible={visibleClinicReceipt}
        dataClinicReceiptServices={dataEditClinicReceiptServices}
        dataClinicRegister={dataClinicRegister}
        getListMedicalRegister={getList}
        dataEdit={dataClinicReceipt}
      />
    </Fragment>
  );
};

export default MedicalRegister;
