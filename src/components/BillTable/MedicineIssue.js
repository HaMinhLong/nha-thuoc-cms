import React, { useState, useEffect, Fragment } from 'react';
import {
  Input,
  Spin,
  Row,
  Col,
  Popconfirm,
  Button,
  Checkbox,
  notification,
  Card,
  Tooltip,
  Form,
} from 'antd';
import HeaderContent from '../../layouts/HeaderContent';
import { FormattedMessage } from 'react-intl';
import regexHelper from '../../utils/regexHelper';
import { useDispatch } from 'react-redux';
import UserSelect from '../Common/UserSelect';
import ShortCutSelectPaymentMethod from '../ShortCutSelect/ShortCutSelectPaymentMethod';
import debounce from 'lodash/debounce';

const FormItem = Form.Item;
const { invoiceCode, isPhone } = regexHelper;

const Receipt = ({
  childrenOne,
  childrenTwo,
  intl,
  isMobile,
  permissions,
  spinning,
  dataInfo,
  medicineIssueCode,
  getList,
  getReceiptCode,
  onCreate,
  dataMedicines,
}) => {
  const formRef = React.createRef();
  const dispatch = useDispatch();
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const userId = localStorage.getItem('id');
  const [loading, setLoading] = useState(false);
  const [exitsCustomer, setExitsCustomer] = useState(false);
  const [key, setKey] = useState(Math.random());

  useEffect(() => {
    formRef.current.setFieldsValue({
      medicineIssueCode: medicineIssueCode.receiptCode,
    });
  }, [medicineIssueCode]);

  const handleCustomer = () => {
    formRef.current.validateFields(['mobile']).then((values) => {
      let params = {
        filter: JSON.stringify({
          healthFacilityId: healthFacilityId,
          mobile: values.mobile,
          status: 1,
        }),
        sort: JSON.stringify(['createdAt', 'DESC']),
        attributes: 'id,customerName,status',
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

  const handleSubmit = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        setLoading(true);
        const addItem = {
          ...values,
          medicineIssueCode:
            values.medicineIssueCode && values.medicineIssueCode.trim(),
          medicineIssueCodeOld:
            values.medicineIssueCode && values.medicineIssueCode.trim(),
          customerId: values.customerId,
          debit: values.debit || false,
          status: values.status || 1,
          healthFacilityId,
          medicines: dataMedicines,
          exitsCustomer,
        };
        if (dataMedicines.length === 0) {
          setLoading(false);
          openNotification(
            'error',
            'Vui lòng thêm thuốc vào phiếu!',
            '#fff1f0'
          );
        } else {
          if (dataInfo.id) {
            dispatch({
              type: 'medicineIssue/update',
              payload: {
                id: dataInfo.id,
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
                  setKey(key + 1);
                  onCreate();
                } else {
                  openNotification('error', res.message, '#fff1f0');
                }
                setLoading(false);
              },
            });
          } else {
            dispatch({
              type: 'medicineIssue/add',
              payload: addItem,
              callback: (res) => {
                if (res?.success) {
                  openNotification(
                    'success',
                    intl.formatMessage(
                      { id: 'app.common.create.success' },
                      {
                        name: intl.formatMessage({
                          id: 'app.medicineIssue.list.title',
                        }),
                      }
                    ),
                    '#f6ffed'
                  );
                  updateReceiptCode();
                  getList();
                  setKey(key + 1);
                  onCreate();
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

  const updateReceiptCode = () => {
    dispatch({
      type: 'receiptCode/update',
      payload: {
        id: medicineIssueCode.id,
      },
      callback: (res) => {
        if (res?.success) {
          getReceiptCode();
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

  const handleReset = () => {
    formRef.current.resetFields();
  };

  const formItemLayout = {
    labelAlign: 'left',
    style: {
      marginBottom: 5,
    },
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 14 },
    },
  };
  const formItemLayout1 = {
    labelAlign: 'left',
    style: {
      marginBottom: 0,
    },
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 21 },
    },
  };
  return (
    <Fragment>
      <HeaderContent
        title={<FormattedMessage id="app.medicineIssue.list.header" />}
        action={
          <React.Fragment>
            <div>
              {permissions.isAdd && dataInfo.id && (
                <Tooltip
                  title={
                    !isMobile &&
                    intl.formatMessage({
                      id: 'app.medicineIssue.create.header',
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
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      onCreate();
                      setKey(key + 1);
                    }}
                  >
                    {intl.formatMessage(
                      { id: 'app.title.create' },
                      { name: '(F2)' }
                    )}
                  </Button>
                </Tooltip>
              )}
              {permissions.isAdd && (
                <Popconfirm
                  placement="bottom"
                  title={<FormattedMessage id="app.confirm.reset" />}
                  onConfirm={() => handleReset()}
                >
                  <Button type="primary" style={{ marginLeft: 8 }}>
                    <i className="fa fa-ban" />
                    &nbsp;
                    <FormattedMessage id="app.common.crudBtns.1" />
                  </Button>
                </Popconfirm>
              )}
              {permissions.isAdd && (
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginLeft: 8 }}
                  loading={loading}
                  onClick={handleSubmit}
                >
                  <i className="fa fa-save" />
                  &nbsp;
                  <FormattedMessage id="app.common.crudBtns.2" />
                </Button>
              )}
            </div>
          </React.Fragment>
        }
      >
        <Row gutter={isMobile ? 0 : 10} style={{ background: '#e0e8ef' }}>
          <Col lg={15} xs={24}>
            <Spin spinning={spinning}>
              <Card
                bordered={false}
                style={{ boxShadow: '0px 0px 5px #00000029' }}
                nolegacystyle="true"
              >
                <Form
                  hideRequiredMark
                  style={{ marginTop: 8 }}
                  initialValues={{
                    medicineIssueCode: dataInfo.id
                      ? dataInfo.medicineIssueCode
                      : medicineIssueCode.receiptCode,
                    customerName: dataInfo?.customer?.customerName,
                    mobile: dataInfo?.customer?.mobile,
                    customerId: dataInfo?.customer?.id,
                    userId: dataInfo.id ? dataInfo.userId : Number(userId),
                    paymentMethodId: dataInfo.id
                      ? dataInfo.paymentMethodId
                      : '',
                    debit: dataInfo.id ? dataInfo.debit : false,
                    description: dataInfo.id ? dataInfo.description : '',
                    status: dataInfo.id ? dataInfo.status : 1,
                  }}
                  ref={formRef}
                  key={`${dataInfo?.id}_${key}` || '0'}
                >
                  <FormItem hidden name="customerId">
                    <Input />
                  </FormItem>
                  <Row gutter={10}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={
                          <span>
                            <span style={{ color: 'red' }}>*</span>&nbsp;
                            {intl.formatMessage({
                              id: 'app.medicineIssue.list.col0',
                            })}
                          </span>
                        }
                        name="medicineIssueCode"
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'app.common.crud.validate.input',
                            }),
                          },
                          {
                            pattern: invoiceCode,
                            message: intl.formatMessage({
                              id: 'app.common.crud.validate.fomatMedi',
                            }),
                          },
                        ]}
                      >
                        <Input
                          placeholder={intl.formatMessage({
                            id: 'app.medicineIssue.list.name',
                          })}
                          size="small"
                          disabled
                        />
                      </FormItem>
                    </Col>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        name="paymentMethodId"
                        label={
                          <span>
                            <span style={{ color: 'red' }}>*</span>&nbsp;
                            {intl.formatMessage({
                              id: 'app.medicineIssue.list.col1',
                            })}
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'app.common.crud.validate.select',
                            }),
                          },
                        ]}
                      >
                        <ShortCutSelectPaymentMethod
                          intl={intl}
                          isMobile={isMobile}
                          placeholder={intl.formatMessage({
                            id: 'app.medicineIssue.list.paymentMethod',
                          })}
                          size="small"
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        name="mobile"
                        label={
                          <span>
                            <span style={{ color: 'red' }}>*</span>&nbsp;
                            {intl.formatMessage({
                              id: 'app.medicineIssue.list.col2',
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
                            id: 'app.medicineIssue.list.mobile',
                          })}
                          onChange={debounce(handleCustomer, 500)}
                          size="small"
                        />
                      </FormItem>
                    </Col>
                    <Col sm={12} xs={24}>
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
                              id: 'app.medicineIssue.list.col3',
                            })}
                          </span>
                        }
                        name="customerName"
                      >
                        <Input
                          placeholder={intl.formatMessage({
                            id: 'app.medicineIssue.list.customer',
                          })}
                          size="small"
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        name="userId"
                        label={
                          <span>
                            <span style={{ color: 'red' }}>*</span>&nbsp;
                            {intl.formatMessage({
                              id: 'app.medicineIssue.list.col4',
                            })}
                          </span>
                        }
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'app.common.crud.validate.select',
                            }),
                          },
                        ]}
                      >
                        <UserSelect
                          size="small"
                          placeholder={intl.formatMessage({
                            id: 'app.medicineIssue.list.user',
                          })}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col sm={6} xs={24}>
                      <FormItem
                        style={{ marginBottom: 0 }}
                        name="debit"
                        valuePropName="checked"
                      >
                        <Checkbox>
                          {intl.formatMessage({
                            id: 'app.medicineIssue.list.col5',
                          })}
                        </Checkbox>
                      </FormItem>
                    </Col>
                    <Col sm={18} xs={24}>
                      <FormItem
                        {...formItemLayout1}
                        label={
                          <span>
                            {intl.formatMessage({
                              id: 'app.medicineIssue.list.col6',
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
                        <Input
                          placeholder={intl.formatMessage({
                            id: 'app.medicineIssue.list.description',
                          })}
                          className="input_descriptions"
                          suffix={<span className="suffix">200</span>}
                          size="small"
                        />
                      </FormItem>
                    </Col>
                    <FormItem name="status" hidden>
                      <FormItem
                        // {...formItemLayout}
                        hidden
                        name="status"
                        valuePropName="checked"
                      >
                        <Input />
                      </FormItem>
                    </FormItem>
                  </Row>
                </Form>
              </Card>
            </Spin>
            {childrenOne}
          </Col>
          <Col lg={9} xs={24}>
            <div
              style={{
                background: '#FFF',
                boxShadow: '0px 0px 5px #00000029',
                height: '100%',
                position: 'relative',
              }}
            >
              {childrenTwo}
            </div>
          </Col>
        </Row>
      </HeaderContent>
    </Fragment>
  );
};

export default Receipt;
