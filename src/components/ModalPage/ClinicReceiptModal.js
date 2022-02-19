import React, { useState, useEffect } from 'react';
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
  Switch,
} from 'antd';
import regexHelper from '../../utils/regexHelper';
import NumberInput from '../NumberInput/NumberInput';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import debounce from 'lodash/debounce';
import ShortCutSelectPaymentMethod from '../ShortCutSelect/ShortCutSelectPaymentMethod';
import '../../utils/css/styleIssu.scss';
import TableForm from '../ClinicReceiptComponents/TableForm';
import ReactToPrint from 'react-to-print';
import Receipt from '../PrintTemplate/Clinic/Receipt';

const { isPhone, invoiceCode } = regexHelper;
const FormItem = Form.Item;

const ClinicReceiptModal = ({
  intl,
  visible,
  dataEdit,
  titleModal,
  isMobile,
  getList,
  dataClinicReceiptServices,
  dataClinicRegister,
  getListMedicalRegister,
}) => {
  const dispatch = useDispatch();
  const componentRef = React.useRef();
  const formRef = React.createRef();
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const [checkFirst, setCheckFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [data, setData] = useState({});
  const [clinicReceiptCode, setClinicReceiptCode] = useState({});
  const [exitsCustomer, setExitsCustomer] = useState(false);
  const [key, setKey] = useState(Math.random());
  const [totalMoney, setTotalMoney] = useState(0);
  const [clinicReceiptServices, setClinicReceiptServices] = useState([]);
  const [dataForm, setDataForm] = useState([]);

  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      changeModal('show');
      getReceiptCode();
      getOne(dataEdit?.id);
    }
    if (dataClinicReceiptServices) {
      setClinicReceiptServices(dataClinicReceiptServices);
      setTotalMoney(dataClinicReceiptServices?.[0]?.total);
    }
  }, [visible]);

  const getOne = (id) => {
    if (id) {
      setLoading(true);
      dispatch({
        type: 'clinicReceipt/getOne',
        payload: {
          id: id,
        },
        callback: (res) => {
          setLoading(false);
          if (res?.success) {
            const { list } = res.results;
            setData(list);
            setTotalMoney(list.total);
            setClinicReceiptServices(
              list?.clinicServices?.map((item) => {
                return {
                  id: item?.clinicReceiptServices?.id,
                  clinicTypeId: item?.clinicServicePackage?.clinicType?.id,
                  clinicTypeName:
                    item?.clinicServicePackage?.clinicType?.clinicTypeName,
                  clinicServicePackageId: item?.clinicServicePackage?.id,
                  clinicServiceId: item?.id,
                  clinicServiceName: item?.clinicServiceName,
                  userId: item?.clinicReceiptServices?.userId,
                  price: item?.clinicReceiptServices?.price,
                  amount: item?.clinicReceiptServices?.amount,
                  total: item?.clinicReceiptServices?.total,
                  discount: item?.clinicReceiptServices?.discount,
                  discountType: item?.clinicReceiptServices?.discountType,
                  tax: item?.clinicReceiptServices?.tax,
                  taxType: item?.clinicReceiptServices?.taxType,
                  flag: 1,
                };
              })
            );
          }
        },
      });
    } else {
      setData({});
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
        attributes: 'id,customerName,status,address,dateOfBirth',
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
                customerId: list[0].id,
                customerName: `${list[0].customerName}`,
                dateOfBirth: list[0].dateOfBirth,
                address: list[0].address,
              });
              setExitsCustomer(true);
            } else {
              formRef.current.setFieldsValue({
                customerName: '',
                customerId: '',
                address: '',
                dateOfBirth: '',
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

  const getReceiptCode = () => {
    let params = {
      filter: JSON.stringify({
        healthFacilityId: healthFacilityId,
        formType: '5',
      }),
    };
    dispatch({
      type: 'receiptCode/getOne',
      payload: params,
      callback: (res) => {
        if (res?.success) {
          const { list } = res.results;
          setClinicReceiptCode(list);
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

  const handleCustomerBrought = () => {
    const customerBrought = formRef.current.getFieldValue('customerBrought');

    const total = data.id ? data.total : totalMoney;
    if (customerBrought >= total) {
      formRef.current.setFieldsValue({
        paid: total,
        giveBack: customerBrought - total,
      });
    } else {
      formRef.current.setFieldsValue({
        paid: customerBrought,
        giveBack: customerBrought - total,
      });
    }
  };

  const handleConfirm = () => {
    formRef.current.validateFields().then((values) => {
      const addItem = {
        ...values,
        total: totalMoney,
        clinicReceiptServices,
        healthFacilityId,
        exitsCustomer,
      };
      setDataForm(addItem);
      const modal = Modal.confirm({
        title: intl.formatMessage({ id: 'app.receipt.list.col13' }),
        content: (
          <React.Fragment>
            <i
              className="fas fa-times"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
              }}
              onClick={() => {
                modal.destroy();
              }}
            />
            {intl.formatMessage({ id: 'app.receipt.list.col12' })}
          </React.Fragment>
        ),
        okText: intl.formatMessage({ id: 'app.common.yes' }),
        cancelText: intl.formatMessage({ id: 'app.common.no' }),
        onOk: () => handleSubmitAndPrint(true, values),
        onCancel: () => handleSubmitAndPrint(false, values),
      });
    });
  };

  // Lưu giá trị thay đổi và in
  const handleSubmitAndPrint = (flag, values) => {
    if (flag) {
      document.getElementById('print').click();
    }
    handleSubmit(values);
  };

  const handleSubmit = (values) => {
    const addItem = {
      ...values,
      total: totalMoney,
      clinicReceiptServices,
      healthFacilityId,
      exitsCustomer,
      exitsClinicRegister: dataClinicReceiptServices ? true : false,
      medicalRegisterId: dataClinicRegister?.id,
    };
    if (clinicReceiptServices.length === 0) {
      openNotification(
        'error',
        'Vui lòng thêm dịch vụ vào phiếu thu!',
        '#fff1f0'
      );
    } else {
      if (!addItem.payLater && addItem.paid < addItem.total) {
        openNotification('error', 'Vui lòng thanh toán phiếu thu!', '#fff1f0');
      } else {
        if (data.id) {
          dispatch({
            type: 'clinicReceipt/update',
            payload: {
              id: data.id,
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
                if (getList) {
                  getList();
                }
                if (getListMedicalRegister) {
                  getListMedicalRegister();
                }
                changeModal('close');
              } else {
                openNotification('error', res.message, '#fff1f0');
              }
              setLoading(false);
            },
          });
        } else {
          dispatch({
            type: 'clinicReceipt/add',
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
                updateReceiptCode();
                if (getList) {
                  getList();
                }
                if (getListMedicalRegister) {
                  getListMedicalRegister();
                }
                changeModal('close');
              } else {
                openNotification('error', res.message, '#fff1f0');
              }
              setLoading(false);
            },
          });
        }
      }
    }
  };

  const updateReceiptCode = () => {
    dispatch({
      type: 'receiptCode/update',
      payload: {
        id: clinicReceiptCode.id,
      },
      callback: (res) => {
        if (res?.success) {
          getReceiptCode();
        }
      },
    });
  };

  const handleClinicReceiptServices = (value) => {
    setClinicReceiptServices(value);
    let total = 0;
    value?.map((item) => {
      total += item.total;
    });
    setTotalMoney(total);
    if (data.id) {
      setData({ ...data, total: total });
    }
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
      setClinicReceiptServices([]);
      setTotalMoney(0);
    }
  };

  const formItemLayout = {
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
    colon: false,
    labelAlign: 'left',
    style: { marginBottom: 8 },
  };

  const formItemLayout2 = {
    labelAlign: 'left',
    labelCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 12 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 12 },
    },
    colon: false,
    style: { marginBottom: 8 },
  };

  return (
    <>
      <Modal
        title={
          <p
            style={{
              fontWeight: '600',
              fontSize: 18,
              textTransform: 'uppercase',
            }}
          >
            {data.id
              ? intl.formatMessage({ id: 'app.clinicReceipt.update.header' })
              : intl.formatMessage({ id: 'app.clinicReceipt.create.header' })}
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
              onClick={() => handleConfirm()}
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
            // onSubmit={this.handleSubmit}
            initialValues={{
              clinicReceiptCode: data.id
                ? data.clinicReceiptCode
                : clinicReceiptCode.receiptCode,
              mobile: data?.customer?.mobile,
              address: data?.customer?.address,
              dateOfBirth: data?.customer?.dateOfBirth,
              customerName: data?.customer?.customerName,
              clinicReceiptId: data?.id,
              customerId: data?.customer?.id,
              paymentMethodId: data.id ? data.paymentMethodId : '',
              description: data.id ? data.description : '',
              paid: data.id ? data.paid : 0,
              customerBrought: data.id ? data.customerBrought : 0,
              giveBack: data.id ? data.giveBack : 0,
              payLater: data.id ? data.payLater : false,
              status: data.id ? data.status : 1,
            }}
            ref={formRef}
            key={`${data?.id}_${key}` || '0'}
          >
            <FormItem hidden name="customerId">
              <Input />
            </FormItem>
            <FormItem hidden name="address">
              <Input />
            </FormItem>
            <FormItem hidden name="dateOfBirth">
              <Input />
            </FormItem>
            <FormItem hidden name="status">
              <Input />
            </FormItem>
            <Row gutter={20} justify="center">
              <Col sm={18} xs={24}>
                <div
                  style={{
                    height: '73vh',
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      overflowY: 'auto',
                      overflowX: isMobile ? 'auto' : 'hidden',
                      padding: '9px 10px 0px',
                    }}
                  >
                    <TableForm
                      isMobile={isMobile}
                      intl={intl}
                      value={clinicReceiptServices}
                      onChange={(data) => handleClinicReceiptServices(data)}
                    />

                    <div
                      className="backgroundIsu2"
                      style={{
                        marginTop: '20px',
                        position: 'absolute',
                        bottom: 0,
                        boxShadow: 'none',
                        left: '20px',
                        right: '20px',
                        border: '1px solid #bbb',
                      }}
                    >
                      <Row gutter={20}>
                        <Col sm={10} xs={24}>
                          <FormItem
                            {...formItemLayout2}
                            label={
                              <span
                                style={{
                                  fontSize: '16px',
                                  fontWeight: '500',
                                  color: 'red',
                                  alignSelf: 'center',
                                }}
                              >
                                {intl.formatMessage({
                                  id: 'app.clinicReceipt.list.col6',
                                })}
                              </span>
                            }
                          >
                            <NumberInput
                              disabled
                              className="inputNumberHiddenBorder1"
                              value={data.id ? data.total : totalMoney}
                              style={{
                                fontWeight: 'bold',
                                fontSize: '18px',
                                color: 'rgba(0, 0, 0, 0.45)',
                                width: '100%',
                              }}
                            />
                          </FormItem>
                          <FormItem
                            {...formItemLayout2}
                            label={
                              <span
                                style={{
                                  fontSize: '16px',
                                  fontWeight: '500',
                                  color: 'gray',
                                  alignSelf: 'center',
                                }}
                              >
                                {intl.formatMessage({
                                  id: 'app.clinicReceipt.list.col8',
                                })}
                              </span>
                            }
                            name="customerBrought"
                          >
                            <NumberInput
                              className="inputNumberHiddenBorder1"
                              onBlur={() => handleCustomerBrought()}
                              style={{
                                fontWeight: 'bold',
                                fontSize: '18px',
                                color: 'black',
                                width: '100%',
                              }}
                            />
                          </FormItem>
                        </Col>
                        <Col sm={10} xs={24}>
                          <FormItem
                            {...formItemLayout2}
                            name="paid"
                            label={
                              <span
                                style={{
                                  fontSize: '16px',
                                  fontWeight: '500',
                                  color: 'gray',
                                  alignSelf: 'center',
                                }}
                              >
                                {intl.formatMessage({
                                  id: 'app.clinicReceipt.list.col7',
                                })}
                              </span>
                            }
                          >
                            <NumberInput
                              disabled
                              className="inputNumberHiddenBorder1"
                              style={{
                                fontWeight: 'bold',
                                fontSize: '18px',
                                color: 'rgba(0, 0, 0, 0.45)',
                                width: '100%',
                              }}
                            />
                          </FormItem>
                          <FormItem
                            {...formItemLayout2}
                            name="giveBack"
                            label={
                              <span
                                style={{
                                  fontSize: '16px',
                                  fontWeight: '500',
                                  color: 'red',
                                  alignSelf: 'center',
                                }}
                              >
                                {intl.formatMessage({
                                  id: 'app.clinicReceipt.list.col9',
                                })}
                              </span>
                            }
                          >
                            <NumberInput
                              disabled
                              min={-Infinity}
                              className="inputNumberHiddenBorder1"
                              style={{
                                fontWeight: 'bold',
                                fontSize: '18px',
                                color: 'rgba(0, 0, 0, 0.9)',
                                width: '100%',
                              }}
                            />
                          </FormItem>
                        </Col>
                        <Col sm={4} xs={24}>
                          <FormItem
                            {...formItemLayout}
                            name="payLater"
                            label={
                              <span
                                style={{
                                  fontSize: '16px',
                                  fontWeight: '500',
                                  color: 'green',
                                  alignSelf: 'center',
                                }}
                              >
                                {intl.formatMessage({
                                  id: 'app.clinicReceipt.list.col10',
                                })}
                              </span>
                            }
                          >
                            <Switch
                              checked={data?.payLater || false}
                              onChange={(checked) =>
                                setData({ ...data, payLater: checked })
                              }
                            />
                          </FormItem>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
              <Col sm={6} xs={24} style={{ padding: '0px' }}>
                <div
                  // className={stylesIssu.backgroundIsu}
                  style={{
                    height: '80vh',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                  }}
                >
                  <h2
                    style={{
                      color: '#196CA6',
                      borderBottom: '1px solid #F1F1F1',
                      lineHeight: '40px',
                    }}
                  >
                    {intl.formatMessage({ id: 'app.clinicReceipt.list.col13' })}
                  </h2>
                  <FormItem
                    {...formItemLayout}
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.clinicReceipt.list.col0',
                        })}
                      </span>
                    }
                    name="clinicReceiptCode"
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
                        id: 'app.clinicReceipt.list.name',
                      })}
                      disabled
                    />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    name="mobile"
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.clinicReceipt.list.col1',
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
                        id: 'app.clinicReceipt.list.mobile',
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
                          id: 'app.clinicReceipt.list.col2',
                        })}
                      </span>
                    }
                    name="customerName"
                  >
                    <Input
                      placeholder={intl.formatMessage({
                        id: 'app.clinicReceipt.list.customerName',
                      })}
                    />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    name="paymentMethodId"
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.clinicReceipt.list.col4',
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
                        id: 'app.clinicReceipt.list.paymentMethod',
                      })}
                    />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={
                      <span>
                        {intl.formatMessage({
                          id: 'app.clinicReceipt.list.col5',
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
                        id: 'app.clinicReceipt.list.description',
                      })}
                      className="input_descriptions"
                      suffix={<span className="suffix">200</span>}
                    />
                  </FormItem>
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
      <div style={{ display: 'none' }}>
        <ReactToPrint
          trigger={() => (
            <Button
              id="print"
              type="primary"
              style={{ marginLeft: 8 }}
              // loading={submitting}
            >
              {intl.formatMessage({ id: 'app.receipt.list.col12' })}
            </Button>
          )}
          content={() => componentRef.current}
        />
        <div ref={componentRef}>
          <Receipt
            isMobile={isMobile}
            title={intl.formatMessage({
              id: 'app.clinicReceipt.list.title1',
            })}
            dataForm={dataForm}
          />
        </div>
      </div>
    </>
  );
};

export default ClinicReceiptModal;
