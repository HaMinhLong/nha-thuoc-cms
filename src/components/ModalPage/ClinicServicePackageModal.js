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
  Card,
  PageHeader,
  TimePicker,
} from 'antd';
import ReactToPrint from 'react-to-print';
import regexHelper from '../../utils/regexHelper';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import ClinicTypeSelect from '../Common/ClinicTypeSelect';
import PrintFormSelect from '../Common/PrintFormSelect';
import CkEditor from '../CkEditor/CkEditor';
import PrintResults from '../PrintTemplate/Clinic/PrintResults';
const { isFullNameNnumber2 } = regexHelper;
const FormItem = Form.Item;

const ClinicServicePackageModal = ({
  intl,
  visible,
  dataEdit,
  titleModal,
  isMobile,
  getList,
}) => {
  const dispatch = useDispatch();
  const formRef = React.createRef();
  const componentRef = React.useRef();
  const [checkFirst, setCheckFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [data, setData] = useState({});
  const [key, setKey] = useState(Math.random());
  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      changeModal('show');
      getOne(dataEdit?.id);
    }
  }, [visible]);

  const getOne = (id) => {
    if (id) {
      setLoading(true);
      dispatch({
        type: 'clinicServicePackage/getOne',
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
  const handleSubmit = () => {
    formRef.current
      .validateFields()
      .then((values) => {
        setLoading(true);
        const healthFacilityId = localStorage.getItem('healthFacilityId');
        const addItem = {
          ...values,
          clinicServicePackageName:
            values.clinicServicePackageName &&
            values.clinicServicePackageName.trim(),
          clinicServicePackageNameOld: data.clinicServicePackageName,
          healthFacilityId,
        };
        if (data.id) {
          dispatch({
            type: 'clinicServicePackage/update',
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
            type: 'clinicServicePackage/add',
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
      width={isMobile ? '100%' : '70%'}
      style={{
        top: isMobile ? 0 : 30,
        margin: '0 auto',
      }}
      bodyStyle={{
        minHeight: '70vh',
        padding: '0px 0px 10px',
        background: '#F4F4F4',
      }}
      confirmLoading={loading}
      onCancel={() => changeModal('close')}
      visible={visibleModal}
      footer={null}
    >
      <PageHeader
        title={
          <p
            style={{
              fontWeight: '600',
              fontSize: 18,
              textTransform: 'uppercase',
            }}
          >
            {data.id
              ? intl.formatMessage(
                  { id: 'app.title.update' },
                  { name: data.clinicServicePackageName }
                )
              : intl.formatMessage({
                  id: 'app.clinicServicePackage.create.header',
                })}
          </p>
        }
        extra={[
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
            type="primary"
            htmlType="submit"
            style={{ marginLeft: 8, marginRight: 30 }}
            loading={loading}
            onClick={handleSubmit}
          >
            <i className="fa fa-save" />
            &nbsp;
            <FormattedMessage id="app.common.crudBtns.2" />
          </Button>,
        ]}
      >
        <Spin spinning={loading}>
          <Card
            bordered={false}
            style={{ boxShadow: '0px 0px 5px #00000029' }}
            bodyStyle={{ padding: '10px 10px 20px 10px', minHeight: '70vh' }}
          >
            <Form
              hideRequiredMark
              style={{ marginTop: 8 }}
              initialValues={{
                clinicServicePackageName: data.clinicServicePackageName || '',
                clinicTypeId: data.clinicTypeId || '',
                printFormId: data.printFormId || '',
                sampleResults: data.sampleResults || '',
                status: data.id ? data.status : 1,
              }}
              ref={formRef}
              layout="vertical"
              key={`${data.id}_${key}` || '0'}
            >
              <Row gutter={20}>
                <Col xs={24} md={24}>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.clinicServicePackage.list.col0',
                        })}
                      </span>
                    }
                    name="clinicServicePackageName"
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
                        id: 'app.clinicServicePackage.list.name',
                      })}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={12}>
                  <FormItem
                    name="clinicTypeId"
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        <FormattedMessage id="app.clinicServicePackage.list.col1" />
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
                    <ClinicTypeSelect
                      isMobile={isMobile}
                      intl={intl}
                      placeholder={intl.formatMessage({
                        id: 'app.clinicServicePackage.list.clinicType',
                      })}
                      allowClear
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={12}>
                  <FormItem
                    label={
                      <span>
                        <span style={{ color: 'red' }}>*</span>&nbsp;
                        {intl.formatMessage({
                          id: 'app.clinicServicePackage.list.col3',
                        })}
                      </span>
                    }
                    name="printFormId"
                    rules={[
                      {
                        required: true,
                        message: intl.formatMessage({
                          id: 'app.common.crud.validate.select',
                        }),
                      },
                    ]}
                  >
                    <PrintFormSelect
                      placeholder={intl.formatMessage({
                        id: 'app.clinicServicePackage.list.printForm',
                      })}
                      isMobile={isMobile}
                      intl={intl}
                      allowClear
                      onPrint={() => {
                        document.getElementById('print').click();
                      }}
                    />
                  </FormItem>
                </Col>
                <Col xs={24} md={24}>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({
                          id: 'app.clinicServicePackage.list.col4',
                        })}
                      </span>
                    }
                    name="sampleResults"
                  >
                    <CkEditor
                      onChangeData={(data) =>
                        formRef.current.setFieldsValue({
                          sampleResults: data,
                        })
                      }
                    />
                  </FormItem>
                </Col>

                <FormItem
                  // {...formItemLayout}
                  hidden
                  name="status"
                  valuePropName="checked"
                >
                  <Input />
                </FormItem>
              </Row>
              <div style={{ display: 'none' }}>
                <FormItem
                  shouldUpdate={(prevValues, currentValues) =>
                    prevValues.sampleResults !== currentValues.sampleResults ||
                    prevValues.clinicServicePackageName !==
                      currentValues.clinicServicePackageName ||
                    prevValues.printFormId !== currentValues.printFormId
                  }
                  noStyle
                >
                  {({ getFieldValue }) => (
                    <React.Fragment>
                      <ReactToPrint
                        trigger={() => (
                          <Button
                            id="print"
                            type="primary"
                            style={{ marginLeft: 8 }}
                            // loading={submitting}
                          >
                            {intl.formatMessage({
                              id: 'app.receipt.list.col12',
                            })}
                          </Button>
                        )}
                        content={() => componentRef.current}
                      />
                      <div ref={componentRef}>
                        <PrintResults
                          receiptIdProps={{}}
                          dataPrint={{
                            descriptions: getFieldValue('sampleResults'),
                            nameServices: getFieldValue(
                              'clinicServicePackageName'
                            ),
                            templateReceiptPrints: getFieldValue('printFormId'),
                          }}
                        />
                      </div>
                    </React.Fragment>
                  )}
                </FormItem>
              </div>
            </Form>
          </Card>
        </Spin>
      </PageHeader>
    </Modal>
  );
};

export default ClinicServicePackageModal;
