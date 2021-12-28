import React, { useState, useEffect } from 'react';
import {
  Form,
  Modal,
  notification,
  Button,
  Input,
  Row,
  Col,
  List,
  Spin,
} from 'antd';
import { useDispatch } from 'react-redux';
import NumberInput from '../NumberInput/NumberInput';
import { formatNumber } from '../../utils/utils';
import UnitSelect from '../Common/UnitSelect';
import '../../utils/css/styleIssu.scss';

const FormItem = Form.Item;

const TableForm = (props) => {
  const { intl, isMobile, medicineId, onChange } = props;
  let index = -9999;
  const dispatch = useDispatch();
  const formRef = React.createRef();
  const [data, setData] = useState(props.value);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [editOrCreate, setEditOrCreate] = useState(-1);
  const [dataEdit, setDataEdit] = useState({});
  const [unitName, setUnitName] = useState('');
  const [key, setKey] = useState(1);
  useEffect(() => {
    setData(props.value);
  }, [props.value]);

  const handleReset = () => {
    formRef.current.resetFields();
    setVisibleModal(false);
  };

  const handleSubmit = () => {
    formRef.current.validateFields().then((values) => {
      setLoading(true);
      if (editOrCreate < 0) {
        const addItem = {
          ...values,
          id: index,
          medicineId,
          unitName,
        };
        const checkExits = data.find(
          (item) => item.unitName === addItem.unitName
        );
        if (checkExits !== undefined) {
          openNotification('error', 'Đơn vị tính đã tồn tại!', '#fff1f0');
          setLoading(false);
        } else {
          setData([...data, addItem]);
          setLoading(false);
          // formRef.current.resetFields();
          setVisibleModal(false);
          if (onChange) {
            onChange([...data, addItem]);
          }
          index++;
        }
      } else {
        const newData = data.map((item) =>
          item.id !== values.id
            ? item
            : {
                ...item,
                retailPrice: values.retailPrice,
                wholesalePrice: values.wholesalePrice,
                amount: values.amount,
              }
        );
        setLoading(false);
        setData(newData);
        setVisibleModal(false);
        setEditOrCreate(-1);
        if (onChange) {
          onChange(newData);
        }
      }
      setKey(key + 1);
    });
  };

  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };

  const remove = (id) => {
    if (id > 0) {
      dispatch({
        type: 'medicineUnit/delete',
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
            setData(data.filter((item) => item.id !== id));
            if (onChange) {
              onChange(data.filter((item) => item.id !== id));
            }
          } else if (res?.success === false) {
            openNotification('error', res && res.message, '#fff1f0');
          }
        },
      });
    } else {
      setData(data.filter((item) => item.id !== id));
      if (onChange) {
        onChange(data.filter((item) => item.id !== id));
      }
    }
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 7 },
      xs: { span: 17 },
      sm: { span: 24 },
      md: { span: 17 },
    },
    labelAlign: 'left',
    style: { marginBottom: 0 },
  };
  return (
    <React.Fragment>
      <div
        style={{
          display: 'flex',
          position: 'relative',
        }}
      >
        <h2
          style={{
            color: '#196CA6',
            borderBottom: '1px solid #F1F1F1',
            width: '100%',
            marginTop: isMobile ? '0 20px' : '0',
          }}
        >
          {intl.formatMessage({ id: 'app.medicineUnit.list2.header' })}
        </h2>
        <Button
          type="primary"
          style={{
            right: 0,
            position: 'absolute',
          }}
          icon={<i className="fas fa-plus" style={{ marginRight: '5px' }} />}
          onClick={() => setVisibleModal(!visibleModal)}
        >
          {intl.formatMessage({ id: 'app.medicineUnit.create.header' })}
        </Button>
      </div>
      <Row
        style={{
          background: '#F1F1F1',
          color: '#A9A9A9',
          padding: '10px 0',
          width: isMobile ? '900px' : '100%',
        }}
      >
        <Col offset={2} span={6} xs={6}>
          {intl.formatMessage({ id: 'app.medicineUnit.list.col0' })}
        </Col>
        <Col span={3} xs={3}>
          {intl.formatMessage({ id: 'app.medicineUnit.list.col1' })}
        </Col>
        <Col span={6} xs={6}>
          {intl.formatMessage({ id: 'app.medicineUnit.list.col2' })}
        </Col>
        <Col span={6} xs={6}>
          {intl.formatMessage({ id: 'app.medicineUnit.list.col3' })}
        </Col>
      </Row>
      <div
        style={{
          height: '45vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          width: isMobile ? '900px' : 'auto',
        }}
      >
        <Row>
          <List
            itemLayout="vertical"
            style={{ width: isMobile ? '900px' : '100%' }}
            dataSource={data || []}
            renderItem={(item, index) => (
              <List.Item style={{ borderBottom: '1px solid #f0f0f0' }}>
                <Row>
                  <Col
                    span={1}
                    xs={1}
                    style={{ paddingLeft: 20, cursor: 'pointer' }}
                  >
                    {index >= Number(0) && (
                      <i
                        className="fas fa-times"
                        style={{ color: 'red' }}
                        onClick={() =>
                          Modal.confirm({
                            title: intl.formatMessage({
                              id: 'app.confirm.remove',
                            }),
                            okText: intl.formatMessage({
                              id: 'app.tooltip.remove',
                            }),
                            cancelText: intl.formatMessage({
                              id: 'app.common.deleteBtn.cancelText',
                            }),
                            onOk: () => {
                              remove(item.id);
                            },
                            onCancel() {},
                          })
                        }
                      />
                    )}
                  </Col>
                  <Col offset={1} span={6} xs={6}>
                    <span style={{ fontWeight: 'bold', color: '#4dbd74' }}>
                      {index + 1}. {item?.unitName}
                    </span>
                  </Col>
                  <Col span={3} xs={3}>
                    <span>{formatNumber(item?.amount || 0)}</span>
                  </Col>
                  <Col span={6} xs={6}>
                    <span>{formatNumber(item?.retailPrice || 0)}</span>
                  </Col>
                  <Col span={6} xs={6}>
                    <span>{formatNumber(item?.wholesalePrice || 0)}</span>
                  </Col>
                  <Col span={1} xs={1}>
                    <i
                      className="fas fa-pen"
                      style={{ color: '#5885a9', cursor: 'pointer' }}
                      onClick={() => {
                        setDataEdit(item);
                        setVisibleModal(true);
                        setEditOrCreate(1);
                      }}
                    />
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </Row>
      </div>
      <Modal
        key="Detail"
        title={`${
          editOrCreate < 0
            ? intl.formatMessage({ id: 'app.unit.create.header' })
            : intl.formatMessage({ id: 'app.unit.update.header' })
        }`}
        visible={visibleModal}
        width={isMobile ? '100%' : '50%'}
        style={{ top: '50px' }}
        bodyStyle={{ background: '#ffff' }}
        onCancel={() => handleReset()}
        footer={[
          <Button key="back" type="danger" onClick={handleReset}>
            <i className="fas fa-sync" /> &nbsp;
            {intl.formatMessage({ id: 'app.common.deleteBtn.cancelText' })}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            <i className="fa fa-save" /> &nbsp;
            {intl.formatMessage({ id: 'app.common.crudBtns.2' })}
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Form
            hideRequiredMark
            style={{ marginTop: 8 }}
            initialValues={{
              id: dataEdit?.id,
              unitId: dataEdit?.unitId,
              retailPrice: dataEdit?.retailPrice,
              wholesalePrice: dataEdit?.wholesalePrice,
              amount: dataEdit?.amount,
            }}
            ref={formRef}
            key={`MedicineUnit_${key}`}
          >
            <FormItem hidden name="id">
              <Input />
            </FormItem>
            <Row gutter={[20, 20]}>
              <Col xs={24} sm={24}>
                <FormItem
                  {...formItemLayout}
                  name="unitId"
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp;
                      {intl.formatMessage({ id: 'app.medicineUnit.list.col0' })}
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
                  <UnitSelect
                    className="selectHiddenBorder"
                    disabled={editOrCreate > 0}
                    placeholder={intl.formatMessage({
                      id: 'app.medicineUnit.list.name',
                    })}
                    onChange={(value, text) => setUnitName(text)}
                  />
                </FormItem>
              </Col>
              <Col xs={24} sm={24}>
                <FormItem
                  {...formItemLayout}
                  name="amount"
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp;
                      {intl.formatMessage({ id: 'app.medicineUnit.list.col1' })}
                    </span>
                  }
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
                    className="inputNumberHiddenBorder1"
                    placeholder={intl.formatMessage({
                      id: 'app.medicineUnit.list.amount',
                    })}
                    min={1}
                    key={key}
                  />
                </FormItem>
              </Col>
              <Col xs={24} sm={24}>
                <FormItem
                  {...formItemLayout}
                  name="retailPrice"
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp;
                      {intl.formatMessage({ id: 'app.medicineUnit.list.col2' })}
                    </span>
                  }
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
                    className="inputNumberHiddenBorder1"
                    placeholder={intl.formatMessage({
                      id: 'app.medicineUnit.list.retailPrice',
                    })}
                    min={0}
                    key={key}
                  />
                </FormItem>
              </Col>
              <Col xs={24} sm={24}>
                <FormItem
                  {...formItemLayout}
                  name="wholesalePrice"
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp;
                      {intl.formatMessage({ id: 'app.medicineUnit.list.col3' })}
                    </span>
                  }
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
                    className="inputNumberHiddenBorder1"
                    placeholder={intl.formatMessage({
                      id: 'app.medicineUnit.list.wholesalePrice',
                    })}
                    min={0}
                    key={key}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </React.Fragment>
  );
};

export default TableForm;
