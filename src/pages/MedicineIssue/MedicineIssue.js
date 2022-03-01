import React, { Fragment, useEffect, useState } from 'react';
import {
  notification,
  Button,
  Result,
  Tooltip,
  Form,
  Row,
  Col,
  DatePicker,
  Switch,
} from 'antd';
import moment from 'moment';
import Table from '../../components/Table';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  medicineIssue,
  filter,
} from '../../features/medicineIssue/medicineIssueSlice';
import { FormattedMessage } from 'react-intl';
import { formatNumber, getTimeDistance } from '../../utils/utils';
import { useParams } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import MedicineIssue from '../../components/BillTable/MedicineIssue';
import TableForm from '../../components/MedicineIssueComponents/TableForm';
import '../../utils/css/styleList.scss';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const PAGE_SIZE = process.env.REACT_APP_PAGE_SIZE;

const MedicineIssuePage = ({ intl, isMobile, headerPage }) => {
  let { id } = useParams();
  const formRef = React.createRef();
  const userGroupId = localStorage.getItem('userGroupId');
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const list = useSelector(medicineIssue);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [dataInfo, setDataInfo] = useState([]);
  const [dataMedicines, setDataMedicines] = useState([]);
  const [rangePickerValue, setRangePickerValue] = useState(
    getTimeDistance('week')
  );
  const [medicineIssueCode, setMedicineIssueCode] = useState({});
  const [warehouseId, setWarehouseId] = useState('');
  const [redirect, setRedirect] = useState('');
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    getList();
    getReceiptCode();
    getPermission();
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

  const getReceiptCode = () => {
    let params = {
      filter: JSON.stringify({
        healthFacilityId: healthFacilityId,
        formType: '2',
      }),
    };
    dispatch({
      type: 'receiptCode/getOne',
      payload: params,
      callback: (res) => {
        if (res?.success) {
          const { list } = res.results;
          setMedicineIssueCode(list);
        }
      },
    });
  };

  const getList = () => {
    const { query } = list;
    const queryFilter = list.filter;
    setLoading(true);
    const rangeValue = [moment().startOf('week'), moment().endOf('week')];
    const fromDate =
      rangeValue.length > 0
        ? rangeValue[0].set({ hour: 0, minute: 0, second: 0 })
        : '';
    const toDate =
      rangeValue.length > 0
        ? rangeValue[1].set({ hour: 23, minute: 59, second: 59 })
        : '';
    let params = {
      filter: JSON.stringify({
        healthFacilityId: healthFacilityId,
        fromDate,
        toDate,
      }),
      range: JSON.stringify([0, PAGE_SIZE]),
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
      type: 'medicineIssue/fetch',
      payload: params,
      callback: (res) => {
        setLoading(false);
        if (res.success === false) {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    formRef.current.validateFields().then((values) => {
      const rangeValue = values.createDate || [];
      const fromDate =
        rangeValue.length > 0
          ? rangeValue[0].set({ hour: 0, minute: 0, second: 0 })
          : '';
      const toDate =
        rangeValue.length > 0
          ? rangeValue[1].set({ hour: 23, minute: 59, second: 59 })
          : '';
      const queryName = {
        fromDate,
        toDate,
        healthFacilityId,
      };
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
      dispatch({
        type: 'medicineIssue/fetch',
        payload: query,
        callback: (res) => {
          setLoading(false);
        },
      });
    });
  };

  const handleClickRow = (record) => {
    setSpinning(true);
    dispatch({
      type: 'medicineIssue/getOne',
      payload: {
        id: record.id,
      },
      callback: (res) => {
        setSpinning(false);
        if (res?.success) {
          const { list } = res.results;
          setDataInfo(list);
          setDataMedicines(
            list?.medicines?.map((item) => {
              return {
                ...item,
                medicine: { medicineName: item.medicineName },
                flag: 1,
              };
            })
          );
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
      type: 'medicineIssue/updateStatus',
      payload: {
        id: row.id,
        params: item,
      },
      callback: (res) => {
        if (res?.success === true) {
          openNotification(
            'success',
            intl.formatMessage({ id: 'app.common.edit.success' }),
            '#f6ffed'
          );
          getList();
        } else if (res?.success === false) {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const isActive = (type) => {
    const dataArr = rangePickerValue
      ? [...rangePickerValue]
      : getTimeDistance('week');
    const value = getTimeDistance(type);
    if (!dataArr[0] || !dataArr[1]) {
      return '';
    }
    if (
      dataArr[0].isSame(value[0], 'day') &&
      dataArr[1].isSame(value[1], 'day')
    ) {
      return 'currentDate';
    }
    return '';
  };

  const selectDate = (value, type) => {
    let rangeValue = value;
    if (type) {
      setRangePickerValue(getTimeDistance(type));
      formRef.current.setFieldsValue({
        createDate: getTimeDistance(type),
      });
      rangeValue = getTimeDistance(type) || [];
    }
    const fromDate =
      rangeValue.length > 0
        ? rangeValue[0].set({ hour: 0, minute: 0, second: 0 })
        : '';
    const toDate =
      rangeValue.length > 0
        ? rangeValue[1].set({ hour: 23, minute: 59, second: 59 })
        : '';
    const queryName = {
      healthFacilityId,
      fromDate,
      toDate,
    };
    if (rangeValue.length === 0) {
      delete queryName.fromDate;
      delete queryName.toDate;
    }
    const params = {
      filter: JSON.stringify(queryName),
      range: JSON.stringify([0, PAGE_SIZE]),
      sort: JSON.stringify(['createdAt', 'DESC']),
    };
    setLoading(true);
    dispatch({
      type: 'medicineIssue/fetch',
      payload: params,
      callback: (res) => {
        setLoading(false);
        if (res.success === false) {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const renderForm = () => {
    return (
      <Form
        initialValues={{
          createDate:
            [moment().startOf('week'), moment().endOf('week')] ||
            rangePickerValue ||
            [],
        }}
        ref={formRef}
      >
        <Row gutter={10} style={{ background: '#fff', margin: 0 }}>
          <Col xl={7} md={24} xs={24}>
            <p
              style={{
                color: 'rgb(25, 108, 166)',
                fontSize: '17px',
                margin: '8px 0 0',
                textTransform: 'uppercase',
                fontWeight: 'bold',
              }}
            >
              {intl.formatMessage({ id: 'app.medicineIssue.list' })}
            </p>
          </Col>
          <Col
            xl={10}
            md={17}
            xs={0}
            style={{
              display: 'flex',
              justifyContent: `${isMobile ? 'flex-start' : 'flex-end'}`,
              marginTop: '10px',
            }}
          >
            <div className="salesExtra">
              <span
                className={isActive('today')}
                onClick={() => selectDate(false, 'today')}
              >
                {intl.formatMessage({ id: 'app.common.inDay' })}
              </span>
              <span
                className={isActive('week')}
                onClick={() => selectDate(false, 'week')}
              >
                {intl.formatMessage({ id: 'app.common.inWeek' })}
              </span>
              <span
                className={isActive('month')}
                onClick={() => selectDate(false, 'month')}
              >
                {intl.formatMessage({ id: 'app.common.inMonth' })}
              </span>
              {/* <a
              className={isActive('year')}
              style={{ marginRight: '24px' }}
              onClick={() => this.selectDate(false, 'year')}
            >
              Trong năm
            </a> */}
            </div>
          </Col>
          <Col
            xl={7}
            md={7}
            xs={24}
            style={{
              marginBottom: '8px',
              paddingRight: isMobile ? '10px' : '5px',
            }}
          >
            <FormItem name="createDate" noStyle>
              <RangePicker
                style={{ float: `${isMobile ? 'left' : 'right'}`, top: 5 }}
                onChange={(e) => selectDate(e, false)}
                allowClear={false}
                format={['DD/MM/YYYY', 'DD/MM/YYYY']}
                placeholder={[
                  intl.formatMessage({
                    id: 'app.common.placeholder.rangepicker.0',
                  }),
                  intl.formatMessage({
                    id: 'app.common.placeholder.rangepicker.1',
                  }),
                ]}
                ranges={{
                  'Hôm nay': [moment(), moment()],
                  'Trong tuần': [
                    moment().startOf('week'),
                    moment().endOf('week'),
                  ],
                  'Trong tháng': [
                    moment().startOf('month'),
                    moment().endOf('month'),
                  ],
                }}
                // size="small"
              />
            </FormItem>
          </Col>
        </Row>
      </Form>
    );
  };

  const onCreate = () => {
    setDataInfo([]);
    setDataMedicines([]);
  };

  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };

  const data = (list.data && list.data.list) || [];
  const pagination = (list.data && list.data.pagination) || [];

  const columns = [
    {
      dataIndex: null,
      title: intl.formatMessage({ id: 'app.table.column.no' }),
      align: 'center',
      width: isMobile ? 50 : '1%',
      render: (text, record, index) =>
        formatNumber(
          index + (pagination.current - 1) * pagination.pageSize + 1
        ),
      fixed: isMobile,
    },
    {
      dataIndex: 'medicineIssueCode',
      name: 'medicineIssueCode',
      width: isMobile ? 100 : '4%',
      title: <FormattedMessage id="app.medicineIssue.list.col0" />,
      align: 'left',
      sorter: () => {},
      fixed: isMobile,
    },
    {
      dataIndex: 'medicines',
      name: 'medicines',
      width: isMobile ? 100 : '4%',
      title: <FormattedMessage id="app.medicineIssue.list.col10" />,
      align: 'center',
      sorter: () => {},
      render: (cell) => {
        let total =
          (cell &&
            cell.length > 0 &&
            cell.map((item) =>
              Number(item.medicineIssueMedicines.total || 0)
            )) ||
          0;
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue;
        total = total === 0 ? 0 : total.reduce(reducer);
        return formatNumber(Math.round(total));
      },
    },
    {
      dataIndex: 'createdAt',
      title: intl.formatMessage({ id: 'app.common.placeholder.dateCreated' }),
      align: 'center',
      width: !isMobile && '4%',
      sorter: () => {},
      render: (cell) => (
        <React.Fragment>
          {moment(cell && cell).format('HH:mm DD/MM/YYYY')}
        </React.Fragment>
      ),
    },
    {
      dataIndex: 'customer',
      title: intl.formatMessage({ id: 'app.medicineIssue.list.col3' }),
      align: 'center',
      width: !isMobile && '5%',
      sorter: () => {},
      render: (cell) => <React.Fragment>{cell?.customerName}</React.Fragment>,
    },
    {
      dataIndex: 'status',
      title: intl.formatMessage({ id: 'app.medicineIssue.list.col7' }),
      align: 'center',
      name: 'status',
      width: '2%',
      render: (cell, row) => (
        <React.Fragment>
          <Tooltip
            title={
              cell === 0
                ? intl.formatMessage({ id: 'app.common.statusTag.1' })
                : intl.formatMessage({ id: 'app.common.statusTag.0' })
            }
          >
            <Switch
              disabled={!permissions.isDelete}
              checked={cell}
              onClick={(e) => handleStatus(e, row)}
              size="small"
            />
          </Tooltip>
        </React.Fragment>
      ),
    },
  ];

  return (
    <Fragment>
      {permissions ? (
        <>
          {headerPage}
          <MedicineIssue
            isMobile={isMobile}
            intl={intl}
            permissions={permissions}
            spinning={spinning}
            dataInfo={dataInfo || []}
            dataMedicines={dataMedicines || []}
            medicineIssueCode={medicineIssueCode}
            warehouseId={warehouseId}
            getReceiptCode={getReceiptCode}
            getList={getList}
            onCreate={onCreate}
            childrenOne={
              <>
                {renderForm()}
                <Table
                  loading={loading}
                  rowKey="id"
                  dataSource={data}
                  pagination={pagination}
                  scroll={{ x: isMobile ? '180vw' : '100%', y: '32vh' }}
                  style={{
                    minHeight: '45vh',
                    boxShadow: '0px 0px 5px #00000029',
                    background: '#fff',
                  }}
                  columns={columns}
                  onChange={handleTableChange}
                  rowClassName={(record) =>
                    record.id === dataInfo.id ? 'rowChecked' : 'rowUnCheck'
                  }
                  onRow={(record) => ({
                    onDoubleClick: () => handleClickRow(record),
                  })}
                />
              </>
            }
            childrenTwo={
              <TableForm
                intl={intl}
                isMobile={isMobile}
                value={dataMedicines || []}
                dataInfo={dataInfo || []}
                medicineIssueCode={medicineIssueCode}
                getReceiptCode={getReceiptCode}
                onChange={(data) => setDataMedicines(data)}
                onChangeWarehouse={(id) => setWarehouseId(id)}
              />
            }
          />
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
    </Fragment>
  );
};

export default MedicineIssuePage;
