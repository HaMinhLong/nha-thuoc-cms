import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Modal,
  Dropdown,
  Menu,
  notification,
  Tooltip,
  Popconfirm,
  Result,
} from 'antd';
import { Link } from 'react-router-dom';
import HeaderContent from '../../layouts/HeaderContent';
import Table from '../../components/Table';
import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
  healthFacility,
  filter,
} from '../../features/healthFacility/healthFacilitySlice';
import '../../utils/css/styleList.scss';
import moment from 'moment';
import filterIcon from '../../static/web/images/filter.svg';
import dropdownWhite from '../../static/web/images/dropDown_white.svg';
import dropdownBlack from '../../static/web/images/dropDown_black.svg';
import { formatNumber } from '../../utils/utils';
import HealthFacilityModal from '../../components/ModalPage/HealthFacilityModal';
import { useParams } from 'react-router-dom';
import MedicalFacilityGroupSelect from '../../components/Common/MedicalFacilityGroupSelect.js';
import ProvinceSelect from '../../components/Common/ProvinceSelect';
import DistrictSelect from '../../components/Common/DistrictSelect';
import WardSelect from '../../components/Common/WardSelect';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const PAGE_SIZE = process.env.REACT_APP_PAGE_SIZE;
const HealthFacility = ({ isMobile, intl, headerPage }) => {
  let { id } = useParams();
  const userGroupId = localStorage.getItem('userGroupId');
  const dispatch = useDispatch();
  const list = useSelector(healthFacility);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    getList();
    getPermission();
  }, []);

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
        if (res && res.success) {
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
      filter: JSON.stringify({}),
      range: JSON.stringify([0, PAGE_SIZE]),
      sort: JSON.stringify(['createdAt', 'DESC']),
      attributes:
        'id,healthFacilityName,healthFacilityCode,taxCode,email,mobile,status,createdAt',
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
      type: 'healthFacility/fetch',
      payload: params,
      callback: (res) => {
        setLoading(false);
        if (res.success === false) {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const handleStatus = (value, row) => {
    const status = value;
    const item = {
      status,
    };
    dispatch({
      type: 'healthFacility/updateStatus',
      payload: {
        id: row.id,
        params: item,
      },
      callback: (res) => {
        if (res && res.success === true) {
          openNotification(
            'success',
            intl.formatMessage({ id: 'app.common.edit.success' }),
            '#f6ffed'
          );
          getList();
        } else if (res && res.success === false) {
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
      healthFacilityName:
        queryFilter.healthFacilityName && queryFilter.healthFacilityName.trim(),
      healthFacilityCode:
        queryFilter.healthFacilityCode && queryFilter.healthFacilityCode.trim(),
      mobile: queryFilter && queryFilter.mobile,
      provinceId: queryFilter && queryFilter.provinceId,
      districtId: queryFilter && queryFilter.districtId,
      wardId: queryFilter && queryFilter.wardId,
      medicalFacilityGroupId: queryFilter && queryFilter.medicalFacilityGroupId,
      status: queryFilter && queryFilter.status,
      fromDate: fromDate,
      toDate: toDate,
    };
    if (
      !(queryFilter.healthFacilityName && queryFilter.healthFacilityName.trim())
    ) {
      delete queryName.healthFacilityName;
    }
    if (
      !(queryFilter.healthFacilityCode && queryFilter.healthFacilityCode.trim())
    ) {
      delete queryName.healthFacilityCode;
    }
    if (!queryFilter.mobile) {
      delete queryName.mobile;
    }
    if (!queryFilter.provinceId) {
      delete queryName.provinceId;
    }
    if (!queryFilter.districtId) {
      delete queryName.districtId;
    }
    if (!queryFilter.wardId) {
      delete queryName.wardId;
    }
    if (!queryFilter.medicalFacilityGroupId) {
      delete queryName.medicalFacilityGroupId;
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
      attributes:
        'id,healthFacilityName,healthFacilityCode,taxCode,email,mobile,status,createdAt',
    };
    dispatch(filter(queryFilter));
    dispatch({
      type: 'healthFacility/fetch',
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
      healthFacilityName:
        values.healthFacilityName && values.healthFacilityName.trim(),
      healthFacilityCode:
        values.healthFacilityCode && values.healthFacilityCode.trim(),
      mobile: values && values.mobile,
      provinceId: values && values.provinceId,
      districtId: values && values.districtId,
      wardId: values && values.wardId,
      medicalFacilityGroupId: values && values.medicalFacilityGroupId,
      status: values && values.status,
      fromDate: fromDate,
      toDate: toDate,
    };
    if (!(values.healthFacilityName && values.healthFacilityName.trim())) {
      delete queryName.healthFacilityName;
    }
    if (!(values.healthFacilityCode && values.healthFacilityCode.trim())) {
      delete queryName.healthFacilityCode;
    }
    if (!values.mobile) {
      delete queryName.mobile;
    }
    if (!values.provinceId) {
      delete queryName.provinceId;
    }
    if (!values.districtId) {
      delete queryName.districtId;
    }
    if (!values.wardId) {
      delete queryName.wardId;
    }
    if (!values.medicalFacilityGroupId) {
      delete queryName.medicalFacilityGroupId;
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
      range: JSON.stringify([0, PAGE_SIZE]),
      sort: JSON.stringify(['createdAt', 'DESC']),
      attributes:
        'id,healthFacilityName,healthFacilityCode,taxCode,email,mobile,status,createdAt',
    };
    dispatch(filter(values));
    dispatch({
      type: 'healthFacility/fetch',
      payload: query,
      callback: (res) => {
        setLoading(false);
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
          healthFacilityName: filter.healthFacilityName || '',
          healthFacilityCode: filter.healthFacilityCode || '',
          mobile: filter.mobile || '',
          provinceId: filter.provinceId || '',
          districtId: filter.districtId || '',
          wardId: filter.wardId || '',
          medicalFacilityGroupId: filter.medicalFacilityGroupId || '',
          status: filter.status || undefined,
          dateCreated: filter.dateCreated || [],
        }}
      >
        <Row gutter={{ md: 0, lg: 8, xl: 16 }}>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="healthFacilityName"
              label={<FormattedMessage id="app.healthFacility.list.col1" />}
              {...formItemLayout}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'app.healthFacility.search.col0',
                })}
                size="small"
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="healthFacilityCode"
              label={<FormattedMessage id="app.healthFacility.list.col2" />}
              {...formItemLayout}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'app.healthFacility.search.col0',
                })}
                size="small"
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="mobile"
              label={<FormattedMessage id="app.healthFacility.list.col4" />}
              {...formItemLayout}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'app.healthFacility.search.col2',
                })}
                size="small"
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="medicalFacilityGroupId"
              label={<FormattedMessage id="app.healthFacility.list.col10" />}
              {...formItemLayout}
            >
              <MedicalFacilityGroupSelect
                placeholder={intl.formatMessage({
                  id: 'app.healthFacility.search.col6',
                })}
                allowClear
                size="small"
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="provinceId"
              label={<FormattedMessage id="app.healthFacility.list.col6" />}
              {...formItemLayout}
            >
              <ProvinceSelect
                placeholder={intl.formatMessage({
                  id: 'app.healthFacility.search.col3',
                })}
                allowClear
                size="small"
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.provinceId !== currentValues.provinceId
              }
              noStyle
            >
              {({ getFieldValue }) => (
                <FormItem
                  name="districtId"
                  label={<FormattedMessage id="app.healthFacility.list.col7" />}
                  {...formItemLayout}
                >
                  <DistrictSelect
                    placeholder={intl.formatMessage({
                      id: 'app.healthFacility.search.col4',
                    })}
                    filter
                    filterField={getFieldValue('provinceId') || 'a'}
                    allowClear
                    size="small"
                  />
                </FormItem>
              )}
            </FormItem>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              shouldUpdate={(prevValues, currentValues) =>
                prevValues.districtId !== currentValues.districtId
              }
              noStyle
            >
              {({ getFieldValue }) => (
                <FormItem
                  name="wardId"
                  label={<FormattedMessage id="app.healthFacility.list.col8" />}
                  {...formItemLayout}
                >
                  <WardSelect
                    placeholder={intl.formatMessage({
                      id: 'app.healthFacility.search.col5',
                    })}
                    filter
                    filterField={getFieldValue('districtId') || 'a'}
                    allowClear
                    size="small"
                  />
                </FormItem>
              )}
            </FormItem>
          </Col>
          <Col xl={8} md={12} xs={24}>
            <FormItem
              name="status"
              label={<FormattedMessage id="app.search.status" />}
              {...formItemLayout}
            >
              <Select
                allowClear
                placeholder={intl.formatMessage({
                  id: 'app.common.status.placeholder',
                })}
                size="small"
              >
                <Select.Option key={1}>
                  {intl.formatMessage({ id: 'app.common.statusTag.1' })}
                </Select.Option>
                <Select.Option key={0}>
                  {intl.formatMessage({ id: 'app.common.statusTag.0' })}
                </Select.Option>
                <Select.Option key={-1}>
                  {intl.formatMessage({ id: 'app.common.statusTag.-1' })}
                </Select.Option>
              </Select>
            </FormItem>
          </Col>
          <Col xl={6} md={12} xs={24}>
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
            xl={2}
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

  const deleteRecord = (id) => {
    dispatch({
      type: 'healthFacility/delete',
      payload: {
        id: id,
      },
      callback: (res) => {
        if (res && res.success === true) {
          openNotification(
            'success',
            intl.formatMessage({ id: 'app.common.delete.success' }),
            '#f6ffed'
          );
          getList();
        } else if (res && res.success === false) {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const renderStatusButton = (cell, row) => {
    const menuStatus = [
      {
        status: 1,
        name: intl.formatMessage({ id: 'app.common.statusTag.1' }),
      },
      {
        status: 0,
        name: intl.formatMessage({ id: 'app.common.statusTag.0' }),
      },
      {
        status: -1,
        name: intl.formatMessage({ id: 'app.common.statusTag.-1' }),
      },
    ];

    const statusList = menuStatus.filter((x) => x.status !== cell);

    const menu = (
      <Menu className="menu_icon">
        {statusList &&
          statusList.length > 0 &&
          statusList.map((item) => {
            if (item.status === 1)
              return (
                <Menu.Item
                  key={item.status}
                  onClick={() => handleStatus(item.status, row)}
                >
                  <div>{item.name}</div>
                </Menu.Item>
              );
            if (item.status === 0)
              return (
                permissions.isBlock && (
                  <Menu.Item
                    key={item.status}
                    onClick={() => handleStatus(item.status, row)}
                  >
                    <div>{item.name}</div>
                  </Menu.Item>
                )
              );
            if (item.status === -1)
              return (
                permissions.isDelete && (
                  <Menu.Item
                    key={item.status}
                    onClick={() => handleStatus(item.status, row)}
                  >
                    <div>{item.name}</div>
                  </Menu.Item>
                )
              );

            return (
              <Menu.Item
                key={item.status}
                onClick={() => handleStatus(item.status, row)}
              >
                <div>{item.name}</div>
              </Menu.Item>
            );
          })}
      </Menu>
    );

    let btn = (
      <Button className="btn_status1">
        {intl.formatMessage({ id: 'app.common.statusTag.1' })}
        <img src={dropdownWhite} alt="icon drop down" />
      </Button>
    );
    if (cell === 0) {
      btn = (
        <Button className="btn_status0">
          {intl.formatMessage({ id: 'app.common.statusTag.0' })}
          <img src={dropdownBlack} alt="icon drop down" />
        </Button>
      );
    } else if (cell === -1) {
      btn = (
        <Button className="btn_statusAn">
          {intl.formatMessage({ id: 'app.common.statusTag.-1' })}
          <img src={dropdownBlack} alt="icon drop down" />
        </Button>
      );
    }

    return (
      <Dropdown
        overlay={menu}
        trigger={['click']}
        placement="bottomCenter"
        arrow
        className="dropDownCustom"
      >
        {btn}
      </Dropdown>
    );
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
      dataIndex: 'healthFacilityName',
      name: 'healthFacilityName',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.healthFacility.list.col1" />,
      align: 'left',
      sorter: () => {},
      fixed: isMobile,
    },
    {
      dataIndex: 'healthFacilityCode',
      name: 'healthFacilityCode',
      width: isMobile ? 150 : '10%',
      title: <FormattedMessage id="app.healthFacility.list.col2" />,
      align: 'center',
      sorter: () => {},
    },
    {
      dataIndex: 'mobile',
      name: 'mobile',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.healthFacility.list.col4" />,
      align: 'center',
      sorter: () => {},
    },
    {
      dataIndex: 'province',
      name: 'province',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.healthFacility.list.col6" />,
      align: 'center',
      sorter: () => {},
      render: (cell) => <span>{cell.provinceName}</span>,
    },
    {
      dataIndex: 'district',
      name: 'district',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.healthFacility.list.col7" />,
      align: 'center',
      sorter: () => {},
      render: (cell) => <span>{cell.districtName}</span>,
    },
    {
      dataIndex: 'ward',
      name: 'ward',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.healthFacility.list.col8" />,
      align: 'center',
      sorter: () => {},
      render: (cell) => <span>{cell.wardName}</span>,
    },
    {
      dataIndex: 'status',
      name: 'status',
      title: <FormattedMessage id="app.healthFacility.list.col13" />,
      align: 'center',
      width: !isMobile ? '12%' : 170,
      sorter: () => {},
      render: (cell, row) => (
        <React.Fragment>{renderStatusButton(cell, row)}</React.Fragment>
      ),
    },
    {
      dataIndex: null,
      title: intl.formatMessage({ id: 'app.common.action' }),
      align: 'center',
      width: !isMobile ? '15%' : 170,
      render: (cell, row) => (
        <React.Fragment>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {permissions.isUpdate && (
              <Tooltip
                title={
                  !isMobile && intl.formatMessage({ id: 'app.tooltip.edit' })
                }
              >
                <Button
                  onClick={() => {
                    setVisibleModal(!visibleModal);
                    setDataEdit(row);
                  }}
                  icon={
                    <i className="fas fa-pen" style={{ marginRight: '5px' }} />
                  }
                  className="btn_edit"
                  type="ghost"
                  shape="circle"
                >
                  <FormattedMessage id="app.tooltip.edit" />
                </Button>
              </Tooltip>
            )}
            {permissions.isDelete && (
              <Tooltip
                title={
                  !isMobile && intl.formatMessage({ id: 'app.tooltip.remove' })
                }
              >
                <Popconfirm
                  placement="bottom"
                  title={<FormattedMessage id="app.confirm.remove" />}
                  onConfirm={() => deleteRecord(row.id)}
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
            )}
            <Dropdown
              overlay={
                <Menu className="menu_icon">
                  <Menu.Item key="1">Cập nhật lịch làm việc</Menu.Item>
                  <Menu.Item key="2">Cập nhật chuyên khoa</Menu.Item>
                </Menu>
              }
              trigger={['click']}
              placement="bottomCenter"
              arrow
              className="dropDownCustomV2"
            >
              <Button className="btn_edit" shape="circle">
                Khác
                <i
                  className="fas fa-caret-down"
                  style={{ marginLeft: '5px', fontSize: '16px' }}
                />
              </Button>
            </Dropdown>
          </div>
        </React.Fragment>
      ),
    },
  ];

  return (
    <>
      {permissions ? (
        <>
          {headerPage}
          <HeaderContent
            title={<FormattedMessage id="app.healthFacility.list.header" />}
            action={
              <React.Fragment>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  {permissions.isAdd && (
                    <Tooltip
                      title={
                        !isMobile &&
                        intl.formatMessage({
                          id: 'app.healthFacility.create.header',
                        })
                      }
                    >
                      <Button
                        style={{ marginLeft: 10 }}
                        icon={
                          <i
                            className="fas fa-plus"
                            style={{ marginRight: '5px' }}
                          />
                        }
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
                </div>
              </React.Fragment>
            }
          >
            <div className="tableListForm">{renderForm()}</div>
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
              <Link to="/">Back Home</Link>
            </Button>
          }
        />
      )}
      <HealthFacilityModal
        intl={intl}
        isMobile={isMobile}
        visible={visibleModal}
        titleDrawer={intl.formatMessage({
          id: 'app.healthFacility.list.title',
        })}
        dataEdit={dataEdit}
        getList={getList}
      />
    </>
  );
};

export default HealthFacility;
