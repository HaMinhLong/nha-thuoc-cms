import React, { useState, useEffect } from 'react';
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
import Discount from '../NumberInput/Discount';
import { formatNumber } from '../../utils/utils';
import ClinicTypeSelect from '../Common/ClinicTypeSelect';
import ClinicServicePackageSelect from '../Common/ClinicServicePackageSelect';
import ClinicServiceSelect from '../Common/ClinicServiceSelect';
import DoctorSelect from '../Common/DoctorSelect';
import '../../utils/css/styleList.scss';

const FormItem = Form.Item;

const TableForm = ({ isMobile, intl, value, onChange }) => {
  const dispatch = useDispatch();
  const formRef = React.createRef();
  const [data, setData] = useState(value || []);
  const [visible, setVisible] = useState(false);
  const [editOrCreate, setEditOrCreate] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [dataEdit, setDataEdit] = useState({});
  const [key, setKey] = useState(Math.random());

  useEffect(() => {
    setData(value);
  }, [value]);

  const total = () => {
    const amount = formRef.current.getFieldValue('amount');
    const price = formRef.current.getFieldValue('price');

    let total = price * amount || 0;
    if (formRef.current.getFieldValue('discount')?.number > 0) {
      const currency =
        formRef.current.getFieldValue('discount')?.currency === 1
          ? formRef.current.getFieldValue('discount')?.number
          : total * (formRef.current.getFieldValue('discount')?.number / 100);
      total -= currency;
    }
    if (formRef.current.getFieldValue('tax')?.number > 0) {
      const tax =
        formRef.current.getFieldValue('tax')?.currency === 1
          ? formRef.current.getFieldValue('tax')?.number
          : total * (formRef.current.getFieldValue('tax')?.number / 100);
      total += tax;
    }
    formRef.current.setFieldsValue({ total: total });
  };

  const handleSubmit = () => {
    formRef.current.validateFields().then((values) => {
      setLoading(true);
      const addMedicine = {
        ...values,
        discount: values.discount.number || 0,
        discountType: values.discount.currency || 1,
        tax: values.tax.number || 0,
        taxType: values.tax.currency || 1,
        flag: 1,
      };
      if (editOrCreate < 0) {
        addMedicine.flag = -1;
        addMedicine.id = values.clinicServiceId;
        const checkExits = data?.find(
          (item) => item.clinicServiceName === addMedicine.clinicServiceName
        );
        if (checkExits !== undefined) {
          setLoading(false);
          openNotification('error', 'Dịch vụ tồn tại trong phiếu!', '#fff1f0');
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

  const remove = (id, flag) => {
    if (flag > 0) {
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
    <>
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
          Danh sách dịch vụ
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
          Thêm dịch vụ (F2)
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
        <Col offset={1} span={5} xs={5}>
          Loại dv
        </Col>
        <Col span={6} xs={6}>
          Tên dịch vụ
        </Col>
        <Col span={2} xs={2}>
          SL
        </Col>
        <Col span={2} xs={2}>
          Đơn giá
        </Col>
        <Col span={2} xs={2}>
          Giảm
        </Col>
        <Col span={2} xs={2}>
          VAT
        </Col>
        <Col span={4} xs={4}>
          Tổng
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
                            title: 'Có chắc muốn xoá ?',
                            okText: 'Ok',
                            cancelText: 'Hủy',
                            onOk: () => {
                              remove(item.id, item.flag);
                            },
                            onCancel() {},
                          })
                        }
                      />
                    )}
                  </Col>
                  <Col span={5} xs={5}>
                    <span style={{ fontWeight: 'bold', color: '#4dbd74' }}>
                      {index + 1}. {item?.clinicTypeName}
                    </span>
                  </Col>
                  <Col span={6} xs={6}>
                    <span>{item?.clinicServiceName}</span>
                  </Col>
                  <Col span={2} xs={2}>
                    <span>{formatNumber(item?.amount || 0)}</span>
                  </Col>
                  <Col span={2} xs={2}>
                    <span>{formatNumber(item?.price || 0)}</span>
                  </Col>
                  <Col span={2} xs={2}>
                    <span>
                      {item?.discount && item?.discountType
                        ? `${formatNumber(item?.discount).toString()} ${
                            item?.discountType === 1 ? 'VNĐ' : '%'
                          }`
                        : 0}
                    </span>
                  </Col>
                  <Col span={2} xs={2}>
                    <span>
                      {item?.tax && item?.taxType
                        ? `${formatNumber(item?.tax).toString()} ${
                            item?.taxType === 1 ? 'VNĐ' : '%'
                          }`
                        : 0}
                    </span>
                  </Col>
                  <Col span={3} xs={3}>
                    <span>{formatNumber(item?.total || 0)}</span>
                  </Col>
                  <Col span={1} xs={1}>
                    <i
                      className="fas fa-pen"
                      style={{ color: '#5885a9', cursor: 'pointer' }}
                      onClick={() => {
                        setDataEdit(item);
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
          editOrCreate < 0 ? 'Thêm dịch vụ vào phiếu' : 'Sửa thông tin dịch vụ'
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
              id: dataEdit.id || '',
              clinicTypeId: dataEdit.clinicTypeId || undefined,
              clinicTypeName: dataEdit.clinicTypeName || '',
              clinicServicePackageId:
                dataEdit.clinicServicePackageId || undefined,
              clinicServiceId: dataEdit.clinicServiceId || undefined,
              clinicServiceName: dataEdit.clinicServiceName || '',
              userId: dataEdit.userId || undefined,
              price: dataEdit.price || 0,
              amount: dataEdit.amount || 0,
              total: dataEdit.total || 0,
              discount: {
                number: dataEdit.discount || 0,
                currency: dataEdit.discountType || 1,
              },
              tax: {
                number: dataEdit.tax || 0,
                currency: dataEdit.taxType || 1,
              },
            }}
            ref={formRef}
            key={`${data.id}_${key}` || '0'}
          >
            <FormItem hidden name="id">
              <Input />
            </FormItem>
            <FormItem hidden name="clinicTypeName">
              <Input />
            </FormItem>
            <FormItem hidden name="clinicServiceName">
              <Input />
            </FormItem>
            <Row gutter={20}>
              <Col sm={24} xs={24}>
                <FormItem
                  {...formItemLayout1}
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp; Loại dịch vụ
                    </span>
                  }
                  name="clinicTypeId"
                  rules={[
                    {
                      required: true,
                      message: intl.formatMessage({
                        id: 'app.common.crud.validate.select',
                      }),
                    },
                  ]}
                >
                  <ClinicTypeSelect
                    className="selectHiddenBorder"
                    placeholder="Chọn loại dịch vụ"
                    onChange={(id, name) => {
                      formRef.current.setFieldsValue({
                        clinicTypeName: name,
                      });
                      formRef.current.resetFields(['clinicServicePackageId']);
                      formRef.current.resetFields(['clinicServiceId']);
                      formRef.current.resetFields(['userId']);
                    }}
                  />
                </FormItem>
              </Col>
              <Col sm={24} xs={24}>
                <FormItem
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.clinicTypeId !== currentValues.clinicTypeId
                  }
                  noStyle
                >
                  {({ getFieldValue }) => (
                    <FormItem
                      {...formItemLayout1}
                      label={
                        <span>
                          <span style={{ color: 'red' }}>*</span>&nbsp; Gói dịch
                          vụ
                        </span>
                      }
                      name="clinicServicePackageId"
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
                        className="selectHiddenBorder"
                        placeholder="Chọn gói dịch vụ"
                        filter
                        filterField={getFieldValue('clinicTypeId') || 'a'}
                        onChange={() => {
                          formRef.current.resetFields(['clinicServiceId']);
                          formRef.current.resetFields(['userId']);
                        }}
                      />
                    </FormItem>
                  )}
                </FormItem>
              </Col>
              <Col sm={24} xs={24}>
                <FormItem
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.clinicServicePackageId !==
                    currentValues.clinicServicePackageId
                  }
                  noStyle
                >
                  {({ getFieldValue }) => (
                    <FormItem
                      {...formItemLayout1}
                      label={
                        <span>
                          <span style={{ color: 'red' }}>*</span>&nbsp; Dịch vụ
                        </span>
                      }
                      name="clinicServiceId"
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'app.common.crud.validate.select',
                          }),
                        },
                      ]}
                    >
                      <ClinicServiceSelect
                        className="selectHiddenBorder"
                        placeholder="Chọn dịch vụ"
                        filter
                        filterField={
                          getFieldValue('clinicServicePackageId') || 'a'
                        }
                        onChange={(id, name, time, userId, price) => {
                          formRef.current.setFieldsValue({
                            userId: Number(userId),
                            price: Number(price),
                            clinicServiceName: name,
                          });
                        }}
                      />
                    </FormItem>
                  )}
                </FormItem>
              </Col>
              <Col sm={24} xs={24}>
                <FormItem
                  {...formItemLayout1}
                  label={
                    <span>
                      <span style={{ color: 'red' }}>*</span>&nbsp; Bác sĩ
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
                    className="selectHiddenBorder"
                    placeholder="Chọn bác sĩ"
                    // onChange={this.handleChangeClinicTypeId}
                  />
                </FormItem>
              </Col>
            </Row>
            <div
              className="backgroundIsu2"
              style={{
                // height: '200px'
                marginTop: '20px',
              }}
            >
              <Row gutter={20}>
                <Col sm={24} xs={24}>
                  <FormItem
                    {...formItemLayout1}
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;Đơn giá
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
                      className="inputNumberHiddenBorder1"
                      onBlur={total}
                      placeholder="Nhập đơn giá"
                    />
                  </FormItem>
                </Col>
                <Col sm={24} xs={24}>
                  <FormItem
                    {...formItemLayout1}
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;Số lượng
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
                      className="inputNumberHiddenBorder1"
                      onBlur={total}
                      placeholder="Nhập số lượng"
                    />
                  </FormItem>
                </Col>
                <Col sm={24} xs={24}>
                  <FormItem
                    {...formItemLayout1}
                    name="discount"
                    label={<span>Giảm giá</span>}
                  >
                    <Discount
                      className1="inputNumberHiddenBorder1"
                      className2="selectHiddenBorder2"
                      onBlur={total}
                      placeholder="Nhập giảm giá"
                      key="discount"
                    />
                  </FormItem>
                </Col>
                <Col sm={24} xs={24}>
                  <FormItem
                    {...formItemLayout1}
                    name="tax"
                    label={<span>VAT</span>}
                  >
                    <Discount
                      className1="inputNumberHiddenBorder1"
                      className2="selectHiddenBorder2"
                      onBlur={total}
                      placeholder="Nhập VAT"
                      key="tax"
                    />
                  </FormItem>
                </Col>
                <Col sm={24} xs={24}>
                  <FormItem
                    {...formItemLayout1}
                    name="total"
                    label={<span>THÀNH TIỀN</span>}
                  >
                    <NumberInput
                      min={0}
                      disabled
                      className="inputNumberHiddenBorder"
                      style={{
                        fontWeight: 'bold',
                        fontSize: '18px',
                        color: 'rgba(0, 0, 0, 0.45)',
                        width: '100%',
                      }}
                      // key={key}
                    />
                  </FormItem>
                </Col>
              </Row>
            </div>
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default TableForm;
