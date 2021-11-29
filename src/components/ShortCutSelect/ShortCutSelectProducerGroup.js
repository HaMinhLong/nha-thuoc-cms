/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
  Select,
  Tooltip,
  Input,
  Button,
  Spin,
  Modal,
  Form,
  notification,
} from 'antd';
import { useDispatch } from 'react-redux';
import regexHelper from '../../utils/regexHelper';
import '@ant-design/compatible/assets/index.css';
import { fnKhongDau } from '../../utils/utils';
import _ from 'lodash';

let timer = null;
const { isGroupName } = regexHelper;

const FormItem = Form.Item;
const ShortCutSelectSupplierGroup = ({
  intl,
  isMobile,
  placeholder,
  value,
  textProps,
  filter,
  key,
  disabled,
  allowClear,
  size,
  style,
  onChange,
  getAll,
}) => {
  const dispatch = useDispatch();
  const [valueState, setValueState] = useState(value);
  const [dataArr, setDataArr] = useState([]);
  const [icon, setIcon] = useState(null);
  const [numOfScroll, setNumOfScroll] = useState(2);
  const [searchValue, setSearchValue] = useState('');
  const [checkState, setCheckState] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [dataStore, setDataStore] = useState([]);
  const [text, setText] = useState(textProps || '');
  const healthFacilityId = localStorage.getItem('healthFacilityId');
  const [visibleAddProducerGroup, setVisibleAddProducerGroup] = useState(false);
  const [producerGroupName, setProducerGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetch(1, undefined, valueState, false, false, false);
  }, []);
  const handleSubmit = () => {
    setLoading(true);
    const addItem = {
      producerGroupName: (producerGroupName && producerGroupName.trim()) || '',
      status: 1,
      healthFacilityId: healthFacilityId,
    };
    dispatch({
      type: 'producerGroup/add',
      payload: addItem,
      callback: (res) => {
        setLoading(true);
        if (res?.success) {
          openNotification(
            'success',
            intl.formatMessage(
              { id: 'app.common.create.success' },
              {
                name: intl.formatMessage({
                  id: 'app.producerGroup.list.title',
                }),
              }
            ),
            '#f6ffed'
          );
          setVisibleAddProducerGroup(false);
          fetch(1, undefined, valueState, false, false, false);
        } else {
          openNotification('error', res?.message, '#fff1f0');
        }
        setLoading(false);
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

  const onFocus = () => {
    setIcon(<i className="fa fa-search" />);
  };
  const onBlur = () => {
    setIcon(null);
  };
  const onChangeFun = (valueState) => {
    if (valueState) {
      setValueState(valueState);
      setText(
        dataArr.find((x) => x.valueState === valueState) &&
          dataArr.find((x) => x.valueState === valueState).text
      );
    } else {
      setValueState(valueState);
      setText(
        dataArr.find((x) => x.valueState === valueState) &&
          dataArr.find((x) => x.valueState === valueState).text
      );
      fetch(1, undefined, valueState, false, false, true);
    }
    if (onChange)
      onChange(
        valueState,
        dataArr.find((x) => x.valueState === valueState) &&
          dataArr.find((x) => x.valueState === valueState).text
      );
  };
  const fetch = (
    current,
    flag,
    valueState,
    ChangeFilter,
    checkAddItem,
    checkDataAll
  ) => {
    const pagesize = 20;
    const healthFacilityId = localStorage.getItem('healthFacilityId');
    const tfilter = {
      producerGroupName: searchValue,
      healthFacilityId: healthFacilityId,
      status: 1,
    };
    if (getAll) {
      delete tfilter.status;
    }
    if (!searchValue || (searchValue && !searchValue.trim())) {
      delete tfilter.producerGroupName;
    }
    const params = {
      filter: JSON.stringify(tfilter),
      range: JSON.stringify([pagesize * (current - 1), current * pagesize]),
      sort: JSON.stringify(['producerGroupName', 'ASC']),
      attributes: 'id,producerGroupName',
    };
    dispatch({
      type: 'producerGroup/fetchLazyLoading',
      payload: params,
      select: current !== 1,
      callback: (result) => {
        if (result && result.success === true) {
          const data =
            result &&
            result.results &&
            result.results.list.map((data) => ({
              valueState: data.id,
              text: data.producerGroupName,
            }));
          setTotalItems(
            result &&
              result.results.pagination &&
              result.results.pagination.total
          );
          if (dataArr.length === 0 || flag) {
            if (checkAddItem) {
              if (searchValue) {
                setDataArr([..._.uniqBy([...dataArr, ...data], 'valueState')]);
                setDataStore([
                  ..._.uniqBy([...dataStore, ...data], 'valueState'),
                ]);
              } else {
                setDataArr([..._.uniqBy([...dataArr, ...data], 'valueState')]);
                setDataStore([
                  ..._.uniqBy([...dataStore, ...data], 'valueState'),
                ]);
                addItem(valueState);
              }
            } else {
              setDataArr([..._.uniqBy([...dataArr, ...data], 'valueState')]);
              setDataStore([
                ..._.uniqBy([...dataStore, ...data], 'valueState'),
              ]);
              addItem(valueState);
            }
          } else if (checkDataAll) {
            setDataArr([..._.uniqBy([...dataStore, ...data], 'valueState')]);
            setDataStore([..._.uniqBy([...dataStore, ...data], 'valueState')]);
            setCheckState(true);
            setNumOfScroll(2);
          } else {
            setDataArr([..._.uniqBy([...dataArr, ...data], 'valueState')]);
            setDataStore([..._.uniqBy([...dataStore, ...data], 'valueState')]);
            setCheckState(true);
          }
        }
      },
    });
  };

  const handleScroll = (e) => {
    e.preventDefault();
    const pagination = totalItems;

    const isEndOfList = e.target.scrollTop + e.target.clientHeight;

    if (
      checkState &&
      isEndOfList >= (4 * e.target.scrollHeight) / 5 &&
      20 * (numOfScroll - 1) < pagination
    ) {
      setNumOfScroll(numOfScroll + 1);
      setCheckState(false);
      fetch(numOfScroll, undefined, valueState, false, false, false);
    }
  };

  const addItem = (valueState) => {
    if (
      valueState !== undefined &&
      text !== undefined &&
      valueState !== '' &&
      text !== '' &&
      dataArr.findIndex((o) => o.valueState === valueState) < 0
    ) {
      setDataArr([{ text: `${text}`, valueState }, ...dataArr]);
      setDataStore([{ text: `${text}`, valueState }, ...dataStore]);
    }
  };

  const search = (string) => {
    const dataTemp = dataStore.filter(
      (item) => fnKhongDau(item.text).indexOf(fnKhongDau(string)) !== -1
    );
    if (string) {
      setDataArr(dataTemp);
      setSearchValue(string);
      setNumOfScroll(2);
    } else {
      setDataArr(dataStore);
      setSearchValue('');
      setNumOfScroll(2);
    }
    clearTimeout(timer);
    timer = setTimeout(
      fetch.bind(this, 1, string, valueState, false, true, false),
      500
    );
  };
  const handleMouseLeave = () => {
    if (searchValue && searchValue !== '' && filter) {
      setSearchValue('');
    }
  };
  const renderData = (data) =>
    (data || []).map((item) => (
      <Select.Option value={item.valueState} key={item.valueState}>
        {item.text.trim()}
      </Select.Option>
    ));
  const dataRender = renderData(dataArr);

  return (
    <React.Fragment>
      <div style={{ display: 'inline-flex', width: '100%' }}>
        <Select
          key={key}
          onFocus={onFocus}
          onBlur={onBlur}
          suffixIcon={icon}
          showArrow
          showSearch
          defaultValue={valueState || undefined}
          notFoundContent={loading ? <Spin size="small" /> : null}
          onChange={onChangeFun}
          onSearch={search}
          filterOption={false}
          disabled={disabled}
          placeholder={placeholder}
          size={size}
          allowClear={allowClear}
          loading={loading}
          onPopupScroll={handleScroll}
          onDropdownVisibleChange={handleMouseLeave}
          style={style}
        >
          {dataRender}
        </Select>
        <Tooltip
          title={
            !isMobile &&
            intl.formatMessage({ id: 'app.producerGroup.quickCreate.header' })
          }
        >
          <Button
            style={{
              color: '#495057',
              borderRadius: 'unset !important',
              border: '1px solid #d9d9d9',
            }}
            type="ghost"
            icon={<PlusOutlined />}
            onClick={() => setVisibleAddProducerGroup(!visibleAddProducerGroup)}
          />
        </Tooltip>
      </div>
      <Spin spinning={loading}>
        <Modal
          destroyOnClose
          title={intl.formatMessage({
            id: 'app.producerGroup.quickCreate.header',
          })}
          visible={visibleAddProducerGroup}
          onOk={handleSubmit}
          width={isMobile ? '100%' : '520px'}
          onCancel={() => setVisibleAddProducerGroup(false)}
          cancelText={
            <React.Fragment>
              <i className="fas fa-sync" /> &nbsp;
              {intl.formatMessage({ id: 'app.common.deleteBtn.cancelText' })}
            </React.Fragment>
          }
          okText={
            <React.Fragment>
              <i className="fa fa-save" /> &nbsp;
              {intl.formatMessage({ id: 'app.common.crudBtns.4' })}
            </React.Fragment>
          }
        >
          <FormItem
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            labelAlign="left"
            label={
              <span>
                {intl.formatMessage({ id: 'app.producerGroup.list.col0' })}
              </span>
            }
            rules={[
              {
                required: true,
                message: intl.formatMessage({
                  id: 'app.common.crud.validate.input',
                }),
              },
              {
                pattern: isGroupName,
                message: intl.formatMessage({
                  id: 'app.common.crud.validate.fomatNew',
                }),
              },
            ]}
          >
            <Input
              placeholder={intl.formatMessage({
                id: 'app.producerGroup.list.name',
              })}
              onChange={(e) => setProducerGroupName(e.target.value)}
            />
          </FormItem>
        </Modal>
      </Spin>
    </React.Fragment>
  );
};

export default ShortCutSelectSupplierGroup;
