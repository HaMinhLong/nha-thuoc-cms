import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Button,
  Modal,
  notification,
  Result,
} from 'antd';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import HeaderContent from '../../layouts/HeaderContent';
import Table from '../../components/Table';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import '../../utils/css/styleList.scss';
import moment from 'moment';
import filterIcon from '../../static/web/images/filter.svg';
import { formatNumber } from '../../utils/utils';
import { Redirect } from 'react-router-dom';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

const SupplierReport = ({ isMobile, intl, headerPage }) => {
  let { id } = useParams();
  const userGroupId = localStorage.getItem('userGroupId');
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [visibleFilter, setVisibleFilter] = useState(false);
  const [redirect, setRedirect] = useState('');
  const [data, setData] = useState([]);
  const [permissions, setPermissions] = useState({});

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
    setLoading(true);
    let params = {
      filter: JSON.stringify({ healthFacilityId: healthFacilityId }),
    };
    dispatch({
      type: 'medicineReport/supplierReport',
      payload: params,
      callback: (res) => {
        setLoading(false);
        if (res.success === false) {
          openNotification('error', res && res.message, '#fff1f0');
        } else {
          const { list } = res.results;
          setData(list);
        }
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
      supplierName: values.supplierName && values.supplierName.trim(),
      mobile: values.mobile,
      fromDate: fromDate,
      toDate: toDate,
      healthFacilityId,
    };
    if (!(values.supplierName && values.supplierName.trim())) {
      delete queryName.supplierName;
    }
    if (!values.mobile) {
      delete queryName.mobile;
    }
    if (rangeValue.length === 0) {
      delete queryName.fromDate;
      delete queryName.toDate;
    }
    const query = {
      filter: JSON.stringify(queryName),
    };
    dispatch({
      type: 'medicineReport/supplierReport',
      payload: query,
      callback: (res) => {
        setLoading(false);
        if (res?.success) {
          const { list } = res.results;
          setData(list);
        }
      },
    });
  };

  const renderForm = () => {
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
          supplierName: '',
          mobile: '',
          dateCreated: [],
        }}
      >
        <Row gutter={{ md: 0, lg: 8, xl: 16 }}>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="supplierName"
              label={<FormattedMessage id="app.supplierReport.list.col11" />}
              {...formItemLayout}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'app.supplierReport.search.col1',
                })}
                size="small"
              />
            </FormItem>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="mobile"
              label={<FormattedMessage id="app.supplierReport.list.col2" />}
              {...formItemLayout}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'app.supplierReport.search.col2',
                })}
                size="small"
              />
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

  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };

  let totalRevenue = 0;
  let total = 0;

  for (let index = 0; index < data.length; index++) {
    totalRevenue += data[index].totalRevenue;
    total += data[index].total;
  }

  if (data && data.length && data[data.length - 1].id !== '-1') {
    data.push({
      id: '-1',
      supplierName: intl.formatMessage({ id: 'app.supplierReport.list.col10' }),
      price: '',
      amount: '',
      discount: '',
      tax: '',
      discountType: 0,
      taxType: 0,
      totalRevenue: totalRevenue,
      total: total,
    });
  }

  const columns = [
    {
      dataIndex: null,
      title: intl.formatMessage({ id: 'app.table.column.no' }),
      align: 'center',
      width: isMobile ? 50 : '5%',
      render: (value, row, index) => {
        const obj = {
          children: (
            <p style={{ fontWeight: 600, marginBottom: 0 }}>Tổng cộng</p>
          ),
          props: {},
        };
        if (index === data.length - 1) {
          obj.props.colSpan = 4;
        } else {
          obj.props.colSpan = 1;
          obj.children = formatNumber(index + 1);
        }
        return obj;
      },
      fixed: isMobile,
    },
    {
      dataIndex: 'supplierName',
      name: 'supplierName',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.supplierReport.list.col1" />,
      align: 'left',
      sorter: () => {},
      fixed: isMobile,
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        if (index === data.length - 1) {
          obj.props.colSpan = 0;
        }
        return obj;
      },
    },
    {
      dataIndex: 'mobile',
      name: 'mobile',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.supplierReport.list.col2" />,
      align: 'left',
      sorter: () => {},
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        if (index === data.length - 1) {
          obj.props.colSpan = 0;
        }
        return obj;
      },
    },
    {
      dataIndex: 'medicineName',
      name: 'medicineName',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.supplierReport.list.col3" />,
      align: 'left',
      sorter: () => {},
      render: (value, row, index) => {
        const obj = {
          children: value,
          props: {},
        };
        if (index === data.length - 1) {
          obj.props.colSpan = 0;
        }
        return obj;
      },
    },
    {
      dataIndex: 'price',
      name: 'price',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.supplierReport.list.col4" />,
      align: 'left',
      sorter: () => {},
      render: (text) => <span>{formatNumber(text)}</span>,
    },
    {
      dataIndex: 'amount',
      name: 'amount',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.supplierReport.list.col5" />,
      align: 'left',
      sorter: () => {},
      render: (text) => <span>{formatNumber(text)}</span>,
    },
    {
      dataIndex: 'discount',
      name: 'discount',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.supplierReport.list.col6" />,
      align: 'left',
      sorter: () => {},
      render: (text, row) => (
        <span>
          {formatNumber(text || '')}{' '}
          {row?.discountType === 1 ? 'VNĐ' : row?.discountType !== 0 ? '%' : ''}
        </span>
      ),
    },
    {
      dataIndex: 'tax',
      name: 'tax',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.supplierReport.list.col7" />,
      align: 'left',
      sorter: () => {},
      render: (text, row) => (
        <span>
          {formatNumber(text || '')}{' '}
          {row?.taxType === 1 ? 'VNĐ' : row?.taxType !== 0 ? '%' : ''}
        </span>
      ),
    },
    {
      dataIndex: 'totalRevenue',
      name: 'totalRevenue',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.supplierReport.list.col8" />,
      align: 'left',
      sorter: () => {},
      render: (text) => <span>{formatNumber(text)}</span>,
    },
    {
      dataIndex: 'total',
      name: 'total',
      width: isMobile ? 150 : '15%',
      title: <FormattedMessage id="app.supplierReport.list.col9" />,
      align: 'left',
      sorter: () => {},
      render: (text) => <span>{formatNumber(text)}</span>,
    },
  ];

  return (
    <React.Fragment>
      {permissions ? (
        <>
          {headerPage}
          <HeaderContent
            title={<FormattedMessage id="app.supplierReport.header.col1" />}
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
              pagination="none"
              scroll={{ x: isMobile ? 1200 : '100vh', y: '60vh' }}
              columns={columns}
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
    </React.Fragment>
  );
};

export default SupplierReport;
