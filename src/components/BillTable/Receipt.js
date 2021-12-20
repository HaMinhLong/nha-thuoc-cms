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
import WarehouseSelect from '../Common/WarehouseSelect';
import ShortCutSelectSupplier from '../ShortCutSelect/ShortCutSelectSupplier';

const FormItem = Form.Item;
const { invoiceCode } = regexHelper;

const Receipt = ({
  childrenOne,
  childrenTwo,
  intl,
  isMobile,
  permissions,
  spinning,
  dataInfo,
  receiptCode,
  getList,
  getReceiptCode,
  onCreate,
  dataMedicines,
}) => {
  const formRef = React.createRef();
  const dispatch = useDispatch();
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(Math.random());

  useEffect(() => {
    formRef.current.setFieldsValue({
      receiptCode: receiptCode.receiptCode,
    });
  }, [receiptCode]);

  useEffect(() => {
    formRef.current.setFieldsValue({
      receiptCode: dataInfo.receiptCode || receiptCode.receiptCode,
      shipperName: dataInfo.shipperName || '',
      userId: dataInfo.userId || '',
      paymentMethodId: dataInfo.paymentMethodId || '',
      warehouseId: dataInfo.warehouseId || '',
      debit: dataInfo.debit || false,
      description: dataInfo.description || '',
      status: dataInfo.status || 1,
    });
  }, [dataInfo.id]);

  const handleSubmit = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        setLoading(true);
        const addItem = {
          ...values,
          receiptCode: values.receiptCode && values.receiptCode.trim(),
          receiptCodeOld: dataInfo.receiptCode && dataInfo.receiptCode.trim(),
          shipperName: values.shipperName && values.shipperName.trim(),
          debit: values.debit || false,
          status: values.status || 1,
          healthFacilityId,
          medicines: dataMedicines,
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
              type: 'receipt/update',
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
              type: 'receipt/add',
              payload: addItem,
              callback: (res) => {
                if (res?.success) {
                  openNotification(
                    'success',
                    intl.formatMessage(
                      { id: 'app.common.create.success' },
                      {
                        name: intl.formatMessage({
                          id: 'app.receipt.list.title',
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
        id: receiptCode.id,
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
        title={<FormattedMessage id="app.receipt.list.header" />}
        action={
          <React.Fragment>
            <div>
              {permissions.isAdd && dataInfo.id && (
                <Tooltip
                  title={
                    !isMobile &&
                    intl.formatMessage({ id: 'app.receipt.create.header' })
                  }
                >
                  <Button
                    icon={
                      <i
                        className="fas fa-plus"
                        style={{ marginRight: '5px' }}
                      />
                    }
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
                    receiptCode: dataInfo.id
                      ? dataInfo.receiptCode
                      : receiptCode.receiptCode,
                    shipperName: dataInfo.id ? dataInfo.shipperName : '',
                    userId: dataInfo.id ? dataInfo.userId : '',
                    paymentMethodId: dataInfo.id
                      ? dataInfo.paymentMethodId
                      : '',
                    warehouseId: dataInfo.id ? dataInfo.warehouseId : '',
                    supplierId: dataInfo.id ? dataInfo.supplierId : '',
                    debit: dataInfo.id ? dataInfo.debit : false,
                    description: dataInfo.id ? dataInfo.description : '',
                    status: dataInfo.id ? dataInfo.status : 1,
                  }}
                  ref={formRef}
                  key={`${dataInfo.id}_${key}` || '0'}
                >
                  <Row gutter={10}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={
                          <span>
                            <span style={{ color: 'red' }}>*</span>&nbsp;
                            {intl.formatMessage({
                              id: 'app.receipt.list.col0',
                            })}
                          </span>
                        }
                        name="receiptCode"
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
                            id: 'app.receipt.list.name',
                          })}
                          size="small"
                          disabled
                        />
                      </FormItem>
                    </Col>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        // hasFeedback
                        label={
                          <span>
                            {intl.formatMessage({
                              id: 'app.receipt.list.col1',
                            })}
                          </span>
                        }
                        name="shipperName"
                      >
                        <Input
                          placeholder={intl.formatMessage({
                            id: 'app.receipt.list.shipper',
                          })}
                          id="shipperName"
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
                              id: 'app.receipt.list.col2',
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
                            id: 'app.receipt.list.receiver',
                          })}
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
                              id: 'app.receipt.list.col3',
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
                            id: 'app.receipt.list.paymentMethod',
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
                        name="warehouseId"
                        label={
                          <span>
                            <span style={{ color: 'red' }}>*</span>&nbsp;
                            {intl.formatMessage({
                              id: 'app.receipt.list.col4',
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
                        <WarehouseSelect
                          placeholder={intl.formatMessage({
                            id: 'app.receipt.list.warehouse',
                          })}
                          size="small"
                        />
                      </FormItem>
                    </Col>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        name="supplierId"
                        label={
                          <span>
                            <span style={{ color: 'red' }}>*</span>&nbsp;
                            {intl.formatMessage({
                              id: 'app.receipt.list.col5',
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
                        <ShortCutSelectSupplier
                          intl={intl}
                          isMobile={isMobile}
                          placeholder={intl.formatMessage({
                            id: 'app.receipt.list.supplier',
                          })}
                          size="small"
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
                            id: 'app.receipt.list.col6',
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
                              id: 'app.receipt.list.col7',
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
                            id: 'app.receipt.list.description',
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
