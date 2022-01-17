import React, { useState, useEffect, Fragment } from 'react';
import {
  Modal,
  Form,
  Row,
  Col,
  TimePicker,
  Checkbox,
  notification,
} from 'antd';
import moment from 'moment';
import { useDispatch } from 'react-redux';

const FormItem = Form.Item;

const WorkScheduleModal = ({ intl, visible, dataEdit, titleModal }) => {
  const formRef = React.createRef();

  const dispatch = useDispatch();
  const [checkFirst, setCheckFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [workScheduleData, setWorkScheduleData] = useState([]);

  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      changeModal('show');
      getList(dataEdit?.id);
    }
  }, [visible]);

  const getList = (id) => {
    const params = {
      filter: JSON.stringify({ healthFacilityId: id }),
    };
    dispatch({
      type: 'workSchedule/fetch',
      payload: params,
      callback: (res) => {
        if (res.success === false) {
          openNotification('error', res && res.message, '#fff1f0');
        } else {
          const { list } = res.results;
          setWorkScheduleData(list);
        }
      },
    });
  };

  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };

  const changeModal = (value) => {
    if (value === 'show') {
      setVisibleModal(!visibleModal);
    } else if (value === 'close') {
      setVisibleModal(false);
    }
  };

  const handleSchedule = () => {
    setLoading(true);
    formRef.current
      .validateFields([
        'monday',
        'monday-open',
        'monday-close',
        'tuesday',
        'tuesday-open',
        'tuesday-close',
        'wednesday',
        'wednesday-open',
        'wednesday-close',
        'thursday',
        'thursday-open',
        'thursday-close',
        'friday',
        'friday-open',
        'friday-close',
        'saturday',
        'saturday-open',
        'saturday-close',
        'sunday',
        'sunday-open',
        'sunday-close',
      ])
      .then((values) => {
        // eslint-disable-next-line prefer-const
        let addItem = workScheduleData;
        addItem = addItem.map((item) => ({
          close: item.close,
          id: item.id,
          open: item.open,
          healthFacilityId: item.healthFacilityId,
          status: item.status,
          weekday: item.weekday,
        }));
        const dateArr = [
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday',
        ];
        // eslint-disable-next-line array-callback-return
        dateArr.map((item) => {
          const tempItem = addItem.find((x) => x.weekday === capitalize(item));
          // if (values[`${item}`]) {
          if (tempItem) {
            tempItem.open =
              values[`${item}-open`].format('HH:mm:ss').toString() || '';
            tempItem.close =
              values[`${item}-close`].format('HH:mm:ss').toString() || '';
            tempItem.status = values[`${item}`];
            // delete t
          } else {
            addItem.push({
              id: 0,
              healthFacilityId: dataEdit?.id,
              weekday: capitalize(item),
              open: values[`${item}-open`].format('HH:mm:ss').toString() || '',
              close:
                values[`${item}-close`].format('HH:mm:ss').toString() || '',
              status: values[`${item}`],
            });
          }
        });
        dispatch({
          type: 'workSchedule/update',
          payload: {
            params: addItem,
          },
          callback: (res) => {
            setLoading(false);
            if (res?.success === true) {
              openNotification(
                'success',
                intl.formatMessage({ id: 'app.common.edit.success' }),
                '#f6ffed'
              );
              setVisibleModal(false);
            } else if (res?.success === false) {
              openNotification('error', res?.message, '#fff1f0');
            }
          },
        });
      });
  };

  const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const dateArray = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const dateArray1 = [
    'Thứ Hai',
    'Thứ Ba',
    'Thứ Tư',
    'Thứ Năm',
    'Thứ Sáu',
    'Thứ Bảy',
    'Chủ Nhật',
  ];

  const initValue = {};
  dateArray.forEach((item) => {
    const tempLabel = workScheduleData.find((x) => x.weekday === item);
    initValue[item.toLowerCase()] = tempLabel?.status;
    initValue[`${item.toLowerCase()}-open`] = moment(
      tempLabel ? tempLabel.open : '09:00:00',
      'HH:mm:ss'
    );
    initValue[`${item.toLowerCase()}-close`] = moment(
      tempLabel ? tempLabel.close : '17:30:00',
      'HH:mm:ss'
    );
  });

  return (
    <Fragment>
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
        visible={visibleModal}
        onOk={handleSchedule}
        onCancel={() => setVisibleModal(false)}
        loading={loading}
        cancelText={
          <Fragment>
            <i className="fas fa-sync" /> &nbsp;
            {intl.formatMessage({ id: 'app.common.deleteBtn.cancelText' })}
          </Fragment>
        }
        okText={
          <Fragment>
            <i className="fa fa-save" /> &nbsp;
            {intl.formatMessage({ id: 'app.common.crudBtns.2' })}
          </Fragment>
        }
      >
        <Form ref={formRef} initialValues={initValue} key={Math.random()}>
          {dateArray.map((item, index) => (
            <Row gutter={8} key={item}>
              <Col sm={6} xs={24}>
                <FormItem name={item.toLowerCase()} valuePropName="checked">
                  <Checkbox>{dateArray1[index]}</Checkbox>
                </FormItem>
              </Col>
              <Col sm={9} xs={24}>
                <FormItem
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues[item.toLowerCase()] !==
                    currentValues[item.toLowerCase()]
                  }
                >
                  {({ getFieldValue }) => (
                    <FormItem
                      name={`${item.toLowerCase()}-open`}
                      rules={[
                        {
                          required: visible,
                          message: intl.formatMessage({
                            id: 'app.common.crud.validate.select',
                          }),
                        },
                      ]}
                    >
                      <TimePicker // // defaultValue={moment('08:00', 'HH:mm:ss')}
                        disabled={!getFieldValue(item.toLowerCase())}
                        style={{ width: '100%' }}
                        format="HH:mm:ss"
                      />
                    </FormItem>
                  )}
                </FormItem>
              </Col>
              <Col sm={9} xs={24}>
                <FormItem
                  noStyle
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues[item.toLowerCase()] !==
                    currentValues[item.toLowerCase()]
                  }
                >
                  {({ getFieldValue }) => (
                    <FormItem
                      name={`${item.toLowerCase()}-close`}
                      rules={[
                        {
                          required: visible,
                          message: intl.formatMessage({
                            id: 'app.common.crud.validate.select',
                          }),
                        },
                      ]}
                    >
                      <TimePicker // defaultValue={moment('17:30:00', 'HH:mm:ss')}
                        disabled={!getFieldValue(item.toLowerCase())}
                        style={{ width: '100%' }}
                        format="HH:mm:ss"
                      />
                    </FormItem>
                  )}
                </FormItem>
              </Col>
            </Row>
          ))}
        </Form>
      </Modal>
    </Fragment>
  );
};

export default WorkScheduleModal;
