import React, { useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Select, Spin } from 'antd';
import _ from 'lodash';

const UnitSelectV2 = ({
  value,
  textProps,
  dataArr,
  filter,
  key,
  placeholder,
  disabled,
  allowClear,
  size,
  style,
  onChange,
  getAll,
  className,
}) => {
  const [valueState, setValueState] = useState(value);
  const [loading, setLoading] = useState(false);
  const [icon, setIcon] = useState(null);
  const [text, setText] = useState(textProps || '');

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

  const renderData = (data) =>
    (data || []).map((item) => (
      <Select.Option value={item?.unitId} key={item?.unitId}>
        {item?.unitName}
      </Select.Option>
    ));

  const dataRender = renderData(dataArr);

  return (
    <React.Fragment>
      <Select
        className={className}
        key={key}
        suffixIcon={icon}
        showArrow
        showSearch
        defaultValue={valueState || undefined}
        notFoundContent={loading ? <Spin size="small" /> : null}
        onChange={onChangeFun}
        filterOption={false}
        disabled={disabled}
        placeholder={placeholder}
        size={size}
        allowClear={allowClear}
        loading={loading}
        style={style}
      >
        {dataRender}
      </Select>
    </React.Fragment>
  );
};

export default UnitSelectV2;
