import React, { useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Select } from 'antd';
import NumberInput from './NumberInput';

const { Option } = Select;

const Discount = (props) => {
  const {
    onChange,
    size,
    placeholder,
    onBlur,
    smallWidth,
    className1,
    className2,
    style1,
  } = props;
  const [number, setNumber] = useState(props?.value?.number || 0);
  const [currency, setCurrency] = useState(props?.value?.currency || 1);

  const handleNumberChange = (value) => {
    // const number = parseInt(value || 0, 10);
    // console.log(value)
    if (isNaN(value)) {
      return;
    }

    setNumber(value);

    triggerChange({ number: value });
  };

  const handleCurrencyChange = (currency) => {
    setCurrency(currency);

    triggerChange({ currency });
  };

  const triggerChange = (changedValue) => {
    // Should provide an event to pass value to Form.
    if (onChange) {
      onChange({
        number,
        currency,
        ...changedValue,
      });
    }
  };
  return (
    <span>
      <NumberInput
        className={className1}
        type="text"
        size={size}
        min={0}
        max={currency === '1' ? 100 : Infinity}
        precision={currency === '1' ? 2 : 0}
        value={number}
        onBlur={onBlur}
        onChange={handleNumberChange}
        placeholder={placeholder}
        style={{
          ...style1,
          width: smallWidth ? '59%' : '67%',
          marginRight: smallWidth ? '2%' : '3%',
        }}
      />
      <Select
        value={currency}
        className={className2}
        size={size}
        onBlur={onBlur}
        style={{ width: smallWidth ? '39%' : '30%' }}
        onChange={handleCurrencyChange}
      >
        <Option value={1}>VNĐ</Option>
        <Option value={2}>%</Option>
      </Select>
    </span>
  );
};

export default Discount;
