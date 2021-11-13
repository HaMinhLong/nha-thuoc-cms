import React, { useState, useEffect } from 'react';
import {
  Input,
  Row,
  Col,
  Button,
  Spin,
  Popconfirm,
  Form,
  Modal,
  notification,
} from 'antd';
import regexHelper from '../../utils/regexHelper';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ProvinceSelect from '../Common/ProvinceSelect';
import DistrictSelect from '../Common/DistrictSelect';
import WardSelect from '../Common/WardSelect';
import MedicalFacilityGroupSelect from '../Common/MedicalFacilityGroupSelect.js';

const FormItem = Form.Item;
const { isFullName, isPhone, isEmail } = regexHelper;

const HealthFacilityModal = ({
  intl,
  visible,
  dataEdit,
  titleDrawer,
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
      getOne(dataEdit && dataEdit.id);
    }
  }, [visible]);

  const getOne = (id) => {
    if (id) {
      setLoading(true);
      dispatch({
        type: 'healthFacility/getOne',
        payload: {
          id: id,
        },
        callback: (res) => {
          setLoading(false);
          if (res && res.success) {
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
        const addItem = {
          ...values,
          healthFacilityName:
            values.healthFacilityName && values.healthFacilityName.trim(),
          healthFacilityCode:
            values.healthFacilityCode && values.healthFacilityCode.trim(),
          taxCode: values.taxCode && values.taxCode.trim(),
          healthFacilityNameOld:
            values.healthFacilityName && values.healthFacilityName.trim(),
        };
        if (data.id) {
          dispatch({
            type: 'healthFacility/update',
            payload: {
              id: data.id,
              params: {
                ...addItem,
              },
            },
            callback: (res) => {
              setLoading(false);
              if (res && res.success) {
                openNotification(
                  'success',
                  intl.formatMessage({ id: 'app.common.edit.success' }),
                  '#f6ffed'
                );
                getList();
                changeModal('close');
              } else {
                openNotification('error', res && res.message, '#fff1f0');
              }
            },
          });
        } else {
          dispatch({
            type: 'healthFacility/add',
            payload: addItem,
            callback: (res) => {
              setLoading(false);
              if (res && res.success) {
                openNotification(
                  'success',
                  intl.formatMessage(
                    { id: 'app.common.create.success' },
                    { name: titleDrawer }
                  ),
                  '#f6ffed'
                );
                getList();
                changeModal('close');
              } else {
                openNotification('error', res && res.message, '#fff1f0');
              }
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
      title={
        <h3 style={{ color: '#196CA6', marginBottom: '0px' }}>
          {data.id
            ? intl.formatMessage(
                { id: 'app.title.update' },
                { name: data.healthFacilityName }
              )
            : intl.formatMessage({ id: 'app.healthFacility.create.header' })}
        </h3>
      }
      style={{ top: 0 }}
      width={'100%'}
      bodyStyle={{ minHeight: '85vh' }}
      maskStyle={{ backgroundColor: '#ECEFF4' }}
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
            style={{ marginLeft: 8 }}
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
            healthFacilityName: data.healthFacilityName || '',
            healthFacilityCode: data.healthFacilityCode || '',
            taxCode: data.taxCode || '',
            email: data.email || '',
            mobile: data.mobile || '',
            provinceId: data.provinceId || '',
            districtId: data.districtId || '',
            wardId: data.wardId || '',
            address: data.address || '',
            representativeName: data.representativeName || '',
            representativeMobile: data.representativeMobile || '',
            medicalFacilityGroupId: data.medicalFacilityGroupId || '',
            status: data.id ? data.status : -2,
          }}
          ref={formRef}
          layout="vertical"
          key={`${data.id}_${key}` || '0'}
        >
          <Row gutter={[20, 20]}>
            <Col xs={24} md={24} lg={24}>
              <h3
                style={{
                  color: '#1878BC',
                  borderBottom: '1px solid #e2e2e2',
                }}
              >
                Thông tin cơ sở y tế
              </h3>
              <Row gutter={[20, 0]} style={{ marginTop: 20 }}>
                <Col xs={24} md={12} lg={8} xl={6}>
                  <FormItem
                    name="medicalFacilityGroupId"
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        <FormattedMessage id="app.healthFacility.list.col10" />
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
                    <MedicalFacilityGroupSelect
                      placeholder={intl.formatMessage({
                        id: 'app.healthFacility.list.medicalFacilityGroup',
                      })}
                      allowClear
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={12} lg={8} xl={6}>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.healthFacility.list.col1',
                        })}
                      </span>
                    }
                    name="healthFacilityName"
                    rules={[
                      {
                        pattern: isFullName,
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
                        id: 'app.healthFacility.list.healthFacilityName',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={12} lg={8} xl={6}>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.healthFacility.list.col2',
                        })}
                      </span>
                    }
                    name="healthFacilityCode"
                    rules={[
                      {
                        pattern: isFullName,
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
                        id: 'app.healthFacility.list.healthFacilityCode',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={12} lg={8} xl={6}>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.healthFacility.list.col5',
                        })}
                      </span>
                    }
                    name="taxCode"
                    rules={[
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
                        id: 'app.healthFacility.list.taxCode',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={12} lg={8} xl={6}>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.healthFacility.list.col3',
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
                        id: 'app.healthFacility.list.email',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={12} lg={8} xl={6}>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({
                          id: 'app.healthFacility.list.col4',
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
                    ]}
                  >
                    <Input
                      placeholder={intl.formatMessage({
                        id: 'app.healthFacility.list.phone',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={12} lg={8} xl={6}>
                  <FormItem
                    name="provinceId"
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        <FormattedMessage id="app.healthFacility.list.col6" />
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
                    <ProvinceSelect
                      placeholder={intl.formatMessage({
                        id: 'app.healthFacility.list.province',
                      })}
                      allowClear
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={12} lg={8} xl={6}>
                  <FormItem
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.provinceId !== currentValues.provinceId
                    }
                    noStyle
                  >
                    {({ getFieldValue }) => (
                      <FormItem
                        name="districtId"
                        label={
                          <span>
                            <span style={{ color: 'red' }}>*</span>&nbsp;
                            <FormattedMessage id="app.healthFacility.list.col7" />
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
                        <DistrictSelect
                          placeholder={intl.formatMessage({
                            id: 'app.healthFacility.list.district',
                          })}
                          filter
                          filterField={getFieldValue('provinceId') || 'a'}
                          allowClear
                        />
                      </FormItem>
                    )}
                  </FormItem>
                </Col>
                <Col xs={24} md={12} lg={8} xl={6}>
                  <FormItem
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.districtId !== currentValues.districtId
                    }
                    noStyle
                  >
                    {({ getFieldValue }) => (
                      <FormItem
                        name="wardId"
                        label={
                          <span>
                            <span style={{ color: 'red' }}>*</span>&nbsp;
                            <FormattedMessage id="app.healthFacility.list.col8" />
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
                        <WardSelect
                          placeholder={intl.formatMessage({
                            id: 'app.healthFacility.list.ward',
                          })}
                          filter
                          filterField={getFieldValue('districtId') || 'a'}
                          allowClear
                        />
                      </FormItem>
                    )}
                  </FormItem>
                </Col>
                <Col xs={24} md={12} lg={8} xl={6}>
                  <FormItem
                    name="address"
                    label={
                      <span>
                        <FormattedMessage id="app.healthFacility.list.col9" />
                      </span>
                    }
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
                        id: 'app.healthFacility.list.address',
                      })}
                      suffix={<span className="suffix">[200]</span>}
                    />
                  </FormItem>
                </Col>
                <FormItem
                  // {...formItemLayout}
                  hidden
                  name="status"
                  // valuePropName="checked"
                >
                  <Input />
                </FormItem>
              </Row>
            </Col>
            <Col xs={24} md={24} lg={24}>
              <h3
                style={{ color: '#1878BC', borderBottom: '1px solid #e2e2e2' }}
              >
                Thông tin người đại diện
              </h3>
              <Row gutter={[20, 0]} style={{ marginTop: 20 }}>
                <Col xs={24} md={12} lg={8} xl={6}>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.healthFacility.list.col11',
                        })}
                      </span>
                    }
                    name="representativeName"
                    rules={[
                      {
                        pattern: isFullName,
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
                        id: 'app.healthFacility.list.fullName',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={12} lg={8} xl={6}>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.healthFacility.list.col12',
                        })}
                      </span>
                    }
                    name="representativeMobile"
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
                        id: 'app.healthFacility.list.phone2',
                      })}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default HealthFacilityModal;
