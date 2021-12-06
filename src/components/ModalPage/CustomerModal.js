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
  Card,
  PageHeader,
  Select,
  DatePicker,
} from 'antd';
import regexHelper from '../../utils/regexHelper';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ShortCutSelectCustomerGroup from '../ShortCutSelect/ShortCutSelectCustomerGroup';
import moment from 'moment';
const { isFullNameNnumber2, isPhone, isEmail } = regexHelper;
const FormItem = Form.Item;

const CustomerModal = ({
  intl,
  visible,
  dataEdit,
  titleModal,
  isMobile,
  getList,
}) => {
  const dispatch = useDispatch();
  const formRef = React.createRef();
  const [checkFirst, setCheckFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [data, setData] = useState({});
  const [key, setKey] = useState(Math.random());
  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      changeModal('show');
      getOne(dataEdit?.id);
    }
  }, [visible]);

  const getOne = (id) => {
    if (id) {
      setLoading(true);
      dispatch({
        type: 'customer/getOne',
        payload: {
          id: id,
        },
        callback: (res) => {
          setLoading(false);
          if (res?.success) {
            const { list } = res.results;
            setData(list);
          }
        },
      });
    } else {
      setData({});
    }
  };

  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };
  const handleSubmit = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        setLoading(true);
        const healthFacilityId = localStorage.getItem('healthFacilityId');
        const addItem = {
          ...values,
          customerName: values.customerName && values.customerName.trim(),
          customerNameOld: data.customerName,
          healthFacilityId,
        };
        if (data.id) {
          dispatch({
            type: 'customer/update',
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
                getList();
                changeModal('close');
              } else {
                openNotification('error', res.message, '#fff1f0');
              }
              setLoading(false);
            },
          });
        } else {
          dispatch({
            type: 'customer/add',
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
      })
      .catch(({ errorFields }) => {
        formRef.current.scrollToField(errorFields[0].name);
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
    }
  };
  return (
    <Modal
      width={isMobile ? '100%' : '70%'}
      style={{
        top: isMobile ? 0 : 30,
        margin: '0 auto',
      }}
      bodyStyle={{
        minHeight: '70vh',
        padding: '0px 0px 10px',
        background: '#F4F4F4',
      }}
      confirmLoading={loading}
      onCancel={() => changeModal('close')}
      visible={visibleModal}
      footer={null}
    >
      <PageHeader
        title={
          data.id
            ? intl.formatMessage(
                { id: 'app.title.update' },
                { name: data.customerName }
              )
            : intl.formatMessage({ id: 'app.customer.create.header' })
        }
        extra={[
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
          </Popconfirm>,
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
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Card
            bordered={false}
            style={{ boxShadow: '0px 0px 5px #00000029' }}
            bodyStyle={{ padding: '10px 10px 20px 10px', minHeight: '70vh' }}
          >
            <Form
              hideRequiredMark
              style={{ marginTop: 8 }}
              initialValues={{
                customerName: data.customerName || '',
                customerGroupId: data.customerGroupId || '',
                mobile: data.mobile || '',
                dateOfBirth: data.dateOfBirth
                  ? moment(data.dateOfBirth)
                  : moment(),
                gender: data.gender || undefined,
                email: data.email || '',
                address: data.address || '',
                status: data.id ? data.status : 1,
              }}
              ref={formRef}
              layout="vertical"
              key={`${data.id}_${key}` || '0'}
            >
              <Row gutter={20}>
                <Col xs={24} md={8}>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.customer.list.col0',
                        })}
                      </span>
                    }
                    name="customerName"
                    rules={[
                      {
                        pattern: isFullNameNnumber2,
                        message: intl.formatMessage({
                          id: 'app.common.crud.validate.fomat',
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
                        id: 'app.customer.list.name',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={8}>
                  <FormItem
                    name="customerGroupId"
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        <FormattedMessage id="app.customer.list.col1" />
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
                    <ShortCutSelectCustomerGroup
                      isMobile={isMobile}
                      intl={intl}
                      placeholder={intl.formatMessage({
                        id: 'app.customer.list.customerGroup',
                      })}
                      allowClear
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={8}>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.customer.list.col2',
                        })}
                      </span>
                    }
                    name="mobile"
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
                        id: 'app.customer.list.mobile',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={8}>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.customer.list.col3',
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
                        id: 'app.customer.list.dateOfBirth',
                      })}
                      disabledDate={(current) =>
                        current && current > moment().endOf('day')
                      }
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={8}>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.customer.list.col4',
                        })}
                      </span>
                    }
                    name="gender"
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
                        id: 'app.customer.list.gender',
                      })}
                    >
                      <Select.Option value={1}>
                        {intl.formatMessage({ id: 'app.customer.list.col11' })}
                      </Select.Option>
                      <Select.Option value={2}>
                        {intl.formatMessage({ id: 'app.customer.list.col12' })}
                      </Select.Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col xs={24} md={8}>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({
                          id: 'app.customer.list.col5',
                        })}
                      </span>
                    }
                    name="email"
                    rules={[
                      {
                        pattern: isEmail,
                        message: intl.formatMessage({
                          id: 'app.common.crud.validate.phone_email',
                        }),
                      },
                    ]}
                  >
                    <Input
                      placeholder={intl.formatMessage({
                        id: 'app.customer.list.email',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={24}>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({ id: 'app.customer.list.col9' })}
                      </span>
                    }
                    name="address"
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
                        id: 'app.customer.list.address',
                      })}
                    />
                  </FormItem>
                </Col>

                <FormItem
                  // {...formItemLayout}
                  hidden
                  name="status"
                  valuePropName="checked"
                >
                  <Input />
                </FormItem>
              </Row>
            </Form>
          </Card>
        </Spin>
      </PageHeader>
    </Modal>
  );
};

export default CustomerModal;
