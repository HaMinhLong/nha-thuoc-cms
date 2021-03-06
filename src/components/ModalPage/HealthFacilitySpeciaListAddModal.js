import React, { useState, useEffect } from 'react';
import {
  Button,
  Popconfirm,
  Form,
  Modal,
  notification,
  PageHeader,
  Card,
  Spin,
} from 'antd';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import SpecialistSelect from '../Common/SpecialistSelect';

const FormItem = Form.Item;

const HealthFacilitySpeciaListAddModal = ({
  intl,
  isMobile,
  visible,
  getList,
  specialistData,
  healthFacilityId,
}) => {
  const dispatch = useDispatch();
  const formRef = React.createRef();
  const [checkFirst, setCheckFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      changeModal('show');
    }
  }, [visible]);
  const changeModal = (value) => {
    if (value === 'show') {
      setVisibleModal(!visibleModal);
    } else if (value === 'close') {
      setVisibleModal(false);
    }
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

  const handleSubmit = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        setLoading(true);
        const addItem = [];
        for (let index = 0; index < values?.specialists?.length; index++) {
          addItem.push({
            healthFacilityId: healthFacilityId,
            specialistId: values?.specialists?.[index],
          });
        }
        dispatch({
          type: 'healthFacilitySpecialist/bulkCreate',
          payload: addItem,
          callback: (res) => {
            if (res?.success) {
              openNotification(
                'success',
                intl.formatMessage(
                  { id: 'app.common.create.success' },
                  {
                    name: intl.formatMessage({
                      id: 'app.specialist.list.title',
                    }),
                  }
                ),
                '#f6ffed'
              );
              getList(healthFacilityId);
              changeModal('close');
            } else {
              openNotification('error', res.message, '#fff1f0');
            }
            setLoading(false);
          },
        });
      })
      .catch(({ errorFields }) => {
        formRef.current.scrollToField(errorFields[0].name);
      });
  };
  return (
    <Modal
      width={isMobile ? '100%' : '40%'}
      style={{
        margin: '0 auto',
      }}
      bodyStyle={{
        minHeight: '40vh',
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
            {intl.formatMessage({ id: 'app.specialist.create.header' })}
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
            bodyStyle={{ padding: '10px 10px 20px 10px', minHeight: '40vh' }}
          >
            <Form
              hideRequiredMark
              style={{ marginTop: 8 }}
              initialValues={{
                specialists: [],
              }}
              ref={formRef}
              layout="vertical"
              key={`${Math.random()}` || '0'}
            >
              <FormItem
                name="specialists"
                label={
                  <span>
                    <span style={{ color: 'red' }}>*</span>&nbsp;
                    <FormattedMessage id="app.specialist.list.col0" />
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
                <SpecialistSelect
                  placeholder={intl.formatMessage({
                    id: 'app.healthFacility.list.specialist',
                  })}
                  data={specialistData}
                  mode={'multiple'}
                />
              </FormItem>
            </Form>
          </Card>
        </Spin>
      </PageHeader>
    </Modal>
  );
};

export default HealthFacilitySpeciaListAddModal;
