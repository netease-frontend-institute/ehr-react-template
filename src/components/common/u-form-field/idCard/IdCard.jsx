import React, { Component } from 'react';
import { Input, Select } from 'antd';

export default class IdCard extends Component {
    onChange = (val, type) => {
        let { onChange, value = {} } = this.props;
        value[type] = val;
        onChange && onChange(value);
    };

    render() {
        const { placeholder = '请填写证件信息', value = {}, ...rest } = this.props;
        const IdType = (
            <Select onChange={value => this.onChange(value, 'idType')} value={value.idType} style={{ width: 100 }}>
                <Select.Option value={0}>身份证</Select.Option>
                <Select.Option value={1}>其他</Select.Option>
            </Select>
        );

        return (
            <Input
                addonBefore={IdType}
                placeholder={placeholder}
                {...rest}
                value={value.idNumber}
                onChange={e => this.onChange((e.target.value || '').trim(), 'idNumber')}
            />
        );
    }
}
