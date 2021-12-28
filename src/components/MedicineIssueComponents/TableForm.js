/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, Fragment } from 'react';
import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
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
  Menu,
  Dropdown,
  Popconfirm,
  Checkbox,
} from 'antd';
import { useDispatch } from 'react-redux';
import NumberInput from '../NumberInput/NumberInput';
import Discount from '../NumberInput/Discount';
import { formatNumber } from '../../utils/utils';
import { FormattedMessage } from 'react-intl';
import WarehouseUserSelect from '../Common/WarehouseUserSelect';
import UnitSelectV2 from '../Common/UnitSelectV2';
import WarehouseMedicine from '../FilterMedicine/WarehouseMedicine';
import '../ReceiptComponents/index.scss';
import '../../utils/css/styleIssu.scss';
import '../../utils/css/styleMedicine.scss';

const FormItem = Form.Item;

const TableFormMedicineIssue = (props) => {
  const {
    intl,
    isMobile,
    onChange,
    value,
    medicineIssueCode,
    dataInfo,
    onChangeDataInfo,
    onChangeWarehouse,
  } = props;
  const dispatch = useDispatch();
  const formRef = React.createRef();
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const [data, setData] = useState(value || []);
  const [loading, setLoading] = useState(false);
  const [visibleModalMedicine, setVisibleModalMedicine] = useState(false);
  const [editOrCreate, setEditOrCreate] = useState(-1);
  const [medicineUnits, setMedicineUnits] = useState([]);
  const [medicines, setMedicines] = useState({});
  const [medicineIssueMedicines, setMedicineIssueMedicines] = useState({});
  const [unit, setUnit] = useState([]);
  const [visibleMedicineSelect, setVisibleMedicineSelect] = useState(false);
  const [dataMedicineSelect, setDataMedicineSelect] = useState([]);
  const [medicineName, setMedicineName] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [warehouseMedicine, setWarehouseMedicine] = useState([]);
  const [retailPrice, setRetailPrice] = useState(0);
  const [wholesalePrice, setWholesalePrice] = useState(0);
  const [key, setKey] = useState(Math.random());

  useEffect(() => {
    setData(value || []);
  }, [value]);

  useEffect(() => {
    getListUnit();
  }, []);

  useEffect(() => {
    if (dataInfo.id) {
      setWarehouseId(dataInfo.warehouseId);
      if (onChangeWarehouse) {
        onChangeWarehouse(dataInfo.warehouseId);
      }
    } else {
      setWarehouseId(undefined);
      if (onChangeWarehouse) {
        onChangeWarehouse(undefined);
      }
    }
  }, [dataInfo]);

  const getListUnit = () => {
    let params = {
      filter: JSON.stringify({}),
      range: JSON.stringify([0, 100]),
      sort: JSON.stringify(['createdAt', 'DESC']),
      attributes: 'id,unitName',
    };
    dispatch({
      type: 'unit/fetch',
      payload: params,
      callback: (res) => {
        if (res?.success) {
          const { list } = res.results;
          setUnit(list);
        }
      },
    });
  };
  const getListWarehouseMedicine = (warehouseId) => {
    let params = {
      filter: JSON.stringify({
        status: 1,
        healthFacilityId: healthFacilityId,
        warehouseId: warehouseId,
      }),
      range: JSON.stringify([0, 100]),
      sort: JSON.stringify(['createdAt', 'DESC']),
    };
    dispatch({
      type: 'warehouseMedicine/fetch',
      payload: params,
      callback: (res) => {
        if (res?.success) {
          const { list } = res.results;
          setWarehouseMedicine(list);
        }
      },
    });
  };

  const remove = (medicineId, medicineIssueMedicineId, flag) => {
    if (flag > 0) {
      dispatch({
        type: 'medicineIssueMedicine/delete',
        payload: {
          id: medicineIssueMedicineId,
        },
        callback: (res) => {
          if (res?.success === true) {
            openNotification(
              'success',
              intl.formatMessage({ id: 'app.common.delete.success' }),
              '#f6ffed'
            );
            setData(data?.filter((item) => item.id !== medicineId));
            if (onChange) {
              onChange(data?.filter((item) => item.id !== medicineId));
            }
          } else if (res?.success === false) {
            openNotification('error', res && res.message, '#fff1f0');
          }
        },
      });
    } else {
      setData(data?.filter((item) => item.id !== medicineId));
      if (onChange) {
        onChange(data?.filter((item) => item.id !== medicineId));
      }
    }
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

  const changeWarehouse = (value, text) => {
    setWarehouseId(value);
    if (onChangeWarehouse) {
      onChangeWarehouse(value);
    }
    getListWarehouseMedicine(value);
  };

  const total = () => {
    let total =
      formRef.current.getFieldValue('price') *
        formRef.current.getFieldValue('amount') || 0;
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

  const resetFields = () => {
    formRef.current.setFieldsValue({
      unitId: undefined,
      price: 0,
    });
  };

  const handleSubmit = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        const addMedicine = {
          ...medicines,
          status: 1,
          flag: 1,
          healthFacilityId,
        };
        addMedicine.medicineIssueMedicines = {
          id: values.medicineIssueMedicineId,
          price: values.price,
          amount: values.amount,
          unitId: values.unitId,
          retail: values.retail || false,
          description: values.description || '',
          discount: values.discount.number || 0,
          discountType: values.discount.currency || 1,
          tax: values.tax.number || 0,
          taxType: values.tax.currency || 1,
          total: values.total || 0,
          exchange: Number(
            medicineUnits?.find((it) => it.unitId === values.unitId)?.amount
          ),
        };
        if (editOrCreate < 0) {
          addMedicine.flag = -1;
          const checkExits = data?.find(
            (item) => item.medicineName === addMedicine.medicineName
          );
          if (checkExits !== undefined) {
            openNotification(
              'error',
              'Thuốc đã tồn tại trong phiếu!',
              '#fff1f0'
            );
          } else {
            setData([...data, addMedicine]);
            setVisibleModalMedicine(false);
            setMedicines({});
            setMedicineUnits([]);
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
          setData(newData);
          setMedicines({});
          setMedicineUnits([]);
          setVisibleModalMedicine(false);
          if (onChange) {
            onChange(newData);
          }
        }
      })
      .catch(({ errorFields }) => {
        formRef.current.scrollToField(errorFields[0].name);
      });
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

  const totalMedicine = (data) => {
    let total = 0;
    data.map((item) => {
      total += item?.medicineIssueMedicines?.total;
    });
    return formatNumber(Math.round(total));
  };

  const handleReset = () => {
    // formRef.current.resetFields();
    setMedicineUnits([]);
    setMedicines({});
    setMedicineIssueMedicines({});
    setDataMedicineSelect([]);
    setVisibleMedicineSelect(false);
    setVisibleModalMedicine(false);
  };

  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };

  const formItemLayout = {
    // colon: false,
    labelAlign: 'left',
    style: {
      marginBottom: 10,
    },
    labelCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 12 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 12 },
    },
  };

  return (
    <Fragment>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          padding: '10px 15px',
        }}
      >
        <div
          style={{
            fontSize: '15px',
            fontWeight: '500',
            display: isMobile ? 'grid' : 'block',
          }}
        >
          Mã&nbsp;
          <span style={{ color: '#196CA6' }}>
            {dataInfo?.id
              ? dataInfo?.medicineIssueCode
              : medicineIssueCode?.receiptCode}
          </span>
        </div>
        <WarehouseUserSelect
          placeholder={intl.formatMessage({
            id: 'app.medicineIssue.list.warehouse',
          })}
          value={warehouseId}
          onChange={changeWarehouse}
          style={{ width: '250px' }}
          disabled={dataInfo.id}
          size="small"
          key={Math.random()}
        />
      </div>
      {warehouseId !== undefined ? (
        <>
          <Button
            type="primary"
            icon={<i className="fas fa-plus" style={{ marginRight: '5px' }} />}
            style={{ float: 'right', marginRight: 15, marginBottom: 10 }}
            onClick={() => {
              setEditOrCreate(-1);
              setMedicineName('');
              setKey(key + 1);
              setVisibleModalMedicine(!visibleModalMedicine);
            }}
          >
            {intl.formatMessage({ id: 'app.medicine.create.header' })}
          </Button>
          <Row
            style={{
              background: '#F1F1F1',
              color: '#A9A9A9',
              padding: '10px 0',
              width: isMobile ? '900px' : '100%',
            }}
          >
            <Col offset={2} span={11} xs={11}>
              {intl.formatMessage({ id: 'app.receipt.list.col9' })}
            </Col>
            <Col span={4} xs={4}>
              {intl.formatMessage({ id: 'app.receipt.list.col10' })}
            </Col>
            <Col span={6} xs={6}>
              {intl.formatMessage({ id: 'app.receipt.list.col11' })}
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
                renderItem={(item, index) => {
                  const menu = (
                    <Menu>
                      <Menu.Item key="1">
                        <span
                          style={{ fontSize: '12px' }}
                          onClick={() => {
                            getListMedicineUnit(item?.id);
                            setMedicines(item);
                            setMedicineName(item?.medicineName);
                            setMedicineIssueMedicines(
                              item?.medicineIssueMedicines
                            );
                            setEditOrCreate(1);
                            setKey(key + 1);
                            setVisibleModalMedicine(true);
                          }}
                        >
                          {intl.formatMessage({
                            id: 'app.receiptMedicine.list.col13',
                          })}
                        </span>
                      </Menu.Item>
                    </Menu>
                  );
                  return (
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
                                    remove(
                                      item.id,
                                      item.medicineIssueMedicines.id,
                                      item.flag
                                    );
                                  },
                                  onCancel() {},
                                })
                              }
                            />
                          )}
                        </Col>
                        <Col offset={1} span={11} xs={11}>
                          <span
                            style={{ fontWeight: 'bold', color: '#4dbd74' }}
                          >
                            {index + 1}. {item?.medicineName}
                          </span>
                        </Col>
                        <Col span={4} xs={4}>
                          <span>
                            {formatNumber(
                              item?.medicineIssueMedicines?.amount || 0
                            )}
                            &nbsp;
                            {
                              unit?.find(
                                (it) =>
                                  it.id === item?.medicineIssueMedicines?.unitId
                              )?.unitName
                            }
                          </span>
                        </Col>
                        <Col span={6} xs={6}>
                          <span>
                            {formatNumber(
                              item?.medicineIssueMedicines?.total || 0
                            )}
                          </span>
                        </Col>
                        <Col span={1} xs={1}>
                          <Dropdown overlay={menu} trigger={['click']}>
                            <a
                              className="ant-dropdown-link"
                              onClick={(e) => e.preventDefault()}
                            >
                              <MenuOutlined style={{ fontSize: '1rem' }} />
                            </a>
                          </Dropdown>
                        </Col>
                      </Row>
                    </List.Item>
                  );
                }}
              />
            </Row>
          </div>
          <Row
            style={{
              background: 'rgb(241, 241, 241)',
              padding: '20px',
              color: '#002222',
              // textTransform: 'capitalize',
              fontSize: '15px',
              fontWeight: '500',
              position: 'absolute',
              bottom: 0,
              width: '100%',
            }}
          >
            <Col span={12}>Tổng tiền</Col>
            <Col offset={5} span={7} style={{ color: 'red' }}>
              {totalMedicine(data)}đ
            </Col>
          </Row>
        </>
      ) : (
        <div
          className="ant-empty ant-empty-normal"
          style={{
            borderTop: '1px solid #f1f1f1',
            padding: '50px',
          }}
        >
          <div className="ant-empty-image">
            <svg
              className="ant-empty-img-simple"
              width={64}
              height={41}
              viewBox="0 0 64 41"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g transform="translate(0 1)" fill="none" fillRule="evenodd">
                <ellipse
                  className="ant-empty-img-simple-ellipse"
                  cx={32}
                  cy={33}
                  rx={32}
                  ry={7}
                />
                <g className="ant-empty-img-simple-g" fillRule="nonzero">
                  <path d="M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z" />
                  <path
                    d="M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z"
                    className="ant-empty-img-simple-path"
                  />
                </g>
              </g>
            </svg>
          </div>
          <p className="ant-empty-description">
            Vui lòng chọn kho bán để thêm thuốc vào đơn
          </p>
        </div>
      )}
      <Modal
        key="Detail"
        title={
          <p style={{ fontWeight: '600', fontSize: 18 }}>{`${
            editOrCreate < 0
              ? intl.formatMessage({ id: 'app.receiptMedicine.create.header' })
              : intl.formatMessage({ id: 'app.receiptMedicine.update.header' })
          }`}</p>
        }
        visible={visibleModalMedicine}
        width="100%"
        style={{ top: 0, margin: '0 auto' }}
        bodyStyle={{ minHeight: '85vh', padding: '24px 24px 0px' }}
        maskStyle={{ backgroundColor: '#ECEFF4' }}
        confirmLoading={loading}
        onCancel={handleReset}
        footer={[
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
              id: medicines.id,
              medicineIssueMedicineId: medicineIssueMedicines?.id,
              price: medicineIssueMedicines?.price,
              amount: medicineIssueMedicines?.amount,
              unitId: medicineIssueMedicines.unitId || undefined,
              retail: medicineIssueMedicines?.retail,
              description: medicineIssueMedicines?.description,
              discount: {
                number: medicineIssueMedicines?.discount,
                currency: medicineIssueMedicines?.discountType,
              },
              tax: {
                number: medicineIssueMedicines?.tax,
                currency: medicineIssueMedicines?.taxType,
              },
              total: medicineIssueMedicines?.total,
            }}
            ref={formRef}
            key={key}
          >
            <FormItem hidden name="id">
              <Input />
            </FormItem>
            <FormItem hidden name="medicineIssueMedicineId">
              <Input />
            </FormItem>
            <Row gutter={20} justify="center" style={{ marginTop: '10px' }}>
              <Col
                sm={16}
                xs={24}
                style={{
                  height: '550px',
                }}
              >
                <FormItem name="id">
                  <WarehouseMedicine
                    intl={intl}
                    placeholder={''}
                    dataArr={warehouseMedicine}
                    medicineUnits={medicineUnits}
                    medicines={medicines}
                    getListMedicineUnit={getListMedicineUnit}
                    onChange={setMedicines}
                    resetFields={resetFields}
                    disabled={medicines.flag > 0}
                  />
                </FormItem>
              </Col>
              <Col sm={8} xs={24}>
                <div>
                  <h2
                    style={{
                      color: '#196CA6',
                      borderBottom: '1px solid #F1F1F1',
                    }}
                  >
                    Thông Tin Thuốc/vật tư
                  </h2>
                  <FormItem
                    {...formItemLayout}
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.medicine.list.col9',
                        })}
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
                      disabled={medicines.flag > 0}
                      placeholder={intl.formatMessage({
                        id: 'app.receiptMedicine.list.unit',
                      })}
                      className="selectHiddenBorder"
                      dataArr={medicineUnits || []}
                      value={medicineIssueMedicines.unitId || undefined}
                      onChange={(value, text, retailPrice, wholesalePrice) => {
                        formRef.current.setFieldsValue({ unitId: value });
                        setRetailPrice(Number(retailPrice));
                        setWholesalePrice(Number(wholesalePrice));
                        if (formRef.current.getFieldValue('retail')) {
                          formRef.current.setFieldsValue({
                            price: Number(retailPrice),
                          });
                        } else {
                          formRef.current.setFieldsValue({
                            price: Number(wholesalePrice),
                          });
                        }
                      }}
                      allowClear
                    />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.medicineIssue.list.col9',
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
                        id: 'app.receiptMedicine.list.amount',
                      })}
                      className="inputNumberHiddenBorder"
                      onBlur={total}
                      min={0}
                      disabled={medicines.flag > 0}
                      // key={key}
                    />
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.medicineIssue.list.col11',
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
                        id: 'app.medicineIssue.list.price',
                      })}
                      className="inputNumberHiddenBorder"
                      min={0}
                      onBlur={total}
                      // key={key}
                    />
                  </FormItem>
                  <FormItem name="description">
                    <Input.TextArea
                      placeholder={intl.formatMessage({
                        id: 'app.medicineIssue.list.description',
                      })}
                      autoSize={{ minRows: 7, maxRows: 7 }}
                    />
                  </FormItem>
                  <div
                    className="backgroundIsu2"
                    style={{
                      height: '200px',
                    }}
                  >
                    <FormItem
                      {...formItemLayout}
                      label={
                        <span>
                          {intl.formatMessage({
                            id: 'app.medicineIssue.list.col12',
                          })}
                        </span>
                      }
                      name="retail"
                      valuePropName="checked"
                    >
                      <Checkbox
                        style={{ float: 'right' }}
                        onChange={(e) => {
                          if (e.target.checked) {
                            formRef.current.setFieldsValue({
                              price: retailPrice,
                            });
                            total();
                          } else {
                            formRef.current.setFieldsValue({
                              price: wholesalePrice,
                            });
                            total();
                          }
                        }}
                      />
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label={
                        <span>
                          {intl.formatMessage({
                            id: 'app.receiptMedicine.list.col7',
                          })}
                        </span>
                      }
                      name="discount"
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'app.common.crud.validate.input',
                          }),
                        },
                      ]}
                    >
                      <Discount
                        placeholder={intl.formatMessage({
                          id: 'app.receiptMedicine.list.discount',
                        })}
                        onBlur={total}
                        smallWidth
                        className1="inputNumberHiddenBorder"
                        className2="selectHiddenBorder2"
                        style1={{ background: '#F8F8F8' }}
                      />
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label={
                        <span>
                          {intl.formatMessage({
                            id: 'app.receiptMedicine.list.col8',
                          })}
                        </span>
                      }
                      name="tax"
                      rules={[
                        {
                          required: true,
                          message: intl.formatMessage({
                            id: 'app.common.crud.validate.input',
                          }),
                        },
                      ]}
                    >
                      <Discount
                        placeholder={intl.formatMessage({
                          id: 'app.receiptMedicine.list.tax',
                        })}
                        onBlur={total}
                        smallWidth
                        className1="inputNumberHiddenBorder"
                        className2="selectHiddenBorder2"
                        style1={{ background: '#F8F8F8' }}
                      />
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label={
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: 'red',
                            textTransform: 'uppercase',
                          }}
                        >
                          {intl.formatMessage({
                            id: 'app.receiptMedicine.list.col11',
                          })}
                        </span>
                      }
                      name="total"
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
                  </div>
                </div>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </Fragment>
  );
};

export default TableFormMedicineIssue;
