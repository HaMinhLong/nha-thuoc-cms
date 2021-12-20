import React, { useState, useEffect } from 'react';
import {
  Input,
  Button,
  Spin,
  Popconfirm,
  Form,
  Modal,
  notification,
  Row,
  Col,
} from 'antd';
import regexHelper from '../../utils/regexHelper';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ShortCutSelectApothecary from '../ShortCutSelect/ShortCutSelectApothecary';
import ShortCutSelectMedicineType from '../ShortCutSelect/ShortCutSelectMedicineType';
import ShortCutSelectPackage from '../ShortCutSelect/ShortCutSelectPackage';
import ShortCutSelectUnit from '../ShortCutSelect/ShortCutSelectUnit';
import ShortCutSelectProducer from '../ShortCutSelect/ShortCutSelectProducer';
import TableForm from '../MedicineUnitComponents/TableForm';
const { isFullNameNnumber2 } = regexHelper;
const FormItem = Form.Item;

const MedicineModal = ({
  intl,
  visible,
  dataEdit,
  titleModal,
  isMobile,
  getList,
}) => {
  const dispatch = useDispatch();
  const formRef = React.createRef();
  const [checkFirst, setCheckFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [data, setData] = useState({});
  const [key, setKey] = useState(Math.random());
  const [medicineUnits, setMedicineUnits] = useState([]);
  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      getOne(dataEdit?.id);
      changeModal('show');
    }
    if (dataEdit?.id) {
      getListMedicineUnit(dataEdit?.id);
    } else {
      setMedicineUnits([]);
    }
  }, [visible]);

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
          const data = list.map((item) => {
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

  const getOne = (id) => {
    if (id) {
      setLoading(true);
      dispatch({
        type: 'medicine/getOne',
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

  const handleMedicineUnit = (data) => {
    setMedicineUnits(data);
  };

  const addMedicineUnit = (value, text) => {
    const addItem = {
      id: -10000,
      unitName: text,
      unitId: value,
      amount: 1,
      retailPrice: 0,
      wholesalePrice: 0,
    };
    setMedicineUnits([...medicineUnits, addItem]);
  };

  const handleSubmit = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        setLoading(true);
        const healthFacilityId = localStorage.getItem('healthFacilityId');
        const addItem = {
          ...values,
          medicineName: values.medicineName && values.medicineName.trim(),
          medicineNameOld: data.medicineName,
          healthFacilityId,
          medicineUnits,
        };
        if (data.id) {
          dispatch({
            type: 'medicine/update',
            payload: {
              id: data.id,
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
                changeModal('close');
              } else {
                openNotification('error', res.message, '#fff1f0');
              }
              setLoading(false);
            },
          });
        } else {
          dispatch({
            type: 'medicine/add',
            payload: addItem,
            callback: (res) => {
              if (res?.success) {
                openNotification(
                  'success',
                  intl.formatMessage(
                    { id: 'app.common.create.success' },
                    { name: titleModal }
                  ),
                  '#f6ffed'
                );
                getList();
                changeModal('close');
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
  const changeModal = (value) => {
    if (value === 'show') {
      setVisibleModal(!visibleModal);
      setKey(key + 1);
    } else if (value === 'close') {
      setVisibleModal(false);
      setData({});
    }
  };
  return (
    <Modal
      title={
        <p style={{ fontWeight: '600', fontSize: 18 }}>
          {data.id
            ? intl.formatMessage(
                { id: 'app.title.update' },
                { name: data.medicineName }
              )
            : intl.formatMessage({ id: 'app.medicine.create.header' })}
        </p>
      }
      width="100%"
      style={{ top: 0, margin: '0 auto' }}
      bodyStyle={{ minHeight: '85vh', padding: '24px 24px 0px' }}
      maskStyle={{ backgroundColor: '#ECEFF4' }}
      confirmLoading={loading}
      onCancel={() => changeModal('close')}
      visible={visibleModal}
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
            medicineName: data.medicineName || '',
            registrationNumber: data.registrationNumber || '',
            standard: data.standard || '',
            activeIngredientName: data.activeIngredientName || '',
            concentration: data.concentration || '',
            country: data.country || '',
            apothecaryId: data.apothecaryId || undefined,
            medicineTypeId: data.medicineTypeId || undefined,
            packageId: data.packageId || undefined,
            producerId: data.producerId || undefined,
            unitId: medicineUnits[0]?.unitId || undefined,
            status: data.id ? data.status : 1,
          }}
          ref={formRef}
          layout="vertical"
          key={`${data.id}_${key}` || '0'}
        >
          <Row gutter={20}>
            <Col
              lg={14}
              xs={24}
              style={{ borderRight: !isMobile ? '1px solid #eee' : 'none' }}
            >
              <Row gutter={20}>
                <Col xs={24} md={16}>
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
                      disabled={data.id ? true : false}
                      placeholder={intl.formatMessage({
                        id: 'app.medicine.list.name',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={8}>
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
                      disabled={data.id ? true : false}
                      placeholder={intl.formatMessage({
                        id: 'app.medicine.list.registrationNumber',
                      })}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col xs={24} md={16}>
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
                      isMobile={isMobile}
                      intl={intl}
                      placeholder={intl.formatMessage({
                        id: 'app.medicine.list.apothecary',
                      })}
                      allowClear
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={8}>
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
                      isMobile={isMobile}
                      intl={intl}
                      placeholder={intl.formatMessage({
                        id: 'app.medicine.list.medicineType',
                      })}
                      allowClear
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col xs={24} md={16}>
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
                      disabled={data.id ? true : false}
                      isMobile={isMobile}
                      intl={intl}
                      placeholder={intl.formatMessage({
                        id: 'app.medicine.list.package',
                      })}
                      allowClear
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={8}>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        <FormattedMessage id="app.medicine.list.col9" />
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
                    <ShortCutSelectUnit
                      disabled={medicineUnits.length > 0}
                      isMobile={isMobile}
                      intl={intl}
                      placeholder={intl.formatMessage({
                        id: 'app.medicine.list.unit',
                      })}
                      onChange={(value, text) => addMedicineUnit(value, text)}
                      allowClear
                      value={medicineUnits[0]?.unitId || undefined}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={20}>
                <Col sm={16} xs={24}>
                  <Row gutter={20}>
                    <Col sm={12} xs={24}>
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
                          placeholder={intl.formatMessage({
                            id: 'app.medicine.list.standard',
                          })}
                        />
                      </FormItem>
                    </Col>
                    <Col sm={12} xs={24}>
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
                </Col>
                <Col sm={8} xs={24}>
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
                      autoSize={{ minRows: isMobile ? 3 : 10 }}
                      placeholder={intl.formatMessage({
                        id: 'app.medicine.list.concentration',
                      })}
                    />
                  </FormItem>
                </Col>
              </Row>
              <FormItem
                // {...formItemLayout}
                hidden
                name="status"
                valuePropName="checked"
              >
                <Input />
              </FormItem>
            </Col>
            <Col lg={10} xs={24} style={{ marginTop: isMobile ? '10px' : 0 }}>
              <FormItem>
                <TableForm
                  value={medicineUnits || []}
                  intl={intl}
                  isMobile={isMobile}
                  medicineId={dataEdit?.id}
                  onChange={handleMedicineUnit}
                />
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Spin>
    </Modal>
  );
};

export default MedicineModal;
