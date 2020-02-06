import React, { Component } from 'react';
import { Input } from 'antd';
import { emptyAll } from '@/utils/tools';

class Email extends Component {
    onBlur = e => {
        const { onBlur } = this.props;
        e.target.value = emptyAll(e.target.value);
        onBlur && onBlur(e);
    };

    render() {
        const { placeholder = '请填写邮箱', maxLength = 100, form, ...rest } = this.props;
        return <Input placeholder={placeholder} maxLength={maxLength} {...rest} onBlur={this.onBlur} />;
    }
}

export default Email;
