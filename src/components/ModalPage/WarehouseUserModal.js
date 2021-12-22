import React, { useEffect, useState } from 'react';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { Modal, Tooltip, notification, Form, Button, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import WarehouseSelect from '../Common/WarehouseSelect';
const FormItem = Form.Item;

const WarehouseUserModal = ({ intl, isMobile, visible, dataEdit }) => {
  const dispatch = useDispatch();
  const formRef = React.createRef();
  const [loading, setLoading] = useState(false);
  const [checkFirst, setCheckFirst] = useState(true);
  const [visibleModalWarehouse, setVisibleModalWarehouse] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      changeModal('show');
      getWarehouseUser(dataEdit?.id);
    }
  }, [visible]);

  const getWarehouseUser = (userId) => {
    let params = {
      filter: JSON.stringify({ userId: userId }),
    };
    setLoading(true);
    dispatch({
      type: 'warehouseUser/fetch',
      payload: params,
      callback: (res) => {
        setLoading(false);
        if (res?.success) {
          const { list } = res?.results;
          setData(list);
        }
      },
    });
  };

  const changeModal = (value) => {
    if (value === 'show') {
      setVisibleModalWarehouse(!visibleModalWarehouse);
    } else if (value === 'close') {
      setVisibleModalWarehouse(false);
      setData([]);
    }
  };

  const remove = (id) => {
    setLoading(true);
    dispatch({
      type: 'warehouseUser/delete',
      payload: {
        id: id,
      },
      callback: (res) => {
        setLoading(false);
        if (res?.success === true) {
          openNotification(
            'success',
            intl.formatMessage({ id: 'app.common.delete.success' }),
            '#f6ffed'
          );
          getWarehouseUser(dataEdit?.id);
        } else if (res?.success === false) {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  const handleAdd = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        setLoading(true);
        const addItem = {
          userId: dataEdit?.id,
          warehouseId: values.warehouseId,
        };
        dispatch({
          type: 'warehouseUser/add',
          payload: addItem,
          callback: (res) => {
            setLoading(false);
            if (res?.success) {
              openNotification(
                'success',
                intl.formatMessage(
                  { id: 'app.common.create.success' },
                  {
                    name: intl.formatMessage({
                      id: 'app.healthFacility.list.title',
                    }),
                  }
                ),
                '#f6ffed'
              );
              getWarehouseUser(dataEdit?.id);
            } else {
              openNotification('error', res.message, '#fff1f0');
            }
          },
        });
      })
      .catch(({ errorFields }) => {
        formRef.current.scrollToField(errorFields[0].name);
      });
  };

  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };

  return (
    <React.Fragment>
      <Modal
        title={
          <h3 style={{ marginBottom: '0px' }}>
            {intl.formatMessage({ id: 'app.user.different.col2' })} -{' '}
            {dataEdit?.username}
          </h3>
        }
        width={isMobile ? '100%' : 450}
        onCancel={() => changeModal('close')}
        visible={visibleModalWarehouse}
        footer={null}
      >
        <Spin spinning={loading}>
          <Form
            ref={formRef}
            initialValues={{
              healthFacilityId: '',
            }}
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
            key={Math.random()}
          >
            <FormItem
              name="warehouseId"
              style={{ width: '90%' }}
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
                  id: 'app.user.list.warehouse',
                })}
                data={data}
                allowClear
              />
            </FormItem>
            <Tooltip
              title={intl.formatMessage({ id: 'app.warehouse.create.header' })}
            >
              <Button
                icon={<CheckOutlined />}
                loading={loading}
                onClick={handleAdd}
                type="primary"
                style={{ paddingBottom: '1px' }}
              />
            </Tooltip>
          </Form>
          {data?.map((warehouse) => (
            <div key={warehouse.id}>
              Tên kho: {warehouse.warehouseName}
              &nbsp;&nbsp;
              <span
                className="expand-row-icon"
                onClick={() => remove(warehouse?.users[0]?.warehouseUsers?.id)}
                style={{ color: '#1175BB', cursor: 'pointer' }}
              >
                <Tooltip
                  title={intl.formatMessage({ id: 'app.tooltip.remove' })}
                >
                  <CloseOutlined />
                </Tooltip>
              </span>
            </div>
          ))}
        </Spin>
      </Modal>
    </React.Fragment>
  );
};

export default WarehouseUserModal;
