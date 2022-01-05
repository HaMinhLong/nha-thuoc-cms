import React, { useState, useEffect } from 'react';
import {
  Input,
  Spin,
  Row,
  Col,
  Popconfirm,
  Button,
  notification,
  Card,
  Tooltip,
  Form,
  Modal,
} from 'antd';
import HeaderContent from '../../layouts/HeaderContent';
import { FormattedMessage } from 'react-intl';
import regexHelper from '../../utils/regexHelper';
import { useDispatch } from 'react-redux';
import UserSelect from '../Common/UserSelect';
import WarehouseUserSelect from '../Common/WarehouseUserSelect';
import ReactToPrint from 'react-to-print';
import MedicineTransfer from '../PrintTemplate/Pharmacy/MedicineTransfer';

const FormItem = Form.Item;
const { invoiceCode } = regexHelper;

const MedicineTransferPage = ({
  childrenOne,
  childrenTwo,
  intl,
  isMobile,
  permissions,
  spinning,
  dataInfo,
  medicineTransferCode,
  getList,
  getReceiptCode,
  onCreate,
  dataMedicines,
  warehouseId,
  warehouseName,
}) => {
  const formRef = React.createRef();
  const componentRef = React.useRef();
  const dispatch = useDispatch();
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const userId = localStorage.getItem('id');
  const [loading, setLoading] = useState(false);
  const [dataDetails, setDataDetails] = useState(dataInfo);
  const [userFullName, setUserFullName] = useState('');
  const [warehouseTransferName, setWarehouseTransferName] = useState('');
  const [dataForm, setDataForm] = useState({});
  const [key, setKey] = useState(Math.random());

  useEffect(() => {
    setKey(key + 1);
    setDataDetails(dataInfo);
  }, [dataInfo]);

  useEffect(() => {
    formRef.current.resetFields();
  }, [warehouseId]);

  useEffect(() => {
    formRef.current.setFieldsValue({
      medicineTransferCode: medicineTransferCode.receiptCode,
    });
  }, [medicineTransferCode]);

  const handleSubmit = (values) => {
    const addItem = {
      ...values,
      medicineTransferCode:
        values.medicineTransferCode && values.medicineTransferCode.trim(),
      medicineTransferCodeOld:
        values.medicineTransferCode && values.medicineTransferCode.trim(),
      status: values.status || 1,
      healthFacilityId,
      warehouseId,
      medicines: dataMedicines,
    };
    if (warehouseId === undefined) {
      setLoading(false);
      openNotification(
        'error',
        'Vui lòng chọn kho xuất Thuốc/Vật tư!',
        '#fff1f0'
      );
    } else {
      if (dataMedicines.length === 0) {
        setLoading(false);
        openNotification('error', 'Vui lòng thêm thuốc vào phiếu!', '#fff1f0');
      } else {
        if (dataDetails.id) {
          dispatch({
            type: 'medicineTransfer/update',
            payload: {
              id: dataDetails.id,
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
                setKey(key + 1);
                onCreate();
              } else {
                openNotification('error', res.message, '#fff1f0');
              }
              setLoading(false);
            },
          });
        } else {
          dispatch({
            type: 'medicineTransfer/add',
            payload: addItem,
            callback: (res) => {
              if (res?.success) {
                openNotification(
                  'success',
                  intl.formatMessage(
                    { id: 'app.common.create.success' },
                    {
                      name: intl.formatMessage({
                        id: 'app.medicineTransfer.list.title',
                      }),
                    }
                  ),
                  '#f6ffed'
                );
                updateReceiptCode();
                getList();
                setKey(key + 1);
                onCreate();
              } else {
                openNotification('error', res.message, '#fff1f0');
              }
              setLoading(false);
            },
          });
        }
      }
    }
  };

  const handleConfirm = () => {
    formRef.current.validateFields().then((values) => {
      setDataForm(values);
      if (dataMedicines.length > 0 && warehouseId !== undefined) {
        const modal = Modal.confirm({
          title: 'Lưu thông tin',
          content: (
            <React.Fragment>
              <i
                className="fas fa-times"
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  modal.destroy();
                }}
              />
              Bạn có muốn in phiếu ?
            </React.Fragment>
          ),
          okText: 'Có',
          cancelText: 'Không',
          onOk: () => handleSubmitAndPrint(true, values),
          onCancel: () => handleSubmitAndPrint(false, values),
        });
      } else {
        if (warehouseId === undefined) {
          setLoading(false);
          openNotification(
            'error',
            'Vui lòng chọn kho xuất Thuốc/Vật tư!',
            '#fff1f0'
          );
        } else if (dataMedicines.length === 0) {
          setLoading(false);
          openNotification(
            'error',
            'Vui lòng thêm thuốc vào phiếu!',
            '#fff1f0'
          );
        }
      }
    });
  };

  // Lưu giá trị thay đổi và in
  const handleSubmitAndPrint = (flag, values) => {
    if (flag) {
      document.getElementById('print').click();
    }
    handleSubmit(values);
  };

  const updateReceiptCode = () => {
    dispatch({
      type: 'receiptCode/update',
      payload: {
        id: medicineTransferCode.id,
      },
      callback: (res) => {
        if (res?.success) {
          getReceiptCode();
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

  const handleReset = () => {
    formRef.current.resetFields();
  };

  const formItemLayout = {
    labelAlign: 'left',
    style: {
      marginBottom: 5,
    },
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 14 },
    },
  };

  const formItemLayout1 = {
    labelAlign: 'left',
    style: {
      marginBottom: 0,
    },
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
      md: { span: 20 },
    },
  };

  return (
    <React.Fragment>
      <HeaderContent
        title={<FormattedMessage id="app.medicineTransfer.list.header" />}
        action={
          <React.Fragment>
            <div>
              {permissions.isAdd && dataDetails.id && (
                <Tooltip
                  title={
                    !isMobile &&
                    intl.formatMessage({
                      id: 'app.medicineTransfer.create.header',
                    })
                  }
                >
                  <Button
                    icon={
                      <i
                        className="fas fa-plus"
                        style={{ marginRight: '5px' }}
                      />
                    }
                    className="buttonThemMoi"
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      onCreate();
                      setKey(key + 1);
                    }}
                  >
                    {intl.formatMessage(
                      { id: 'app.title.create' },
                      { name: '(F2)' }
                    )}
                  </Button>
                </Tooltip>
              )}
              {permissions.isAdd && (
                <Popconfirm
                  placement="bottom"
                  title={<FormattedMessage id="app.confirm.reset" />}
                  onConfirm={() => handleReset()}
                >
                  <Button type="primary" style={{ marginLeft: 8 }}>
                    <i className="fa fa-ban" />
                    &nbsp;
                    <FormattedMessage id="app.common.crudBtns.1" />
                  </Button>
                </Popconfirm>
              )}
              {permissions.isAdd && (
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginLeft: 8 }}
                  loading={loading}
                  onClick={() => handleConfirm()}
                >
                  <i className="fa fa-save" />
                  &nbsp;
                  <FormattedMessage id="app.common.crudBtns.2" />
                </Button>
              )}
            </div>
          </React.Fragment>
        }
      >
        <Row gutter={isMobile ? 0 : 10} style={{ background: '#e0e8ef' }}>
          <Col lg={15} xs={24}>
            <Spin spinning={spinning}>
              <Card
                bordered={false}
                style={{ boxShadow: '0px 0px 5px #00000029' }}
                nolegacystyle="true"
              >
                <Form
                  hideRequiredMark
                  style={{ marginTop: 8 }}
                  initialValues={{
                    medicineTransferCode: dataDetails.id
                      ? dataDetails.medicineTransferCode
                      : medicineTransferCode.receiptCode,
                    userId: dataDetails.id
                      ? dataDetails.userId
                      : Number(userId),
                    warehouseTransferId: dataDetails.id
                      ? dataDetails.warehouseTransferId
                      : undefined,
                    description: dataDetails.id ? dataDetails.description : '',
                    status: dataDetails.id ? dataDetails.status : 1,
                  }}
                  ref={formRef}
                  key={key}
                >
                  <Row gutter={10}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={
                          <span>
                            <span style={{ color: 'red' }}>*</span>&nbsp;
                            {intl.formatMessage({
                              id: 'app.medicineTransfer.list.col0',
                            })}
                          </span>
                        }
                        name="medicineTransferCode"
                        rules={[
                          {
                            required: true,
                            message: intl.formatMessage({
                              id: 'app.common.crud.validate.input',
                            }),
                          },
                          {
                            pattern: invoiceCode,
                            message: intl.formatMessage({
                              id: 'app.common.crud.validate.fomatMedi',
                            }),
                          },
                        ]}
                      >
                        <Input
                          placeholder={intl.formatMessage({
                            id: 'app.medicineTransfer.list.name',
                          })}
                          size="small"
                          disabled
                        />
                      </FormItem>
                    </Col>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        name="userId"
                        label={
                          <span>
                            <span style={{ color: 'red' }}>*</span>&nbsp;
                            {intl.formatMessage({
                              id: 'app.medicineTransfer.list.col1',
                            })}
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
                        <UserSelect
                          size="small"
                          placeholder={intl.formatMessage({
                            id: 'app.medicineTransfer.list.exporter',
                          })}
                          onChange={(value, text) => setUserFullName(text)}
                        />
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        name="warehouseTransferId"
                        label={
                          <span>
                            <span style={{ color: 'red' }}>*</span>&nbsp;
                            {intl.formatMessage({
                              id: 'app.medicineTransfer.list.col3',
                            })}
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
                        <WarehouseUserSelect
                          size="small"
                          placeholder={intl.formatMessage({
                            id: 'app.medicineTransfer.list.warehouseTransfer',
                          })}
                          warehouseId={warehouseId}
                          disabled={!warehouseId || dataDetails.id}
                          onChange={(value, text) => {
                            setWarehouseTransferName(text);
                          }}
                        />
                      </FormItem>
                    </Col>
                    <Col sm={12} xs={24}>
                      <FormItem
                        {...formItemLayout}
                        label={
                          <span>
                            {intl.formatMessage({
                              id: 'app.medicineTransfer.list.col4',
                            })}
                          </span>
                        }
                        name="description"
                        rules={[
                          {
                            max: 200,
                            message: intl.formatMessage({
                              id: 'app.common.validate.max200',
                            }),
                          },
                        ]}
                      >
                        <Input
                          placeholder={intl.formatMessage({
                            id: 'app.medicineTransfer.list.description',
                          })}
                          className="input_descriptions"
                          suffix={<span className="suffix">200</span>}
                          size="small"
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </Card>
            </Spin>
            {childrenOne}
            <div style={{ display: 'none' }}>
              <ReactToPrint
                trigger={() => (
                  <Button
                    id="print"
                    type="primary"
                    style={{ marginLeft: 8 }}
                    // loading={submitting}
                  >
                    Lưu và in phiếu thu
                  </Button>
                )}
                content={() => componentRef.current}
              />
              <div ref={componentRef}>
                <MedicineTransfer
                  title={intl.formatMessage({
                    id: 'app.medicineTransfer.list.title1',
                  })}
                  dataMedicines={dataMedicines}
                  dataForm={dataForm}
                  fullName={userFullName}
                  warehouseName={warehouseName}
                  warehouseTransferName={warehouseTransferName}
                  medicineTransferCode={medicineTransferCode}
                  dataInfo={dataDetails}
                />
              </div>
            </div>
          </Col>
          <Col lg={9} xs={24}>
            <div
              style={{
                background: '#FFF',
                boxShadow: '0px 0px 5px #00000029',
                height: '100%',
                position: 'relative',
              }}
            >
              {childrenTwo}
            </div>
          </Col>
        </Row>
      </HeaderContent>
    </React.Fragment>
  );
};

export default MedicineTransferPage;
