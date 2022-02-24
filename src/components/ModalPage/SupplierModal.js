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
} from 'antd';
import regexHelper from '../../utils/regexHelper';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ShortCutSelectSupplierGroup from '../ShortCutSelect/ShortCutSelectSupplierGroup';
const { isFullNameNnumber2, isPhone, isEmail, isNumber, isUrl } = regexHelper;
const FormItem = Form.Item;

const SupplierModal = ({
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
        type: 'supplier/getOne',
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
          supplierName: values.supplierName && values.supplierName.trim(),
          supplierNameOld: data.supplierName,
          healthFacilityId,
        };
        if (data?.id) {
          dispatch({
            type: 'supplier/update',
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
          dispatch({
            type: 'supplier/add',
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
          <p
            style={{
              fontWeight: '600',
              fontSize: 18,
              textTransform: 'uppercase',
            }}
          >
            {data?.id
              ? intl.formatMessage(
                  { id: 'app.title.update' },
                  { name: data.supplierName }
                )
              : intl.formatMessage({ id: 'app.supplier.create.header' })}
          </p>
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
                supplierName: data.supplierName || '',
                supplierGroupId: data.supplierGroupId || '',
                mobile: data.mobile || '',
                taxCode: data.taxCode || '',
                email: data.email || '',
                website: data.website || '',
                address: data.address || '',
                description: data.description || '',
                status: data?.id ? data.status : 1,
              }}
              ref={formRef}
              layout="vertical"
              key={`${data?.id}_${key}` || '0'}
            >
              <Row gutter={20}>
                <Col xs={24} md={8}>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.supplier.list.col0',
                        })}
                      </span>
                    }
                    name="supplierName"
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
                        id: 'app.supplier.list.name',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={8}>
                  <FormItem
                    name="supplierGroupId"
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        <FormattedMessage id="app.supplier.list.col1" />
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
                    <ShortCutSelectSupplierGroup
                      isMobile={isMobile}
                      intl={intl}
                      placeholder={intl.formatMessage({
                        id: 'app.supplier.list.supplierGroup',
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
                          id: 'app.supplier.list.col2',
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
                        id: 'app.supplier.list.mobile',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={8}>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({
                          id: 'app.supplier.list.col3',
                        })}
                      </span>
                    }
                    name="taxCode"
                    rules={[
                      {
                        pattern: isNumber,
                        message: intl.formatMessage({
                          id: 'app.common.crud.validate.number',
                        }),
                      },
                    ]}
                  >
                    <Input
                      placeholder={intl.formatMessage({
                        id: 'app.supplier.list.taxCode',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={8}>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({
                          id: 'app.supplier.list.col4',
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
                        id: 'app.supplier.list.email',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={8}>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({
                          id: 'app.supplier.list.col5',
                        })}
                      </span>
                    }
                    name="website"
                    rules={[
                      {
                        pattern: isUrl,
                        message: intl.formatMessage({
                          id: 'app.common.crud.validate.url',
                        }),
                      },
                    ]}
                  >
                    <Input
                      placeholder={intl.formatMessage({
                        id: 'app.supplier.list.website',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={12}>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({ id: 'app.supplier.list.col6' })}
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
                        id: 'app.supplier.list.address',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={12}>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({ id: 'app.supplier.list.col8' })}
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
                        id: 'app.supplier.list.description',
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

export default SupplierModal;
