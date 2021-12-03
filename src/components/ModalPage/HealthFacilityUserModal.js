import React, { useState, useEffect } from 'react';
import { Button, Modal, Tooltip, notification, Form, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import HealthFacilitySelect from '../Common/HealthFacilitySelect';
import '../../utils/css/styleList.scss';

const FormItem = Form.Item;
const PAGE_SIZE = process.env.REACT_APP_PAGE_SIZE;

const HealthFacilityUserModal = ({
  intl,
  isMobile,
  visible,
  titleModal,
  dataEdit,
  getList,
}) => {
  const dispatch = useDispatch();
  const formRef = React.createRef();
  const [checkFirst, setCheckFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      changeModal('show');
      getHealthFacilities(dataEdit?.id);
    }
  }, [visible]);

  const changeModal = (value) => {
    if (value === 'show') {
      setVisibleModal(!visibleModal);
    } else if (value === 'close') {
      setVisibleModal(false);
      handleReset();
      setData([]);
    }
  };
  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };
  const getHealthFacilities = (id) => {
    if (id) {
      let params = {
        filter: JSON.stringify({ userId: id }),
        range: JSON.stringify([0, PAGE_SIZE]),
        sort: JSON.stringify(['createdAt', 'DESC']),
      };
      setLoading(true);
      dispatch({
        type: 'healthFacilityUser/fetch',
        payload: params,
        callback: (res) => {
          setLoading(false);
          if (res?.success) {
            const { list } = res?.results;
            setData(list);
          } else {
            openNotification('error', res.message, '#fff1f0');
          }
        },
      });
    } else {
      setData([]);
    }
  };
  const handleReset = () => {
    formRef.current.resetFields();
  };
  const handleAdd = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        setLoading(true);
        const addItem = {
          userId: dataEdit?.id,
          healthFacilityId: values.healthFacilityId,
        };
        dispatch({
          type: 'healthFacilityUser/add',
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
              getHealthFacilities(dataEdit?.id);
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
  const deleteRecord = (id) => {
    dispatch({
      type: 'healthFacilityUser/delete',
      payload: {
        id: id,
      },
      callback: (res) => {
        if (res?.success === true) {
          openNotification(
            'success',
            intl.formatMessage({ id: 'app.common.delete.success' }),
            '#f6ffed'
          );
          getHealthFacilities(dataEdit?.id);
        } else if (res?.success === false) {
          openNotification('error', res && res.message, '#fff1f0');
        }
      },
    });
  };

  return (
    <React.Fragment>
      <Modal
        title={
          <h3 style={{ marginBottom: '0px' }}>
            {titleModal} - {dataEdit?.username}
          </h3>
        }
        width={isMobile ? '100%' : 520}
        onCancel={() => changeModal('close')}
        visible={visibleModal}
        footer={null}
      >
        <Spin spinning={loading}>
          <Form
            initialValues={{
              healthFacilityId: '',
            }}
            ref={formRef}
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
            key={Math.random()}
          >
            <FormItem
              name="healthFacilityId"
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
              <HealthFacilitySelect
                placeholder={intl.formatMessage({
                  id: 'app.user.list.healthFacility',
                })}
                data={data}
                allowClear
              />
            </FormItem>
            <Tooltip
              title={intl.formatMessage({
                id: 'app.healthFacility.create.header',
              })}
            >
              <Button
                icon={<i className="fas fa-check" />}
                type="primary"
                style={{ paddingBottom: '1px' }}
                loading={loading}
                onClick={handleAdd}
              />
            </Tooltip>
          </Form>
          <div className="listPlace">
            {data?.map((item, index) => (
              <div key={item.id} className="listItemPlace">
                Cơ sở {index + 1}: {item.healthFacilityName}
                <span className="listItemPlaceIcon">
                  <div
                    className="expand-row-icon"
                    style={{ color: '#1175BB', cursor: 'pointer' }}
                    onClick={() =>
                      deleteRecord(item?.users?.[0]?.healthFacilityUsers?.id)
                    }
                  >
                    <Tooltip
                      title={
                        !isMobile &&
                        intl.formatMessage({ id: 'app.tooltip.remove' })
                      }
                    >
                      <i className="fas fa-times" />
                    </Tooltip>
                  </div>
                </span>
              </div>
            ))}
          </div>
        </Spin>
      </Modal>
    </React.Fragment>
  );
};

export default HealthFacilityUserModal;
