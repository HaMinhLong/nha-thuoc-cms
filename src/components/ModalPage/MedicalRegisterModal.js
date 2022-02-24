import React, { useState, useEffect } from 'react';
import { CheckCircleFilled } from '@ant-design/icons';
import {
  Input,
  Button,
  Spin,
  Popconfirm,
  Form,
  Modal,
  notification,
  Row,
  Col,
  Card,
  Select,
  DatePicker,
} from 'antd';
import moment from 'moment';
import regexHelper from '../../utils/regexHelper';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import debounce from 'lodash/debounce';
import DoctorSelect from '../Common/DoctorSelect';
import ClinicServicePackageSelect from '../Common/ClinicServicePackageSelect';
import ClinicServiceSelect from '../Common/ClinicServiceSelect';

const { isPhone } = regexHelper;
const FormItem = Form.Item;

const MedicalRegisterModal = ({
  intl,
  visible,
  dataEdit,
  isMobile,
  getList,
  titleModal,
  dataCustomer,
}) => {
  const dispatch = useDispatch();
  const formRef = React.createRef();
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const [checkFirst, setCheckFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [data, setData] = useState({});
  const [dataClinicTime, setDataClinicTime] = useState([]);
  const [clinicServiceId, setClinicServiceId] = useState('');
  const [workTime, setWorkTime] = useState('');
  const [exitsCustomer, setExitsCustomer] = useState(false);
  const [keyStyle, setKeyStyle] = useState({});
  const [key, setKey] = useState(Math.random());

  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      getOne(dataEdit?.id);
      changeModal('show');
    }
  }, [visible]);

  const getOne = (id) => {
    if (id) {
      setLoading(true);
      dispatch({
        type: 'medicalRegister/getOne',
        payload: {
          id: id,
        },
        callback: (res) => {
          setLoading(false);
          if (res?.success) {
            const { list } = res.results;
            handleChangeClinicService(
              list.clinicService.id,
              list.clinicService.time,
              moment(list.date)
            );
            setData(list);
          }
        },
      });
    } else {
      if (dataCustomer) {
        setData({
          customer: {
            id: dataCustomer?.customer?.id,
            mobile: dataCustomer?.customer?.mobile,
            customerName: dataCustomer?.customer?.customerName,
            dateOfBirth: dataCustomer?.customer?.dateOfBirth,
          },
          userId: dataCustomer?.userId,
        });
      } else {
        setData({});
      }
    }
  };

  const handleCustomer = () => {
    formRef.current.validateFields(['mobile']).then((values) => {
      let params = {
        filter: JSON.stringify({
          healthFacilityId: healthFacilityId,
          mobile: values.mobile,
          status: 1,
        }),
        sort: JSON.stringify(['createdAt', 'DESC']),
        attributes: 'id,customerName,dateOfBirth,status',
      };
      dispatch({
        type: 'customer/fetchLazyLoading',
        payload: params,
        callback: (res) => {
          if (res?.success === false) {
            openNotification('error', res && res.message, '#fff1f0');
          } else {
            const { list } = res.results;
            if (list.length > 0) {
              formRef.current.setFieldsValue({
                customerName: `${list[0].customerName}`,
                customerId: list[0].id,
                dateOfBirth: moment(list[0].dateOfBirth),
              });
              setExitsCustomer(true);
            } else {
              formRef.current.setFieldsValue({
                customerName: '',
                customerId: '',
              });
              setExitsCustomer(false);
              openNotification(
                'warning',
                'Không tìm thấy thông tin khách hàng!',
                '#fff1f0'
              );
            }
          }
        },
      });
    });
  };

  const handleChangeClinicService = (id, time, date) => {
    if (id && time) {
      const fromDate = (date || formRef.current.getFieldValue('date'))
        .set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        })
        .toISOString();
      const toDate = (date || formRef.current.getFieldValue('date'))
        .set({
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 99,
        })
        .toISOString();
      const day = (date || formRef.current.getFieldValue('date')).day();
      let params = {
        filter: JSON.stringify({
          healthFacilityId: healthFacilityId,
          clinicServiceId: id,
          time: time,
          fromDate: fromDate,
          toDate: toDate,
          day: day,
        }),
        sort: JSON.stringify(['ordinalNumber', 'ASC']),
        attributes: '',
      };

      dispatch({
        type: 'clinicTime/fetchLazyLoading',
        payload: params,
        callback: (res) => {
          if (res?.success === false) {
            openNotification('error', res && res.message, '#fff1f0');
            setKeyStyle({});
            setDataClinicTime([]);
          } else {
            const { list } = res.results;
            if (list.length > 0) {
              setDataClinicTime(list);
            } else {
              openNotification(
                'warning',
                'Không tìm thấy thông tin giờ khám!',
                '#fff1f0'
              );
            }
          }
        },
      });
    }
  };

  const handleSubmit = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        if (!keyStyle.id) {
          openNotification('warning', 'Vui lòng chọn giờ khám!', '#fff1f0');
        } else {
          setLoading(true);
          const healthFacilityId = localStorage.getItem('healthFacilityId');
          const addItem = {
            ...values,
            customerName: values.customerName && values.customerName.trim(),
            healthFacilityId,
            clinicTimeId: keyStyle.id,
            exitsCustomer,
          };
          if (data?.id) {
            const item = {
              isClose: true,
            };
            const itemOld = {
              isClose: false,
            };
            dispatch({
              type: 'clinicTime/updateStatus',
              payload: {
                id: keyStyle.id,
                params: item,
              },
            });
            dispatch({
              type: 'clinicTime/updateStatus',
              payload: {
                id: data.clinicTimeId,
                params: itemOld,
              },
            });
            dispatch({
              type: 'medicalRegister/update',
              payload: {
                id: data?.id,
                params: {
                  ...addItem,
                },
              },
              callback: (res) => {
                if (res?.success) {
                  openNotification(
                    'success',
                    intl.formatMessage({ id: 'app.common.edit.success' }),
                    '#f6ffed'
                  );
                  getList();
                  changeModal('close');
                } else {
                  openNotification('error', res.message, '#fff1f0');
                }
                setLoading(false);
              },
            });
          } else {
            const item = {
              isClose: true,
            };
            dispatch({
              type: 'clinicTime/updateStatus',
              payload: {
                id: keyStyle.id,
                params: item,
              },
            });
            dispatch({
              type: 'medicalRegister/add',
              payload: addItem,
              callback: (res) => {
                if (res?.success) {
                  openNotification(
                    'success',
                    intl.formatMessage(
                      { id: 'app.common.create.success' },
                      { name: titleModal }
                    ),
                    '#f6ffed'
                  );
                  getList();
                  changeModal('close');
                } else {
                  openNotification('error', res.message, '#fff1f0');
                }
                setLoading(false);
              },
            });
          }
        }
      })
      .catch(({ errorFields }) => {
        formRef.current.scrollToField(errorFields[0].name);
      });
  };

  const setTime = (item) => {
    const data = { ...item };
    if (!item.isClose) {
      setKeyStyle(data);
    }
  };

  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };

  const handleReset = () => {
    formRef.current.resetFields();
  };

  const changeModal = (value) => {
    if (value === 'show') {
      setVisibleModal(!visibleModal);
      setKey(key + 1);
    } else if (value === 'close') {
      setVisibleModal(false);
      setData({});
      setDataClinicTime([]);
      setKeyStyle({});
    }
  };

  const formItemLayout = {
    labelAlign: 'left',
    style: {
      marginBottom: 10,
    },
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
    },
  };

  const formItemLayout1 = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
      style: { lineHeight: '20px' },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 24 },
    },
    // colon: false,
    labelAlign: 'left',
    style: { marginBottom: 10 },
  };

  const gridStyle = {
    textAlign: 'center',
    width: '100%',
    padding: isMobile ? '15px 5px' : '35px 5px',
    color: '#222',
    fontSize: '1rem',
    fontWeight: '400',
    background: '#fff',
    userSelect: 'none',
  };

  const gridStyle1 = {
    textAlign: 'center',
    width: '100%',
    color: '#fff',
    padding: isMobile ? '15px 5px' : '35px 5px',
    fontSize: '1rem',
    fontWeight: '400',
    background: '#ea6054',
    userSelect: 'none',
  };

  return (
    <React.Fragment>
      <Modal
        title={
          <p
            style={{
              fontWeight: '600',
              fontSize: 18,
              textTransform: 'uppercase',
            }}
          >
            {data?.id
              ? intl.formatMessage({ id: 'app.medicalRegister.update.header' })
              : intl.formatMessage({ id: 'app.medicalRegister.create.header' })}
          </p>
        }
        width="100%"
        style={{ top: 0, margin: '0 auto' }}
        bodyStyle={{ minHeight: '85vh', padding: '24px 24px 0px' }}
        maskStyle={{ backgroundColor: '#ECEFF4' }}
        confirmLoading={loading}
        onCancel={() => changeModal('close')}
        visible={visibleModal}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Popconfirm
              placement="bottom"
              title={<FormattedMessage id="app.confirm.reset" />}
              onConfirm={handleReset}
            >
              <Button type="primary" style={{ marginLeft: 8 }}>
                <i className="fa fa-ban" />
                &nbsp;
                <FormattedMessage id="app.common.crudBtns.1" />
              </Button>
            </Popconfirm>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginLeft: 8, marginRight: 30 }}
              loading={loading}
              onClick={handleSubmit}
            >
              <i className="fa fa-save" />
              &nbsp;
              <FormattedMessage id="app.common.crudBtns.2" />
            </Button>
          </div>
        }
      >
        <Spin spinning={loading}>
          <Form
            hideRequiredMark
            style={{ marginTop: 8 }}
            initialValues={{
              clinicServicePackageId: data?.id
                ? data?.clinicService?.clinicServicePackage?.id
                : undefined,
              clinicServiceId: data?.id ? data?.clinicService?.id : undefined,
              date: data?.id ? moment(data?.date) : moment(),
              customerId: data?.customer?.id,
              mobile: data?.customer?.mobile,
              customerName: data?.customer?.customerName,
              dateOfBirth: moment(data?.customer?.dateOfBirth),
              contactChannel: 0,
              userId: data?.userId,
              description: data?.id ? data?.description : '',
              status: data?.id ? data.status : 0,
            }}
            ref={formRef}
            layout="vertical"
            key={`${data?.id}_${key}` || '0'}
          >
            <FormItem hidden name="customerId">
              <Input />
            </FormItem>
            <Row gutter={20}>
              <Col
                lg={18}
                xs={24}
                style={{
                  padding: '0 20px',
                  height: '80vh',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                <Card
                  style={{ width: '100%' }}
                  title={
                    <React.Fragment>
                      <Row gutter={20}>
                        <Col xs={24} md={8}>
                          <FormItem
                            name="clinicServicePackageId"
                            label={
                              <span>
                                <span style={{ color: 'red' }}>*</span>&nbsp;
                                {intl.formatMessage({
                                  id: 'app.medicalRegister.list.col0',
                                })}
                              </span>
                            }
                            {...formItemLayout1}
                          >
                            <ClinicServicePackageSelect
                              placeholder={intl.formatMessage({
                                id: 'app.medicalRegister.list.clinicServicePackage',
                              })}
                              isMobile={isMobile}
                              intl={intl}
                              allowClear
                              onChange={(value) => {
                                formRef.current.resetFields([
                                  'clinicServiceId',
                                ]);
                              }}
                            />
                          </FormItem>
                        </Col>
                        <Col xs={24} md={8}>
                          <FormItem
                            shouldUpdate={(prevValues, currentValues) =>
                              prevValues.clinicServicePackageId !==
                              currentValues.clinicServicePackageId
                            }
                            noStyle
                          >
                            {({ getFieldValue }) => (
                              <FormItem
                                name="clinicServiceId"
                                label={
                                  <span>
                                    <span style={{ color: 'red' }}>*</span>
                                    &nbsp;
                                    {intl.formatMessage({
                                      id: 'app.medicalRegister.list.col1',
                                    })}
                                  </span>
                                }
                                {...formItemLayout1}
                              >
                                <ClinicServiceSelect
                                  placeholder={intl.formatMessage({
                                    id: 'app.medicalRegister.list.clinicService',
                                  })}
                                  isMobile={isMobile}
                                  intl={intl}
                                  allowClear
                                  filter
                                  filterField={
                                    getFieldValue('clinicServicePackageId') ||
                                    'a'
                                  }
                                  onChange={(id, name, time, userId) => {
                                    setClinicServiceId(id);
                                    setWorkTime(time);
                                    formRef.current.setFieldsValue({
                                      userId: userId,
                                    });
                                    handleChangeClinicService(id, time, false);
                                  }}
                                />
                              </FormItem>
                            )}
                          </FormItem>
                        </Col>
                        <Col xs={24} md={8}>
                          <FormItem
                            name="date"
                            label={
                              <span>
                                <span style={{ color: 'red' }}>*</span>&nbsp;
                                {intl.formatMessage({
                                  id: 'app.medicalRegister.list.col2',
                                })}
                              </span>
                            }
                            {...formItemLayout1}
                          >
                            <DatePicker
                              style={{ width: '100%' }}
                              format="DD/MM/YYYY"
                              placeholder={intl.formatMessage({
                                id: 'app.medicalRegister.list.date',
                              })}
                              disabledDate={(current) =>
                                current && current < moment().startOf('day')
                              }
                              onChange={(value) => {
                                handleChangeClinicService(
                                  clinicServiceId,
                                  workTime,
                                  value
                                );
                              }}
                            />
                          </FormItem>
                        </Col>
                      </Row>
                      <div style={{ fontSize: '13px', opacity: '0.6' }}>
                        <span style={{ color: 'red', marginRight: 5 }}>*</span>
                        {intl.formatMessage({
                          id: 'app.medicalRegister.noti.col0',
                        })}
                      </div>
                    </React.Fragment>
                  }
                >
                  <Row gutter={20}>
                    {dataClinicTime && dataClinicTime.length > 0 ? (
                      dataClinicTime.map((item) => {
                        const styleCardTime = !item.isClose
                          ? gridStyle
                          : gridStyle1;
                        return (
                          <Col
                            xs={6}
                            sm={4}
                            md={4}
                            lg={3}
                            onClick={() => {
                              setTime(item);
                            }}
                            key={item.id}
                            style={{
                              padding: 'unset',
                              cursor: 'pointer',
                            }}
                          >
                            <Card.Grid
                              style={{
                                ...styleCardTime,
                                background:
                                  item.ordinalNumber === keyStyle.ordinalNumber
                                    ? '#76c448'
                                    : styleCardTime.background,
                                color:
                                  item.ordinalNumber === keyStyle.ordinalNumber
                                    ? '#fff'
                                    : styleCardTime.color,
                              }}
                              hoverable={item.status}
                            >
                              {item.ordinalNumber ===
                                keyStyle.ordinalNumber && (
                                <CheckCircleFilled
                                  style={{
                                    position: 'absolute',
                                    right: '5px',
                                    top: '5px',
                                    color: '#fff',
                                    zIndex: '9',
                                  }}
                                />
                              )}
                              <p
                                style={{
                                  fontSize: '20px',
                                  margin: 0,
                                }}
                              >
                                {item.hourFrame && item.hourFrame.slice(0, 5)}
                              </p>
                            </Card.Grid>
                          </Col>
                        );
                      })
                    ) : (
                      <div
                        className="ant-empty ant-empty-normal"
                        style={{
                          margin: 'auto',
                          padding: '50px',
                        }}
                      >
                        <div className="ant-empty-image">
                          <svg
                            className="ant-empty-img-simple"
                            width={64}
                            height={41}
                            viewBox="0 0 64 41"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g
                              transform="translate(0 1)"
                              fill="none"
                              fillRule="evenodd"
                            >
                              <ellipse
                                className="ant-empty-img-simple-ellipse"
                                cx={32}
                                cy={33}
                                rx={32}
                                ry={7}
                              />
                              <g
                                className="ant-empty-img-simple-g"
                                fillRule="nonzero"
                              >
                                <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
                                <path
                                  d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                                  className="ant-empty-img-simple-path"
                                />
                              </g>
                            </g>
                          </svg>
                        </div>
                        <p className="ant-empty-description">
                          {intl.formatMessage({
                            id: 'app.medicalRegister.noti.col1',
                          })}
                        </p>
                      </div>
                    )}
                  </Row>
                </Card>
              </Col>
              <Col
                lg={6}
                xs={24}
                style={{
                  padding: '0px',
                  height: '80vh',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                <FormItem
                  {...formItemLayout}
                  name="mobile"
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp;
                      {intl.formatMessage({
                        id: 'app.medicalRegister.list.col3',
                      })}
                    </span>
                  }
                  rules={[
                    {
                      pattern: isPhone,
                      message: intl.formatMessage({
                        id: 'app.common.crud.validate.phone_email',
                      }),
                    },
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'app.common.crud.validate.input',
                      }),
                    },
                  ]}
                >
                  <Input
                    placeholder={intl.formatMessage({
                      id: 'app.medicalRegister.list.mobile',
                    })}
                    onChange={debounce(handleCustomer, 500)}
                  />
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  // hasFeedback
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'app.common.crud.validate.input',
                      }),
                    },
                  ]}
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp;
                      {intl.formatMessage({
                        id: 'app.medicalRegister.list.col4',
                      })}
                    </span>
                  }
                  name="customerName"
                >
                  <Input
                    placeholder={intl.formatMessage({
                      id: 'app.medicalRegister.list.customer',
                    })}
                  />
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp;
                      {intl.formatMessage({
                        id: 'app.medicalRegister.list.col5',
                      })}
                    </span>
                  }
                  name="dateOfBirth"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'app.common.crud.validate.input',
                      }),
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    placeholder={intl.formatMessage({
                      id: 'app.medicalRegister.list.dateOfBirth',
                    })}
                    disabledDate={(current) =>
                      current && current > moment().endOf('day')
                    }
                  />
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp;
                      {intl.formatMessage({
                        id: 'app.medicalRegister.list.col6',
                      })}
                    </span>
                  }
                  name="contactChannel"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'app.common.crud.validate.input',
                      }),
                    },
                  ]}
                >
                  <Select
                    allowClear
                    placeholder={intl.formatMessage({
                      id: 'app.medicalRegister.list.contactChannel',
                    })}
                  >
                    <Select.Option key={0} value={0}>
                      {intl.formatMessage({
                        id: 'app.medicalRegister.list.col14',
                      })}
                    </Select.Option>
                  </Select>
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  name="userId"
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp;
                      <FormattedMessage id="app.medicalRegister.list.col7" />
                    </span>
                  }
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'app.common.crud.validate.input',
                      }),
                    },
                  ]}
                >
                  <DoctorSelect
                    placeholder={intl.formatMessage({
                      id: 'app.medicalRegister.list.doctor',
                    })}
                    isMobile={isMobile}
                    intl={intl}
                    allowClear
                  />
                </FormItem>
                <FormItem
                  {...formItemLayout}
                  label={
                    <span>
                      {intl.formatMessage({
                        id: 'app.medicalRegister.list.col8',
                      })}
                    </span>
                  }
                  name="description"
                  rules={[
                    {
                      max: 200,
                      message: intl.formatMessage({
                        id: 'app.common.validate.max200',
                      }),
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder={intl.formatMessage({
                      id: 'app.medicalRegister.list.description',
                    })}
                  />
                </FormItem>
                <FormItem hidden name="status" valuePropName="checked">
                  <Input />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </React.Fragment>
  );
};

export default MedicalRegisterModal;
