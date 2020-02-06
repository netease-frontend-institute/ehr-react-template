import React, { Component } from 'react';
import { Input } from 'antd';

class Name extends Component {
    onBlur = e => {
        const { onBlur } = this.props;
        e.target.value = (e.target.value || '').trim();
        onBlur && onBlur(e);
    };

    render() {
        const { placeholder = '请填写姓名', maxLength = 100, form, ...rest } = this.props;
        return <Input placeholder={placeholder} maxLength={maxLength} {...rest} onBlur={this.onBlur} />;
    }
}

export default Name;
