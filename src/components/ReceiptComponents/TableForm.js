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
  DatePicker,
  Popconfirm,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import NumberInput from '../NumberInput/NumberInput';
import Discount from '../NumberInput/Discount';
import { formatNumber } from '../../utils/utils';
import { FormattedMessage } from 'react-intl';
import ShortCutSelectApothecary from '../ShortCutSelect/ShortCutSelectApothecary';
import ShortCutSelectMedicineType from '../ShortCutSelect/ShortCutSelectMedicineType';
import ShortCutSelectPackage from '../ShortCutSelect/ShortCutSelectPackage';
import ShortCutSelectUnit from '../ShortCutSelect/ShortCutSelectUnit';
import ShortCutSelectProducer from '../ShortCutSelect/ShortCutSelectProducer';
import UnitSelectV2 from '../Common/UnitSelectV2';
import TableForm from '../MedicineUnitComponents/TableForm';
import regexHelper from '../../utils/regexHelper';
import './index.scss';
import '../../utils/css/styleIssu.scss';
import '../../utils/css/styleMedicine.scss';
import _ from 'lodash';
import debounce from 'lodash/debounce';

const { isFullNameNnumber2, isNumber } = regexHelper;
const FormItem = Form.Item;

const TableFormReceipt = (props) => {
  const { intl, isMobile, onChange, value, receiptCode, dataInfo } = props;
  const dispatch = useDispatch();
  const formRef = React.createRef();
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const [data, setData] = useState(value || []);
  const [loading, setLoading] = useState(false);
  const [visibleModalMedicine, setVisibleModalMedicine] = useState(false);
  const [visibleModalPrice, setVisibleModalPrice] = useState(false);
  const [editOrCreate, setEditOrCreate] = useState(-1);
  const [medicineUnits, setMedicineUnits] = useState([]);
  const [medicines, setMedicines] = useState({});
  const [receiptMedicines, setReceiptMedicines] = useState({});
  const [unit, setUnit] = useState([]);
  const [visibleMedicineSelect, setVisibleMedicineSelect] = useState(false);
  const [dataMedicineSelect, setDataMedicineSelect] = useState([]);
  const [medicineName, setMedicineName] = useState('');
  const [key, setKey] = useState(Math.random());

  useEffect(() => {
    setData(value || []);
  }, [value]);

  useEffect(() => {
    getListUnit();
  }, []);

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

  const remove = (medicineId, receiptMedicineId, flag) => {
    if (flag > 0) {
      dispatch({
        type: 'receiptMedicine/delete',
        payload: {
          id: receiptMedicineId,
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

  const handleMedicineUnit = (data) => {
    setMedicineUnits(data);
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

  const handleSubmit = () => {
    formRef.current.validateFields().then((values) => {
      const addMedicine = {
        id: values.id,
        medicineName: values.medicineName,
        medicineNameOld: values.medicineName,
        registrationNumber: values.registrationNumber,
        standard: values.standard,
        activeIngredientName: values.activeIngredientName,
        concentration: values.concentration,
        country: values.country,
        apothecaryId: values.apothecaryId,
        medicineTypeId: values.medicineTypeId,
        packageId: values.packageId,
        producerId: values.producerId,
        unitId: values.unitId,
        status: 1,
        flag: 1,
        healthFacilityId,
        medicineUnits,
      };
      addMedicine.receiptMedicines = {
        id: values.receiptMedicineId,
        barcode: values.barcode,
        lotNumber: values.lotNumber,
        dateOfManufacture: values.dateOfManufacture,
        expiry: values.expiry,
        unitId: values.unitImport,
        price: values.price,
        amount: values.amount,
        discount: values.discount.number,
        discountType: values.discount.currency,
        tax: values.tax.number,
        taxType: values.tax.currency,
        total: values.total,
      };
      if (editOrCreate < 0) {
        addMedicine.flag = -1;
        const checkExits = data?.find(
          (item) => item.medicineName === addMedicine.medicineName
        );
        if (checkExits !== undefined) {
          openNotification('error', 'Thuốc đã tồn tại trong phiếu!', '#fff1f0');
        } else {
          dispatch({
            type: 'medicine/update',
            payload: {
              id: addMedicine.id,
              params: {
                ...addMedicine,
              },
            },
            callback: (res) => {
              if (res?.success) {
                openNotification(
                  'success',
                  intl.formatMessage({ id: 'app.common.edit.success' }),
                  '#f6ffed'
                );
              } else {
                openNotification('error', res.message, '#fff1f0');
              }
              setLoading(false);
            },
          });
          setData([...data, addMedicine]);
          setVisibleModalMedicine(false);
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
        setVisibleModalMedicine(false);
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
    setMedicineName(record.medicineName);
    formRef.current.setFieldsValue({
      id: record?.id,
      medicineName: record?.medicineName,
      registrationNumber: record?.registrationNumber,
      standard: record?.standard,
      activeIngredientName: record?.activeIngredientName,
      concentration: record?.concentration,
      country: record?.country,
      apothecaryId: record?.apothecaryId,
      medicineTypeId: record?.medicineTypeId,
      packageId: record?.packageId,
      producerId: record?.producerId,
      unitId: medicineUnits[0]?.unitId,
    });
    setVisibleMedicineSelect(false);
  };

  const removeMedicine = () => {
    formRef.current.resetFields();
    setMedicineUnits([]);
    setMedicines({});
    setReceiptMedicines({});
    setDataMedicineSelect([]);
    setMedicineName('');
    setVisibleMedicineSelect(false);
  };

  const totalMedicine = (data) => {
    let total = 0;
    data.map((item) => {
      total += item?.receiptMedicines?.total;
    });
    return formatNumber(Math.round(total));
  };

  const handleReset = () => {
    // formRef.current.resetFields();
    setMedicineUnits([]);
    setMedicines({});
    setReceiptMedicines({});
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
            {dataInfo?.id ? dataInfo?.receiptCode : receiptCode?.receiptCode}
          </span>
        </div>
        <Button
          type="primary"
          icon={<i className="fas fa-plus" style={{ marginRight: '5px' }} />}
          onClick={() => {
            setEditOrCreate(-1);
            setMedicineName('');
            setKey(key + 1);
            setVisibleModalMedicine(!visibleModalMedicine);
          }}
        >
          {intl.formatMessage({ id: 'app.medicine.create.header' })}
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
                  <Menu.Item key="0">
                    <span style={{ fontSize: '12px' }}>
                      {' '}
                      {intl.formatMessage({
                        id: 'app.receiptMedicine.list.col12',
                      })}
                    </span>
                  </Menu.Item>
                  <Menu.Item key="1">
                    <span
                      style={{ fontSize: '12px' }}
                      onClick={() => {
                        getListMedicineUnit(item?.id);
                        setMedicines(item);
                        setMedicineName(item?.medicineName);
                        setReceiptMedicines(item?.receiptMedicines);
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
                                  item.receiptMedicines.id,
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
                      <span style={{ fontWeight: 'bold', color: '#4dbd74' }}>
                        {index + 1}. {item?.medicineName}
                      </span>
                    </Col>
                    <Col span={4} xs={4}>
                      <span>
                        {formatNumber(item?.receiptMedicines?.amount || 0)}
                        &nbsp;
                        {
                          unit?.find(
                            (it) => it.id === item?.receiptMedicines?.unitId
                          )?.unitName
                        }
                      </span>
                    </Col>
                    <Col span={6} xs={6}>
                      <span>
                        {formatNumber(item?.receiptMedicines?.total || 0)}
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
              id: medicines?.id,
              medicineName: medicines?.medicineName,
              registrationNumber: medicines?.registrationNumber,
              standard: medicines?.standard,
              activeIngredientName: medicines?.activeIngredientName,
              concentration: medicines?.concentration,
              country: medicines?.country,
              apothecaryId: medicines.apothecaryId || undefined,
              medicineTypeId: medicines.medicineTypeId || undefined,
              packageId: medicines.packageId || undefined,
              producerId: medicines.producerId || undefined,
              unitId: medicineUnits[0]?.unitId || undefined,
              receiptMedicineId: receiptMedicines?.id,
              barcode: receiptMedicines?.barcode,
              lotNumber: receiptMedicines?.lotNumber,
              dateOfManufacture: receiptMedicines.dateOfManufacture
                ? moment(receiptMedicines.dateOfManufacture)
                : moment(),
              expiry: receiptMedicines.expiry
                ? moment(receiptMedicines.expiry)
                : moment(),
              unitImport: receiptMedicines?.unitId || undefined,
              price: receiptMedicines?.price,
              amount: receiptMedicines?.amount,
              discount: {
                number: receiptMedicines?.discount,
                currency: receiptMedicines?.discountType,
              },
              tax: {
                number: receiptMedicines?.tax,
                currency: receiptMedicines?.taxType,
              },
              total: receiptMedicines?.total,
            }}
            ref={formRef}
            layout="vertical"
            key={key}
          >
            <FormItem hidden name="id">
              <Input />
            </FormItem>
            <FormItem hidden name="receiptMedicineId">
              <Input />
            </FormItem>

            <Row gutter={20}>
              <Col
                lg={14}
                xs={24}
                style={{ borderRight: !isMobile ? '1px solid #eee' : 'none' }}
              >
                <Row gutter={20}>
                  <Col xs={24} md={18}>
                    <Row gutter={{ md: 6 }}>
                      <Col span={medicineName && editOrCreate < 0 ? 22 : 24}>
                        <FormItem
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
                            disabled={medicineName}
                            name="medicineName"
                            autoComplete="off"
                          />
                        </FormItem>
                        {dataMedicineSelect &&
                          dataMedicineSelect.length > 0 &&
                          visibleMedicineSelect && (
                            <ul className="dropmed">
                              {dataMedicineSelect?.map((item) => (
                                <li
                                  key={item.id}
                                  className="itemLi"
                                  onClick={() => onSelectChange(item)}
                                >
                                  <span className="nameMed">
                                    {item.medicineName}
                                  </span>
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
                                    {item.producer &&
                                      item.producer.producerName}
                                  </span>
                                  <span> - {item.country}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                      </Col>
                      <Col
                        span={2}
                        style={{
                          display:
                            medicineName && editOrCreate < 0 ? 'block' : 'none',
                        }}
                      >
                        <FormItem {...formItemLayout} label={<span />}>
                          <Tooltip
                            title={intl.formatMessage({
                              id: 'app.tooltip.remove',
                            })}
                          >
                            <Button
                              type="ghost"
                              icon={<CloseOutlined />}
                              onClick={removeMedicine}
                              style={{
                                width: '100%',
                                color: 'white',
                                backgroundColor: '#E12330',
                              }}
                            />
                          </Tooltip>
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={24} md={6}>
                    <FormItem
                      label={
                        <span>
                          <span style={{ color: 'red' }}>*</span>&nbsp;
                          {intl.formatMessage({
                            id: 'app.medicine.list.col1',
                          })}
                        </span>
                      }
                      name="registrationNumber"
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
                        disabled={true}
                        placeholder={intl.formatMessage({
                          id: 'app.medicine.list.registrationNumber',
                        })}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col xs={24} md={12} lg={6}>
                    <FormItem
                      name="apothecaryId"
                      label={
                        <span>
                          <span style={{ color: 'red' }}>*</span>&nbsp;
                          <FormattedMessage id="app.medicine.list.col6" />
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
                      <ShortCutSelectApothecary
                        disabled={true}
                        isMobile={isMobile}
                        intl={intl}
                        placeholder={intl.formatMessage({
                          id: 'app.medicine.list.apothecary',
                        })}
                        allowClear
                      />
                    </FormItem>
                  </Col>
                  <Col xs={24} md={12} lg={6}>
                    <FormItem
                      name="medicineTypeId"
                      label={
                        <span>
                          <span style={{ color: 'red' }}>*</span>&nbsp;
                          <FormattedMessage id="app.medicine.list.col7" />
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
                      <ShortCutSelectMedicineType
                        disabled={true}
                        isMobile={isMobile}
                        intl={intl}
                        placeholder={intl.formatMessage({
                          id: 'app.medicine.list.medicineType',
                        })}
                        allowClear
                      />
                    </FormItem>
                  </Col>
                  <Col xs={24} md={12} lg={6}>
                    <FormItem
                      name="packageId"
                      label={
                        <span>
                          <span style={{ color: 'red' }}>*</span>&nbsp;
                          <FormattedMessage id="app.medicine.list.col8" />
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
                      <ShortCutSelectPackage
                        disabled={true}
                        isMobile={isMobile}
                        intl={intl}
                        placeholder={intl.formatMessage({
                          id: 'app.medicine.list.package',
                        })}
                        allowClear
                      />
                    </FormItem>
                  </Col>
                  <Col xs={24} md={12} lg={6}>
                    <FormItem
                      label={
                        <span>
                          <span style={{ color: 'red' }}>*</span>&nbsp;
                          <FormattedMessage id="app.medicine.list.col9" />
                        </span>
                      }
                      name="unitId"
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: intl.formatMessage({
                      //       id: 'app.common.crud.validate.select',
                      //     }),
                      //   },
                      // ]}
                    >
                      <ShortCutSelectUnit
                        disabled={true}
                        isMobile={isMobile}
                        intl={intl}
                        placeholder={intl.formatMessage({
                          id: 'app.medicine.list.unit',
                        })}
                        // onChange={(value, text) => addMedicineUnit(value, text)}
                        allowClear
                        // value={medicineUnits[0]?.unitId || undefined}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col sm={18} xs={24}>
                    <Row gutter={20}>
                      <Col sm={16} xs={24}>
                        <FormItem
                          label={
                            <span>
                              <span style={{ color: 'red' }}>*</span>&nbsp;
                              {intl.formatMessage({
                                id: 'app.medicine.list.col2',
                              })}
                            </span>
                          }
                          name="standard"
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
                            disabled={true}
                            placeholder={intl.formatMessage({
                              id: 'app.medicine.list.standard',
                            })}
                          />
                        </FormItem>
                      </Col>
                      <Col sm={8} xs={24}>
                        <FormItem
                          label={
                            <span>
                              <span style={{ color: 'red' }}>*</span>&nbsp;
                              {intl.formatMessage({
                                id: 'app.medicine.list.col3',
                              })}
                            </span>
                          }
                          name="activeIngredientName"
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
                              id: 'app.medicine.list.activeIngredientName',
                            })}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={20}>
                      <Col xs={24} md={16}>
                        <FormItem
                          name="producerId"
                          label={
                            <span>
                              <span style={{ color: 'red' }}>*</span>&nbsp;
                              <FormattedMessage id="app.medicine.list.col10" />
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
                          <ShortCutSelectProducer
                            isMobile={isMobile}
                            intl={intl}
                            placeholder={intl.formatMessage({
                              id: 'app.medicine.list.producerId',
                            })}
                            allowClear
                          />
                        </FormItem>
                      </Col>
                      <Col sm={8} xs={24}>
                        <FormItem
                          label={
                            <span>
                              <span style={{ color: 'red' }}>*</span>&nbsp;
                              {intl.formatMessage({
                                id: 'app.medicine.list.col5',
                              })}
                            </span>
                          }
                          name="country"
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
                              id: 'app.medicine.list.country',
                            })}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                    <Row gutter={20}>
                      <Col xs={24} md={12} lg={8}>
                        <FormItem
                          label={
                            <span>
                              {intl.formatMessage({
                                id: 'app.receiptMedicine.list.col0',
                              })}
                            </span>
                          }
                          name="barcode"
                          rules={[
                            {
                              pattern: isNumber,
                              message: intl.formatMessage({
                                id: 'app.common.crud.validate.number',
                              }),
                            },
                          ]}
                        >
                          <Input
                            disabled={medicines.flag > 0}
                            placeholder={intl.formatMessage({
                              id: 'app.receiptMedicine.list.barcode',
                            })}
                          />
                        </FormItem>
                      </Col>
                      <Col xs={24} md={12} lg={8}>
                        <FormItem
                          label={
                            <span>
                              {intl.formatMessage({
                                id: 'app.receiptMedicine.list.col1',
                              })}
                            </span>
                          }
                          name="lotNumber"
                        >
                          <Input
                            disabled={medicines.flag > 0}
                            placeholder={intl.formatMessage({
                              id: 'app.receiptMedicine.list.lotNumber',
                            })}
                          />
                        </FormItem>
                      </Col>
                      <Col xs={24} md={12} lg={8}>
                        <FormItem
                          label={
                            <span>
                              <span style={{ color: 'red' }}>*</span>&nbsp;
                              {intl.formatMessage({
                                id: 'app.receiptMedicine.list.col4',
                              })}
                            </span>
                          }
                          name="unitImport"
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
                            dataArr={medicineUnits || []}
                            allowClear
                          />
                        </FormItem>
                      </Col>
                      <Col xs={24} md={12} lg={8}>
                        <FormItem
                          label={
                            <span>
                              <span style={{ color: 'red' }}>*</span>&nbsp;
                              {intl.formatMessage({
                                id: 'app.receiptMedicine.list.col2',
                              })}
                            </span>
                          }
                          name="dateOfManufacture"
                          rules={[
                            {
                              required: true,
                              message: intl.formatMessage({
                                id: 'app.common.crud.validate.input',
                              }),
                            },
                          ]}
                        >
                          <DatePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                            placeholder={intl.formatMessage({
                              id: 'app.receiptMedicine.list.dateOfManufacture',
                            })}
                            disabledDate={(current) =>
                              current && current > moment().endOf('day')
                            }
                          />
                        </FormItem>
                      </Col>
                      <Col xs={24} md={12} lg={8}>
                        <FormItem
                          label={
                            <span>
                              <span style={{ color: 'red' }}>*</span>&nbsp;
                              {intl.formatMessage({
                                id: 'app.receiptMedicine.list.col3',
                              })}
                            </span>
                          }
                          name="expiry"
                          rules={[
                            {
                              required: true,
                              message: intl.formatMessage({
                                id: 'app.common.crud.validate.input',
                              }),
                            },
                          ]}
                        >
                          <DatePicker
                            style={{ width: '100%' }}
                            format="DD/MM/YYYY"
                            placeholder={intl.formatMessage({
                              id: 'app.receiptMedicine.list.expiry',
                            })}
                            disabledDate={(current) =>
                              current && current < moment().endOf('day')
                            }
                          />
                        </FormItem>
                      </Col>
                      <Col xs={24} md={12} lg={8}>
                        <FormItem
                          label={
                            <span>
                              <span style={{ color: 'red' }}>*</span>&nbsp;
                              {intl.formatMessage({
                                id: 'app.receiptMedicine.list.col5',
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
                              id: 'app.receiptMedicine.list.price',
                            })}
                            min={0}
                            onBlur={total}
                            // key={key}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={6} xs={24}>
                    <FormItem
                      label={
                        <span>
                          <span style={{ color: 'red' }}>*</span>&nbsp;
                          {intl.formatMessage({
                            id: 'app.medicine.list.col4',
                          })}
                        </span>
                      }
                      name="concentration"
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
                      <Input.TextArea
                        autoSize={{ minRows: isMobile ? 3 : 12.7 }}
                        placeholder={intl.formatMessage({
                          id: 'app.medicine.list.concentration',
                        })}
                      />
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={20}>
                  <Col xs={12} md={6}>
                    <FormItem
                      label={
                        <span>
                          <span style={{ color: 'red' }}>*</span>&nbsp;
                          {intl.formatMessage({
                            id: 'app.receiptMedicine.list.col6',
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
                        onBlur={total}
                        min={0}
                        disabled={medicines.flag > 0}
                        // key={key}
                      />
                    </FormItem>
                  </Col>
                  <Col xs={12} md={6}>
                    <FormItem
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
                      />
                    </FormItem>
                  </Col>
                  <Col xs={12} md={6}>
                    <FormItem
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
                      />
                    </FormItem>
                  </Col>
                  <Col xs={12} md={6}>
                    <FormItem
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
              </Col>
              <Col lg={10} xs={24} style={{ marginTop: isMobile ? '10px' : 0 }}>
                <FormItem>
                  <TableForm
                    value={medicineUnits || []}
                    intl={intl}
                    isMobile={isMobile}
                    medicineId={medicines?.id}
                    onChange={handleMedicineUnit}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>
    </Fragment>
  );
};

export default TableFormReceipt;
