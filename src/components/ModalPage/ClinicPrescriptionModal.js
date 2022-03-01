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
  DatePicker,
} from 'antd';
import regexHelper from '../../utils/regexHelper';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import debounce from 'lodash/debounce';
import DoctorSelect from '../Common/DoctorSelect';
import ReactToPrint from 'react-to-print';
import TableForm from '../ClinicPrescriptionComponents/TableForm';
import '../../utils/css/styleList.scss';

const { isPhone } = regexHelper;
const FormItem = Form.Item;

const ClinicPrescriptionModal = ({
  isMobile,
  intl,
  visible,
  titleModal,
  dataEdit,
  getList,
  dataCustomer,
}) => {
  const formRef = React.createRef();

  const dispatch = useDispatch();
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const [checkFirst, setCheckFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [data, setData] = useState({});
  const [key, setKey] = useState(Math.random());
  const [clinicPreMedicines, setClinicPreMedicines] = useState([]);

  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      getOne(dataEdit?.id);
      changeModal('show');
    }
  }, [visible]);

  const changeModal = (value) => {
    if (value === 'show') {
      setKey(key + 1);
      setVisibleModal(!visibleModal);
    } else if (value === 'close') {
      setVisibleModal(false);
    }
  };

  const getOne = (id) => {
    if (id) {
      setLoading(true);
      dispatch({
        type: 'clinicPrescription/getOne',
        payload: {
          id: id,
        },
        callback: (res) => {
          setLoading(false);
          if (res?.success) {
            const { list } = res.results;
            setData({
              customer: {
                id: dataCustomer?.customer?.id,
                mobile: dataCustomer?.customer?.mobile,
                customerName: dataCustomer?.customer?.customerName,
                dateOfBirth: dataCustomer?.customer?.dateOfBirth,
              },
              userId: dataCustomer?.userId,
              medicalRegisterId: dataCustomer?.medicalRegisterId,
              description: list?.description,
              sick: list?.sick,
              id: id,
            });
            const medicines = list.medicines;
            setClinicPreMedicines(
              medicines?.map((item) => {
                return {
                  medicineName: item.medicineName,
                  medicineId: item.id,
                  amount: item?.clinicPreMedicines?.amount,
                  unitId: item?.clinicPreMedicines?.unitId,
                  id: item?.clinicPreMedicines?.id,
                  unitName: item?.units?.map((it) => {
                    if (it.id === item?.clinicPreMedicines?.unitId) {
                      return it?.unitName;
                    }
                  })?.[0],
                  flag: 1,
                };
              })
            );
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
          medicalRegisterId: dataCustomer?.medicalRegisterId,
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
                dateOfBirth: moment(list[0].dateOfBirth),
                address: list[0].address,
              });
            } else {
              formRef.current.setFieldsValue({
                customerName: '',
                customerId: '',
                address: '',
                dateOfBirth: '',
              });
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
    formRef.current.validateFields().then((values) => {
      const addItem = {
        ...values,
        clinicPreMedicines,
        medicalRegisterId: data?.medicalRegisterId,
      };
      if (clinicPreMedicines.length === 0) {
        openNotification('error', 'Vui lòng thêm thuốc vào phiếu!', '#fff1f0');
      } else {
        if (data?.id) {
          dispatch({
            type: 'clinicPrescription/update',
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
                if (getList) {
                  getList();
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
            type: 'clinicPrescription/add',
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
                if (getList) {
                  getList();
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
    });
  };

  const handleReset = () => {
    formRef.current.resetFields();
  };

  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
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
            {titleModal}
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
            ,
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              onClick={() => handleSubmit()}
              style={{ marginRight: 30 }}
            >
              <i className="fa fa-save" />
              &nbsp;
              <FormattedMessage id="app.common.crudBtns.2" />
            </Button>
          </div>
        }
      >
        <Form
          hideRequiredMark
          initialValues={{
            customerId: data?.customer?.id,
            mobile: data?.customer?.mobile,
            address: data?.customer?.address,
            dateOfBirth: moment(data?.customer?.dateOfBirth),
            customerName: data?.customer?.customerName,
            userId: data?.userId,
            description: data?.description,
            sick: data?.sick,
          }}
          ref={formRef}
          key={`${data?.id}_${key}` || '0'}
        >
          <FormItem hidden name="customerId">
            <Input />
          </FormItem>
          <Spin spinning={loading}>
            <Row gutter={8}>
              <Col
                md={18}
                xs={24}
                style={{ marginBottom: isMobile ? '10px' : '0' }}
              >
                <FormItem>
                  <TableForm
                    isMobile={isMobile}
                    intl={intl}
                    value={clinicPreMedicines || []}
                    onChange={(data) => setClinicPreMedicines(data)}
                  />
                </FormItem>
              </Col>
              <Col md={6} xs={24}>
                <div
                  style={{
                    background: '#fff',
                    height: '82vh',
                    overflowY: 'auto',
                    padding: '0px 24px',
                  }}
                  className="col_card_custom"
                >
                  <h2
                    style={{
                      color: '#196CA6',
                      borderBottom: '1px solid #F1F1F1',
                    }}
                  >
                    {intl.formatMessage({ id: 'app.clinicResult.list.col9' })}
                  </h2>
                  <FormItem
                    {...formItemLayout}
                    name="mobile"
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.clinicPrescription.list.col1',
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
                      disabled
                      placeholder={intl.formatMessage({
                        id: 'app.clinicPrescription.list.mobile',
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
                          id: 'app.clinicPrescription.list.col2',
                        })}
                      </span>
                    }
                    name="customerName"
                  >
                    <Input
                      disabled
                      placeholder={intl.formatMessage({
                        id: 'app.clinicPrescription.list.customerName',
                      })}
                    />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.clinicPrescription.list.col3',
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
                      disabled
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      placeholder={intl.formatMessage({
                        id: 'app.clinicPrescription.list.dateOfBirth',
                      })}
                      disabledDate={(current) =>
                        current && current > moment().endOf('day')
                      }
                    />
                  </FormItem>
                  <h2
                    style={{
                      color: '#196CA6',
                      borderBottom: '1px solid #F1F1F1',
                      marginTop: 8,
                    }}
                  >
                    {intl.formatMessage({
                      id: 'app.clinicPrescription.list.col0',
                    })}
                  </h2>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.clinicPrescription.list.col4',
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
                    name="userId"
                    {...formItemLayout}
                  >
                    <DoctorSelect
                      disabled
                      placeholder={intl.formatMessage({
                        id: 'app.clinicPrescription.list.doctor',
                      })}
                    />
                  </FormItem>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.clinicPrescription.list.col5',
                        })}
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
                    name="sick"
                    {...formItemLayout}
                  >
                    <Input
                      placeholder={intl.formatMessage({
                        id: 'app.clinicPrescription.list.sick',
                      })}
                    />
                  </FormItem>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({
                          id: 'app.clinicPrescription.list.col6',
                        })}
                      </span>
                    }
                    name="description"
                    {...formItemLayout}
                  >
                    <Input.TextArea
                      placeholder={intl.formatMessage({
                        id: 'app.clinicPrescription.list.description',
                      })}
                      autoSize={{ minRows: 5 }}
                    />
                  </FormItem>
                </div>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default ClinicPrescriptionModal;
