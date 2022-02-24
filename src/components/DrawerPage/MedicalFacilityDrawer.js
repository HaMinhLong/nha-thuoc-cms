import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Spin,
  Popconfirm,
  Form,
  Drawer,
  notification,
} from 'antd';
import regexHelper from '../../utils/regexHelper';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ProvinceSelect from '../../components/Common/ProvinceSelect';
import DistrictSelect from '../../components/Common/DistrictSelect';
import WardSelect from '../../components/Common/WardSelect';

const FormItem = Form.Item;
const { isFullName, isPhone, isEmail } = regexHelper;

const PlaceDrawer = ({
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
  const [visibleDrawer, setVisibleDrawer] = useState(false);
  const [data, setData] = useState({});
  const [key, setKey] = useState(Math.random());
  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      changeDrawer('show');
      getOne(dataEdit?.id);
    }
  }, [visible]);

  const getOne = (id) => {
    if (id) {
      setLoading(true);
      dispatch({
        type: 'medicalFacility/getOne',
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
        const addItem = {
          ...values,
          medicalFacilityName:
            values.medicalFacilityName && values.medicalFacilityName.trim(),
          medicalFacilityNameOld:
            values.medicalFacilityName && values.medicalFacilityName.trim(),
        };
        if (data?.id) {
          dispatch({
            type: 'medicalFacility/update',
            payload: {
              id: data?.id,
              params: {
                ...addItem,
              },
            },
            callback: (res) => {
              setLoading(false);
              if (res?.success) {
                openNotification(
                  'success',
                  intl.formatMessage({ id: 'app.common.edit.success' }),
                  '#f6ffed'
                );
                getList();
                changeDrawer('close');
              } else {
                openNotification('error', res && res.message, '#fff1f0');
              }
            },
          });
        } else {
          dispatch({
            type: 'medicalFacility/add',
            payload: addItem,
            callback: (res) => {
              setLoading(false);
              if (res?.success) {
                openNotification(
                  'success',
                  intl.formatMessage(
                    { id: 'app.common.create.success' },
                    { name: titleDrawer }
                  ),
                  '#f6ffed'
                );
                getList();
                changeDrawer('close');
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
  const changeDrawer = (value) => {
    if (value === 'show') {
      setVisibleDrawer(!visibleDrawer);
      setKey(key + 1);
    } else if (value === 'close') {
      setVisibleDrawer(false);
      setData({});
    }
  };
  return (
    <Drawer
      title={
        <h3 style={{ color: '#196CA6', marginBottom: '0px' }}>
          {data?.id
            ? intl.formatMessage(
                { id: 'app.title.update' },
                { name: data.medicalFacilityName }
              )
            : intl.formatMessage({ id: 'app.medicalFacility.create.header' })}
        </h3>
      }
      placement="right"
      width={isMobile ? '100%' : 420}
      onClose={() => changeDrawer('close')}
      visible={visibleDrawer}
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
            medicalFacilityName: data.medicalFacilityName || '',
            email: data.email || '',
            mobile: data.mobile || '',
            provinceId: data.provinceId || '',
            districtId: data.districtId || '',
            wardId: data.wardId || '',
            address: data.address || '',
            status: data?.id ? data.status : 1,
          }}
          ref={formRef}
          layout="vertical"
          key={`${data?.id}_${key}` || '0'}
        >
          <FormItem
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>&nbsp;
                {intl.formatMessage({
                  id: 'app.medicalFacility.list.col1',
                })}
              </span>
            }
            name="medicalFacilityName"
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
                id: 'app.medicalFacility.list.medicalFacilityName',
              })}
            />
          </FormItem>
          <FormItem
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>&nbsp;
                {intl.formatMessage({
                  id: 'app.medicalFacility.list.col2',
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
                id: 'app.medicalFacility.list.email',
              })}
            />
          </FormItem>
          <FormItem
            label={
              <span>
                {intl.formatMessage({
                  id: 'app.medicalFacility.list.col3',
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
                id: 'app.medicalFacility.list.phone',
              })}
            />
          </FormItem>

          <FormItem
            name="provinceId"
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>&nbsp;
                <FormattedMessage id="app.medicalFacility.list.col4" />
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
                id: 'app.medicalFacility.list.province',
              })}
              allowClear
              onChange={(value) => {
                formRef.current.resetFields(['districtId']);
                formRef.current.resetFields(['wardId']);
              }}
            />
          </FormItem>
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
                    <FormattedMessage id="app.medicalFacility.list.col5" />
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
                    id: 'app.medicalFacility.list.district',
                  })}
                  filter
                  filterField={getFieldValue('provinceId') || 'a'}
                  allowClear
                  onChange={(value) => {
                    formRef.current.resetFields(['wardId']);
                  }}
                />
              </FormItem>
            )}
          </FormItem>
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
                    <FormattedMessage id="app.medicalFacility.list.col6" />
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
                    id: 'app.medicalFacility.list.ward',
                  })}
                  filter
                  filterField={getFieldValue('districtId') || 'a'}
                  allowClear
                />
              </FormItem>
            )}
          </FormItem>
          <FormItem
            name="address"
            label={
              <span>
                <FormattedMessage id="app.medicalFacility.list.col7" />
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
                id: 'app.medicalFacility.list.address',
              })}
              suffix={<span className="suffix">[200]</span>}
            />
          </FormItem>

          <FormItem
            // {...formItemLayout}
            hidden
            name="status"
            // valuePropName="checked"
          >
            <Input />
          </FormItem>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default PlaceDrawer;
