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
import ShortCutSelectProducerGroup from '../ShortCutSelect/ShortCutSelectProducerGroup';
const { isFullNameNnumber2, isPhone, isEmail } = regexHelper;
const FormItem = Form.Item;

const ProducerDrawer = ({
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
      getOne(dataEdit && dataEdit.id);
    }
  }, [visible]);

  const getOne = (id) => {
    if (id) {
      setLoading(true);
      dispatch({
        type: 'producer/getOne',
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
        const healthFacilityId = localStorage.getItem('healthFacilityId');
        const addItem = {
          ...values,
          producerName: values.producerName && values.producerName.trim(),
          provinceNameOld: data.producerName,
          healthFacilityId,
        };
        if (data.id) {
          dispatch({
            type: 'producer/update',
            payload: {
              id: data.id,
              params: {
                ...addItem,
              },
            },
            callback: (res) => {
              if (res && res.success) {
                openNotification(
                  'success',
                  intl.formatMessage({ id: 'app.common.edit.success' }),
                  '#f6ffed'
                );
                getList();
                changeDrawer('close');
              } else {
                openNotification('error', res.message, '#fff1f0');
              }
              setLoading(false);
            },
          });
        } else {
          dispatch({
            type: 'producer/add',
            payload: addItem,
            callback: (res) => {
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
                changeDrawer('close');
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
          {data.id
            ? intl.formatMessage(
                { id: 'app.title.update' },
                { name: data.producerName }
              )
            : intl.formatMessage({ id: 'app.producer.create.header' })}
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
            producerName: data.producerName || '',
            producerGroupId: data.producerGroupId || '',
            mobile: data.mobile || '',
            email: data.email || '',
            address: data.address || '',
            status: data.id ? data.status : 1,
          }}
          ref={formRef}
          layout="vertical"
          key={`${data.id}_${key}` || '0'}
        >
          <FormItem
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>&nbsp;
                {intl.formatMessage({
                  id: 'app.producer.list.col0',
                })}
              </span>
            }
            name="producerName"
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
                id: 'app.producer.list.name',
              })}
            />
          </FormItem>
          <FormItem
            name="producerGroupId"
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>&nbsp;
                <FormattedMessage id="app.producer.list.col1" />
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
            <ShortCutSelectProducerGroup
              isMobile={isMobile}
              intl={intl}
              placeholder={intl.formatMessage({
                id: 'app.producer.list.producerGroup',
              })}
              allowClear
            />
          </FormItem>
          <FormItem
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>&nbsp;
                {intl.formatMessage({
                  id: 'app.producer.list.col2',
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
                id: 'app.producer.list.mobile',
              })}
            />
          </FormItem>

          <FormItem
            label={
              <span>
                {intl.formatMessage({
                  id: 'app.producer.list.col3',
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
                id: 'app.producer.list.email',
              })}
            />
          </FormItem>

          <FormItem
            label={
              <span>
                {intl.formatMessage({ id: 'app.producer.list.col4' })}
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
                id: 'app.producer.list.address',
              })}
            />
          </FormItem>

          <FormItem
            // {...formItemLayout}
            hidden
            name="status"
            valuePropName="checked"
          >
            <Input />
          </FormItem>
        </Form>
      </Spin>
    </Drawer>
  );
};

export default ProducerDrawer;
