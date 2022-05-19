import React, { useState, useEffect, Fragment } from 'react';
import { Button, Modal, Form, Row, Col, notification, Spin } from 'antd';
import moment from 'moment';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import DoctorSelect from '../Common/DoctorSelect';
import ReactToPrint from 'react-to-print';
import PrintResults from '../PrintTemplate/Clinic/PrintResults';
import CkEditor from '../CkEditor/CkEditor';
import MedicalRegisterModal from './MedicalRegisterModal';
import ClinicReceiptModal from './ClinicReceiptModal';
import ClinicPrescriptionModal from './ClinicPrescriptionModal';

import '../../utils/css/styleList.scss';

const FormItem = Form.Item;

const ClinicResultModal = ({
  isMobile,
  visible,
  intl,
  titleModal,
  dataEdit,
  getList,
  isRegisterPage,
}) => {
  const formRef = React.createRef();
  const componentRef = React.useRef();
  const dispatch = useDispatch();
  const [checkFirst, setCheckFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [data, setData] = useState({});
  const [key, setKey] = useState(Math.random());
  const [visibleRegister, setVisibleRegister] = useState(false);
  const [visibleReceipt, setVisibleReceipt] = useState(false);
  const [visiblePrescription, setVisiblePrescription] = useState(false);
  const [dataForm, setDataForm] = useState([]);

  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      getOne(dataEdit?.id);
      changeModal('show');
    }
  }, [visible]);

  const changeModal = (value) => {
    if (value === 'show') {
      setKey(key + 1);
      setVisibleModal(!visibleModal);
    } else if (value === 'close') {
      setVisibleModal(false);
    }
  };

  const getOne = (id) => {
    if (id) {
      setLoading(true);
      dispatch({
        type: 'clinicResult/getOne',
        payload: {
          id: id,
        },
        callback: (res) => {
          setLoading(false);
          if (res?.success) {
            const { list } = res.results;
            setData({ ...dataEdit, description: list.description });
          }
        },
      });
    } else {
      setData({ ...dataEdit });
    }
  };

  const handleConfirm = () => {
    formRef.current.validateFields().then((values) => {
      const addItem = {
        ...values,
        description: data.description,
        medicalRegisterId: data?.medicalRegisterId,
        ...dataEdit,
      };
      setDataForm(addItem);
      const modal = Modal.confirm({
        title: intl.formatMessage({ id: 'app.receipt.list.col13' }),
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
            {intl.formatMessage({ id: 'app.receipt.list.col12' })}
          </React.Fragment>
        ),
        okText: intl.formatMessage({ id: 'app.common.yes' }),
        cancelText: intl.formatMessage({ id: 'app.common.no' }),
        onOk: () => handleSubmitAndPrint(true, values),
        onCancel: () => handleSubmitAndPrint(false, values),
      });
    });
  };

  // Lưu giá trị thay đổi và in
  const handleSubmitAndPrint = (flag, values) => {
    if (flag) {
      document.getElementById('printResult').click();
    }
    handleSubmit(values);
  };

  const handleSubmit = (values) => {
    const addItem = {
      ...values,
      description: data.description,
      medicalRegisterId: data?.medicalRegisterId,
    };
    if (data?.id) {
      dispatch({
        type: 'clinicResult/update',
        payload: {
          id: data?.id,
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
            if (getList) {
              getList();
            }
            changeModal('close');
          } else {
            openNotification('error', res.message, '#fff1f0');
          }
          setLoading(false);
        },
      });
    } else {
      dispatch({
        type: 'clinicResult/add',
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
            if (getList) {
              getList();
            }
            changeModal('close');
          } else {
            openNotification('error', res.message, '#fff1f0');
          }
          setLoading(false);
        },
      });
    }
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
      xs: { span: 10 },
      sm: { span: 24 },
      md: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 14 },
      sm: { span: 24 },
      md: { span: 14 },
    },
    //   colon: false,
    labelAlign: 'left',
    style: { marginBottom: 0 },
  };

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
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              onClick={() => handleConfirm()}
            >
              <i className="fa fa-save" />
              &nbsp;
              <FormattedMessage id="app.common.crudBtns.2" />
            </Button>
            {isRegisterPage && (
              <Button
                type="primary"
                style={{ marginLeft: 8 }}
                loading={loading}
                onClick={() => setVisibleRegister(!visibleRegister)}
              >
                Thêm lịch tái khám
              </Button>
            )}
            {isRegisterPage && (
              <Button
                style={{ marginLeft: 8 }}
                loading={loading}
                onClick={() => setVisibleReceipt(!visibleReceipt)}
              >
                Cận lâm sàng
              </Button>
            )}
            {isRegisterPage && (
              <Button
                style={{ marginLeft: 8 }}
                loading={loading}
                onClick={() => setVisiblePrescription(!visiblePrescription)}
              >
                Kê đơn thuốc
              </Button>
            )}
          </div>
        }
      >
        <Form hideRequiredMark ref={formRef} key={`${data?.id}_${key}` || '0'}>
          <Spin spinning={loading}>
            <Row gutter={8}>
              <Col
                md={18}
                xs={24}
                style={{ marginBottom: isMobile ? '10px' : '0' }}
              >
                <FormItem>
                  <CkEditor
                    value={data?.id ? data.description : ''}
                    onChangeData={(value) =>
                      setData({ ...data, description: value })
                    }
                  />
                </FormItem>
              </Col>
              <Col md={6} xs={24}>
                <div
                  style={{
                    background: '#fff',
                    height: '82vh',
                    overflowY: 'auto',
                    padding: '0px 24px',
                  }}
                  className="col_card_custom"
                >
                  <h2
                    style={{
                      color: '#196CA6',
                      borderBottom: '1px solid #F1F1F1',
                    }}
                  >
                    {intl.formatMessage({ id: 'app.clinicResult.list.col9' })}
                  </h2>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({
                          id: 'app.clinicResult.list.col2',
                        })}
                      </span>
                    }
                    {...formItemLayout}
                  >
                    <p style={{ marginBottom: '-13px', marginTop: '-15px' }}>
                      {data?.customer?.mobile}
                    </p>
                  </FormItem>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({
                          id: 'app.clinicResult.list.col1',
                        })}
                      </span>
                    }
                    {...formItemLayout}
                  >
                    <p style={{ marginBottom: '-13px', marginTop: '-15px' }}>
                      {data?.customer?.customerName}
                    </p>
                  </FormItem>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({
                          id: 'app.clinicResult.list.col6',
                        })}
                      </span>
                    }
                    {...formItemLayout}
                  >
                    <p style={{ marginBottom: '-13px', marginTop: '-15px' }}>
                      {moment(data?.customer?.dateOfBirth).format('DD/MM/YYYY')}
                    </p>
                  </FormItem>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({
                          id: 'app.clinicResult.list.col7',
                        })}
                      </span>
                    }
                    {...formItemLayout}
                  >
                    <p style={{ marginBottom: '-13px', marginTop: '-15px' }}>
                      {data && moment(data?.date).format('DD/MM/YYYY')}
                    </p>
                  </FormItem>
                  <FormItem
                    label={
                      <span>
                        {intl.formatMessage({
                          id: 'app.clinicResult.list.col5',
                        })}
                      </span>
                    }
                    {...formItemLayout}
                  >
                    <DoctorSelect
                      placeholder={intl.formatMessage({
                        id: 'app.clinicReceiptService.list.doctor',
                      })}
                      value={data?.userId}
                      size="small"
                      disabled
                    />
                  </FormItem>
                </div>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
      <div style={{ display: 'none' }}>
        <ReactToPrint
          trigger={() => (
            <Button
              id="printResult"
              type="primary"
              style={{ marginLeft: 8 }}
              // loading={submitting}
            >
              {intl.formatMessage({ id: 'app.receipt.list.col14' })}
            </Button>
          )}
          content={() => componentRef.current}
        />
        <div ref={componentRef}>
          <PrintResults
            isMobile={isMobile}
            title={intl.formatMessage({
              id: 'app.clinicReceipt.list.title1',
            })}
            dataPrint={dataForm}
          />
        </div>
      </div>
      <MedicalRegisterModal
        isMobile={isMobile}
        intl={intl}
        visible={visibleRegister}
        dataCustomer={data}
      />
      <ClinicReceiptModal
        isMobile={isMobile}
        intl={intl}
        visible={visibleReceipt}
        dataCustomer={data?.customer}
      />
      <ClinicPrescriptionModal
        isMobile={isMobile}
        intl={intl}
        titleModal={intl.formatMessage({
          id: 'app.clinicPrescription.list.header',
        })}
        getList={getList}
        visible={visiblePrescription}
        dataCustomer={data}
        dataEdit={data?.clinicPrescription}
      />
    </Fragment>
  );
};

export default ClinicResultModal;
