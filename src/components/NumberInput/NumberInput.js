import React, { useState, useEffect } from 'react';
import { InputNumber } from 'antd';

const NumberInput = ({
  value,
  onChange,
  onBlur,
  placeholder,
  key,
  disabled,
  min,
  style,
  precision,
  onPressEnter,
  className,
}) => {
  const [valueState, setValueState] = useState(value || '');
  useEffect(() => {
    setValueState(value);
  }, [value]);

  const onChangeFunc = (value) => {
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if (
      (!Number.isNaN(value) && reg.test(value)) ||
      value === '' ||
      value === '-'
    ) {
      onChange(value);
      setValueState(value);
    }
  };
  const onBlurFunc = () => {
    if (
      (value && value.toString().charAt(value.length - 1) === '.') ||
      value === '-'
    ) {
      onChange(value.slice(0, -1));
      setValueState(value.slice(0, -1));
    }
    if (onBlur) {
      onBlur();
    }
  };
  return (
    <React.Fragment>
      <InputNumber
        className={className}
        key={key}
        min={min || 0}
        precision={precision || 0}
        value={valueState}
        disabled={disabled}
        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        onChange={onChangeFunc}
        onBlur={onBlurFunc}
        placeholder={placeholder}
        style={
          style
            ? {
                ...style,
                color: Number(value || 0) < 0 ? 'red' : 'rgba(0, 0, 0, 0.9)',
              }
            : { width: '100%' }
        }
        maxLength={25}
        onPressEnter={onPressEnter}
      />
    </React.Fragment>
  );
};

export default NumberInput;
