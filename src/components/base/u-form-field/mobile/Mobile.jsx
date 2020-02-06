import React, { Component } from 'react';
import { Input, Select } from 'antd';

export default class Mobile extends Component {
    onChange = (val, type) => {
        let { onChange, value = {} } = this.props;
        value[type] = val;
        onChange && onChange(value);
    };

    render() {
        const { placeholder = '请填写手机号码', maxLength = 100, value = {}, ...rest } = this.props;
        const MobileType = (
            <Select onChange={value => this.onChange(value, 'mobileType')} value={value.mobileType} style={{ width: 100 }}>
                <Select.Option value={0}>大陆地区</Select.Option>
                <Select.Option value={1}>其它地区</Select.Option>
            </Select>
        );

        return (
            <Input
                addonBefore={MobileType}
                placeholder={placeholder}
                maxLength={maxLength}
                {...rest}
                value={value.mobile}
                onChange={e => this.onChange((e.target.value || '').trim(), 'mobile')}
            />
        );
    }
}
