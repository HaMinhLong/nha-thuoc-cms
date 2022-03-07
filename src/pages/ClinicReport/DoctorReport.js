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

const DoctorReport = ({ isMobile, intl, headerPage }) => {
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
      type: 'clinicReport/doctorReport',
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
      doctorName: values.doctorName && values.doctorName.trim(),
      fromDate: fromDate,
      toDate: toDate,
      healthFacilityId,
    };
    if (!(values.doctorName && values.doctorName.trim())) {
      delete queryName.doctorName;
    }
    if (rangeValue.length === 0) {
      delete queryName.fromDate;
      delete queryName.toDate;
    }
    const query = {
      filter: JSON.stringify(queryName),
    };
    dispatch({
      type: 'clinicReport/doctorReport',
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
          doctorName: '',
          dateCreated: [],
        }}
      >
        <Row gutter={{ md: 0, lg: 8, xl: 16 }}>
          <Col xs={24} md={12} xl={8}>
            <FormItem
              name="doctorName"
              label={<FormattedMessage id="app.doctorReport.list.col10" />}
              {...formItemLayout}
            >
              <Input
                placeholder={intl.formatMessage({
                  id: 'app.doctorReport.search.col1',
                })}
                size="small"
              />
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
            md={24}
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

  const stylesColumn = {
    fontWeight: 600,
    marginBottom: 0,
  };

  const columns = [
    {
      dataIndex: null,
      title: intl.formatMessage({ id: 'app.table.column.no' }),
      align: 'center',
      width: '6%',
      fixed: isMobile,
      render: (value, row, index) => {
        const obj = {
          children: (
            <p style={stylesColumn}>
              {intl.formatMessage({ id: 'app.doctorReport.list.col9' })}
            </p>
          ),
          props: { colSpan: 4 },
        };
        if (row.children) {
          obj.props.colSpan = 1;
          obj.children = (
            <span style={stylesColumn}>{formatNumber(index + 1)}</span>
          );
        }
        if (!row.children && row.id !== '-1') {
          obj.children = null;
          obj.props.colSpan = 1;
        }
        return obj;
      },
    },
    {
      dataIndex: 'clinicReceiptCode',
      width: '13%',
      title: intl.formatMessage({ id: 'app.doctorReport.list.col1' }),
      align: 'left',
      fixed: isMobile,
      render: (value, row) => {
        const obj = {
          children: <span style={stylesColumn}>{value}</span>,
          props: { colSpan: 0 },
        };
        if (!row.children && row.id !== '-1') {
          obj.props.colSpan = 1;
          obj.children = value;
        }
        if (row.id === '-1') {
          obj.props.colSpan = 0;
        }
        return obj;
      },
    },
    {
      dataIndex: 'clinicServiceName',
      width: '20%',
      title: intl.formatMessage({ id: 'app.doctorReport.list.col2' }),
      align: 'center',
      render: (value, row) => {
        const obj = {
          children: <span style={stylesColumn}>{value}</span>,
          props: { colSpan: 3 },
        };
        if (!row.children && row.id !== '-1') {
          obj.props.colSpan = 1;
          obj.children = value;
        }
        if (row.id === '-1') {
          obj.props.colSpan = 0;
        }
        return obj;
      },
    },
    {
      dataIndex: 'date',
      width: '13%',
      title: intl.formatMessage({ id: 'app.doctorReport.list.col3' }),
      align: 'left',
      render: (value, row) => {
        const obj = {
          children: (
            <span style={stylesColumn}>
              {moment(value).format('HH:mm DD/MM/YYYY')}
            </span>
          ),
          props: { colSpan: 0 },
        };
        if (!row.children && row.id !== '-1') {
          obj.props.colSpan = 1;
          obj.children = value;
        }
        if (row.id === '-1') {
          obj.props.colSpan = 0;
        }
        return obj;
      },
    },
    {
      dataIndex: 'amount',
      title: intl.formatMessage({ id: 'app.doctorReport.list.col4' }),
      align: 'left',
      width: '9%',
      render: (value, row) => {
        const obj = {
          children: (
            <span style={stylesColumn}>{formatNumber(value || 0)}</span>
          ),
          props: { colSpan: 1 },
        };
        if (!row.children && row.id !== '-1') {
          obj.children = formatNumber(value || 0);
        }
        if (row.id === '-1') {
          obj.children = (
            <span style={stylesColumn}>{formatNumber(value || 0)}</span>
          );
        }
        return obj;
      },
    },
    {
      dataIndex: 'price',
      title: intl.formatMessage({ id: 'app.doctorReport.list.col5' }),
      align: 'left',
      width: '11%',
      render: (value, row) => {
        const obj = {
          children: (
            <span style={stylesColumn}>{formatNumber(value || 0)}</span>
          ),
          props: { colSpan: 1 },
        };
        if (!row.children && row.id !== '-1') {
          obj.children = formatNumber(value || 0);
        }
        if (row.id === '-1') {
          obj.children = (
            <span style={stylesColumn}>{formatNumber(value || 0)}</span>
          );
        }
        return obj;
      },
    },
    {
      dataIndex: 'discount',
      title: intl.formatMessage({ id: 'app.doctorReport.list.col6' }),
      align: 'left',
      width: '9%',
      render: (value, row) => {
        const obj = {
          children: (
            <span style={stylesColumn}>{formatNumber(value || 0)}</span>
          ),
          props: { colSpan: 1 },
        };
        if (!row.children && row.id !== '-1') {
          obj.children = formatNumber(value || 0);
        }
        if (row.id === '-1') {
          obj.children = (
            <span style={stylesColumn}>{formatNumber(value || 0)}</span>
          );
        }
        return obj;
      },
    },
    {
      dataIndex: 'tax',
      title: intl.formatMessage({ id: 'app.doctorReport.list.col7' }),
      align: 'left',
      width: '8%',
      render: (value, row) => {
        const obj = {
          children: (
            <span style={stylesColumn}>{formatNumber(value || 0)}</span>
          ),
          props: { colSpan: 1 },
        };
        if (!row.children && row.id !== '-1') {
          obj.children = formatNumber(value || 0);
        }
        if (row.id === '-1') {
          obj.children = (
            <span style={stylesColumn}>{formatNumber(value || 0)}</span>
          );
        }
        return obj;
      },
    },
    {
      dataIndex: 'total',
      title: intl.formatMessage({ id: 'app.doctorReport.list.col8' }),
      align: 'left',
      width: '12%',
      render: (value, row) => {
        const obj = {
          children: (
            <span style={stylesColumn}>{formatNumber(value || 0)}</span>
          ),
          props: { colSpan: 1 },
        };
        if (!row.children && row.id !== '-1') {
          obj.children = formatNumber(value || 0);
        }
        if (row.id === '-1') {
          obj.children = (
            <span style={stylesColumn}>{formatNumber(value || 0)}</span>
          );
        }
        return obj;
      },
    },
  ];

  const reducer = (a, b) => Number(a) + Number(b);

  let result = data.reduce((r, { fullName: clinicServiceName, ...object }) => {
    let temp = r.find((o) => o.clinicServiceName === clinicServiceName);
    if (!temp) r.push((temp = { clinicServiceName, children: [] }));
    temp.children.push(object);
    return r;
  }, []);

  let totalAmount = 0;
  let totalTax = 0;
  let totalMoney1 = 0;
  let totalDiscount = 0;
  let totalPrice = 0;

  let totalPrice2 = 0;
  let totalAmount2 = 0;
  let totalDiscount2 = 0;
  let totalTax2 = 0;

  result =
    (result &&
      result.length > 0 &&
      result.map((item, index) => {
        const amount = item.children.map((child) => child.amount);
        totalAmount = amount.reduce(reducer);
        totalAmount2 += Number(totalAmount);

        const price = item.children.map((child) => child.price);
        totalPrice = price.reduce(reducer);
        totalPrice2 += Number(totalPrice);

        const tax = item.children.map((child) => child.tax);
        totalTax = tax.reduce(reducer);
        totalTax2 += Number(totalTax);

        const discount = item.children.map((child) => child.discount);
        totalDiscount = discount.reduce(reducer);
        totalDiscount2 += Number(totalDiscount);

        const total = item.children.map((child) => child.total);
        totalMoney1 = total.reduce(reducer);

        return {
          ...item,
          id: index,
          amount: totalAmount,
          price: totalPrice,
          discount: totalDiscount,
          tax: totalTax,
          total: totalMoney1,
          children: item.children.map((child, number) => ({
            ...child,
            id: `${index}_${number}`,
          })),
        };
      })) ||
    [];

  if (result && result.length && result[result.length - 1].id !== '-1') {
    result.push({
      id: '-1',
      clinicServiceName: intl.formatMessage({
        id: 'app.customerReport.list.col10',
      }),
      amount: totalAmount2,
      price: totalPrice2,
      discount: totalDiscount2,
      tax: totalTax2,
      total: totalMoney1,
    });
  }

  return (
    <React.Fragment>
      {permissions ? (
        <>
          {headerPage}
          <HeaderContent
            title={<FormattedMessage id="app.doctorReport.header.col1" />}
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
              bordered
              loading={loading}
              rowKey="id"
              dataSource={result || []}
              pagination="none"
              scroll={{ x: '1200px', y: '58vh' }}
              columns={columns}
              onExpand={(expanded) => (expanded = true)}
              expandedRowKeys={result.map((item) => item.id)}
              expandIcon={() => ''}
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

export default DoctorReport;
