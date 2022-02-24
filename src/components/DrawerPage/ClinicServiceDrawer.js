import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Spin,
  Popconfirm,
  Form,
  Drawer,
  notification,
  TimePicker,
} from 'antd';
import moment from 'moment';
import regexHelper from '../../utils/regexHelper';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ClinicServicePackageSelect from '../Common/ClinicServicePackageSelect';
import DoctorSelect from '../Common/DoctorSelect';
import NumberInput from '../NumberInput/NumberInput';
const { isFullNameNnumber2 } = regexHelper;
const FormItem = Form.Item;

const ClinicServiceDrawer = ({
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
        type: 'clinicService/getOne',
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
          clinicServiceName:
            values.clinicServiceName && values.clinicServiceName.trim(),
          clinicServiceNameOld: data.clinicServiceName,
          time: values.time.format('HH:mm:ss').toString() || '',
          healthFacilityId,
        };
        if (data?.id) {
          dispatch({
            type: 'clinicService/update',
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
                changeDrawer('close');
              } else {
                openNotification('error', res.message, '#fff1f0');
              }
              setLoading(false);
            },
          });
        } else {
          dispatch({
            type: 'clinicService/add',
            payload: addItem,
            callback: (res) => {
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
          {data?.id
            ? intl.formatMessage(
                { id: 'app.title.update' },
                { name: data.clinicServiceName }
              )
            : intl.formatMessage({
                id: 'app.clinicService.create.header',
              })}
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
            clinicServiceName: data.clinicServiceName || '',
            clinicServicePackageId: data.clinicServicePackageId || '',
            price: data.price || 0,
            time: data?.id ? moment(data?.time, 'HH:mm:ss') : '',
            userId: data.userId || '',
            description: data.description || '',
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
                  id: 'app.clinicService.list.col0',
                })}
              </span>
            }
            name="clinicServiceName"
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
                id: 'app.clinicService.list.name',
              })}
            />
          </FormItem>
          <FormItem
            name="clinicServicePackageId"
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>&nbsp;
                <FormattedMessage id="app.clinicService.list.col1" />
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
            <ClinicServicePackageSelect
              isMobile={isMobile}
              intl={intl}
              placeholder={intl.formatMessage({
                id: 'app.clinicService.list.clinicServicePackage',
              })}
              allowClear
            />
          </FormItem>
          <FormItem
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>&nbsp;
                {intl.formatMessage({
                  id: 'app.clinicService.list.col2',
                })}
              </span>
            }
            name="price"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'app.common.crud.validate.input',
                }),
              },
            ]}
          >
            <NumberInput
              placeholder={intl.formatMessage({
                id: 'app.medicineUnit.list.retailPrice',
              })}
              key={key}
              min={0}
            />
          </FormItem>

          <FormItem
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>&nbsp;
                {intl.formatMessage({
                  id: 'app.clinicServicePackage.list.col2',
                })}
              </span>
            }
            name="time"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'app.common.crud.validate.select',
                }),
              },
            ]}
          >
            <TimePicker
              style={{ width: '100%' }}
              format="HH:mm:ss"
              placeholder={intl.formatMessage({
                id: 'app.clinicServicePackage.list.time',
              })}
            />
          </FormItem>

          <FormItem
            label={
              <span>
                <span style={{ color: 'red' }}>*</span>&nbsp;
                {intl.formatMessage({
                  id: 'app.clinicService.list.col3',
                })}
              </span>
            }
            name="userId"
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'app.common.crud.validate.select',
                }),
              },
            ]}
          >
            <DoctorSelect
              placeholder={intl.formatMessage({
                id: 'app.clinicService.list.doctor',
              })}
              isMobile={isMobile}
              intl={intl}
              allowClear
            />
          </FormItem>

          <FormItem
            label={
              <span>
                {intl.formatMessage({
                  id: 'app.clinicService.list.col4',
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
                id: 'app.clinicService.list.description',
              })}
              suffix={<span className="suffix">[200]</span>}
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

export default ClinicServiceDrawer;
