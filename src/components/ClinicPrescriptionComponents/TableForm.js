import React, { useState } from 'react';
import {
  notification,
  Button,
  Input,
  Row,
  Col,
  Modal,
  Spin,
  List,
  Form,
} from 'antd';
import { useDispatch } from 'react-redux';
import NumberInput from '../NumberInput/NumberInput';
import UnitSelectV2 from '../Common/UnitSelectV2';
import debounce from 'lodash/debounce';
import '../../utils/css/styleList.scss';

const FormItem = Form.Item;

const TableForm = ({ isMobile, intl, value, onChange }) => {
  const dispatch = useDispatch();
  const formRef = React.createRef();
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const [data, setData] = useState(value || []);
  const [visible, setVisible] = useState(false);
  const [editOrCreate, setEditOrCreate] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [key, setKey] = useState(Math.random());
  const [medicineUnits, setMedicineUnits] = useState([]);
  const [visibleMedicineSelect, setVisibleMedicineSelect] = useState(false);
  const [dataMedicineSelect, setDataMedicineSelect] = useState([]);

  const handleSubmit = () => {
    formRef.current.validateFields().then((values) => {
      setLoading(true);
      const addMedicine = {
        ...values,
      };
      if (editOrCreate < 0) {
        addMedicine.flag = -1;
        addMedicine.id = values.medicineId;
        const checkExits = data?.find(
          (item) => item.medicineName === addMedicine.medicineName
        );
        if (checkExits !== undefined) {
          setLoading(false);
          openNotification('error', 'Thuốc tồn tại trong phiếu!', '#fff1f0');
        } else {
          setLoading(false);
          setData([...data, addMedicine]);
          handleCancel();
          if (onChange) {
            onChange([...data, addMedicine]);
          }
        }
      } else {
        const newData = data?.map((item) =>
          item.id !== values.id
            ? item
            : {
                ...addMedicine,
              }
        );
        setLoading(false);
        setData(newData);
        handleCancel();
        if (onChange) {
          onChange(newData);
        }
      }
    });
    // .catch(({ errorFields }) => {
    //   formRef.current.scrollToField(errorFields[0].name);
    // });
  };

  const onPressEnterSearch = (event) => {
    let params = {
      filter: JSON.stringify({
        healthFacilityId: healthFacilityId,
        medicineName: event.target.value.trim(),
        status: 1,
      }),
      sort: JSON.stringify(['createdAt', 'DESC']),
    };

    if (event.target.value) {
      dispatch({
        type: 'medicine/fetch',
        payload: params,
        callback: (res) => {
          if (res?.success) {
            const { list } = res.results;
            setDataMedicineSelect(list);
            setVisibleMedicineSelect(true);
          } else {
            openNotification('error', res.message, '#fff1f0');
          }
        },
      });
    } else {
      setDataMedicineSelect([]);
      setVisibleMedicineSelect(false);
    }
  };

  const onSelectChange = (record) => {
    getListMedicineUnit(record?.id);
    formRef.current.setFieldsValue({
      medicineId: record?.id,
      medicineName: record?.medicineName,
      unitId: medicineUnits[0]?.unitId,
    });
    setVisibleMedicineSelect(false);
  };

  const getListMedicineUnit = (id) => {
    let params = {
      filter: JSON.stringify({ medicineId: id }),
      sort: JSON.stringify(['createdAt', 'ASC']),
    };
    dispatch({
      type: 'medicineUnit/fetch',
      payload: params,
      callback: (res) => {
        if (res?.success) {
          const { list } = res.results;
          const data = list?.map((item) => {
            return {
              id: item?.medicines?.[0]?.medicineUnits?.id,
              unitName: item.unitName,
              amount: item?.medicines?.[0]?.medicineUnits?.amount,
              retailPrice: item?.medicines?.[0]?.medicineUnits?.retailPrice,
              wholesalePrice:
                item?.medicines?.[0]?.medicineUnits?.wholesalePrice,
              unitId: item.id,
            };
          });
          setMedicineUnits(data);
        }
      },
    });
  };

  const remove = (id, flag) => {
    if (flag > 0) {
      dispatch({
        type: 'clinicPreMedicine/delete',
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
            setData(data?.filter((item) => item.id !== id));
            if (onChange) {
              onChange(data?.filter((item) => item.id !== id));
            }
          } else if (res?.success === false) {
            openNotification('error', res && res.message, '#fff1f0');
          }
        },
      });
    } else {
      setData(data?.filter((item) => item.id !== id));
      if (onChange) {
        onChange(data?.filter((item) => item.id !== id));
      }
    }
  };

  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };

  const handleCancel = () => {
    setVisible(false);
    setEditOrCreate(-1);
    setDataEdit({});
    setMedicineUnits([]);
    setKey(key + 1);
  };

  const formItemLayout1 = {
    labelCol: {
      xs: { span: 7 },
      sm: { span: 24 },
      md: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 17 },
      sm: { span: 24 },
      md: { span: 17 },
    },
    //   colon: false,
    labelAlign: 'left',
    style: { marginBottom: 8 },
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
          Danh sách thuốc
        </h2>
        <Button
          type="primary"
          onClick={() => {
            setVisible(!visible);
            setEditOrCreate(-1);
          }}
          style={{
            right: 0,
            position: 'absolute',
          }}
        >
          Thêm thuốc
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
        <Col offset={2} span={14} xs={14}>
          Tên thuốc
        </Col>
        <Col span={4} xs={4}>
          Số lượng
        </Col>
        <Col span={4} xs={4}>
          Đơn vị
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
              <List.Item
                style={{
                  margin: '0px 20px',
                  borderBottom: '1px solid #f0f0f0',
                }}
              >
                <Row>
                  <Col span={1} xs={1}>
                    {index >= 0 && (
                      <i
                        className="fas fa-times"
                        style={{ color: 'red', cursor: 'pointer' }}
                        onClick={() =>
                          Modal.confirm({
                            title: intl.formatMessage({
                              id: 'app.confirm.remove',
                            }),
                            okText: 'Ok',
                            cancelText: intl.formatMessage({
                              id: 'app.common.deleteBtn.cancelText',
                            }),
                            onOk: () => {
                              remove(item.id, item.flag);
                            },
                            onCancel() {},
                          })
                        }
                      />
                    )}
                  </Col>
                  <Col span={15} xs={15}>
                    <span style={{ fontWeight: 'bold', color: '#4dbd74' }}>
                      {index + 1}. {item?.medicineName}
                    </span>
                  </Col>
                  <Col span={4} xs={4}>
                    <p style={{ marginLeft: 20 }}>{item?.amount || 0}</p>
                  </Col>
                  <Col span={3} xs={3}>
                    <p style={{ marginLeft: 20 }}>{item?.unitName}</p>
                  </Col>
                  <Col span={1} xs={1}>
                    <i
                      className="fas fa-pen"
                      style={{ color: '#5885a9', cursor: 'pointer' }}
                      onClick={() => {
                        setDataEdit(item);
                        getListMedicineUnit(item.id);
                        setEditOrCreate(1);
                        setVisible(!visible);
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
          editOrCreate < 0 ? 'Thêm thuốc vào phiếu' : 'Sửa thuốc tại phiếu'
        }`}
        visible={visible}
        width={isMobile ? '100%' : '50%'}
        style={{ top: '50px' }}
        bodyStyle={{ background: '#ffff' }}
        // maskStyle={{ backgroundColor: '#ECEFF4', width: "50%" }}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel} type="danger">
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
              medicineName: dataEdit?.medicineName,
              medicineId: dataEdit?.medicineId,
              unitId: dataEdit?.unitId,
              unitName: dataEdit?.unitName,
              amount: dataEdit.amount || 0,
              flag: dataEdit.flag || -1,
            }}
            ref={formRef}
            key={`${dataEdit?.id}_${key}` || '0'}
          >
            <FormItem hidden name="id">
              <Input />
            </FormItem>
            <FormItem hidden name="medicineId">
              <Input />
            </FormItem>
            <FormItem hidden name="unitName">
              <Input />
            </FormItem>
            <FormItem hidden name="flag">
              <Input />
            </FormItem>
            <Row gutter={20}>
              <Col xs={24} sm={24}>
                <FormItem
                  {...formItemLayout1}
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp;
                      {intl.formatMessage({
                        id: 'app.medicine.list.col0',
                      })}
                    </span>
                  }
                  name="medicineName"
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
                      id: 'app.medicine.list.name',
                    })}
                    onChange={debounce(onPressEnterSearch, 500)}
                    name="medicineName"
                    autoComplete="off"
                  />
                </FormItem>
                {dataMedicineSelect &&
                  dataMedicineSelect.length > 0 &&
                  visibleMedicineSelect && (
                    <ul className="dropmed2">
                      {dataMedicineSelect?.map((item) => (
                        <li
                          key={item.id}
                          className="itemLi"
                          onClick={() => onSelectChange(item)}
                        >
                          <span className="nameMed">{item.medicineName}</span>
                          <span>
                            {' '}
                            -{' '}
                            {intl.formatMessage({
                              id: 'app.medicine.list.col1',
                            })}
                            :{' '}
                          </span>
                          <span className="registrationNumber">
                            {item.registrationNumber}
                          </span>
                          <span>
                            {' '}
                            -{' '}
                            {intl.formatMessage({
                              id: 'app.medicine.list.col10',
                            })}
                            :{' '}
                          </span>
                          <span className="madein">
                            {item.producer && item.producer.producerName}
                          </span>
                          <span> - {item.country}</span>
                        </li>
                      ))}
                    </ul>
                  )}
              </Col>
              <Col sm={24} xs={24}>
                <FormItem
                  {...formItemLayout1}
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp;
                      {intl.formatMessage({
                        id: 'app.clinicReceiptService.list.col2',
                      })}
                    </span>
                  }
                  name="amount"
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
                      id: 'app.clinicReceiptService.list.amount',
                    })}
                  />
                </FormItem>
              </Col>
              <Col sm={24} xs={24}>
                <FormItem
                  {...formItemLayout1}
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp; Đơn vị tính
                    </span>
                  }
                  name="unitId"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'app.common.crud.validate.select',
                      }),
                    },
                  ]}
                >
                  <UnitSelectV2
                    placeholder="Chọn đơn vị tính"
                    dataArr={medicineUnits || []}
                    onChange={(value, text) => {
                      formRef.current.setFieldsValue({ unitName: text });
                    }}
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
