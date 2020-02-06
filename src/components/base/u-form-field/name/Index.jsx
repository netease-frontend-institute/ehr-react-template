/**
 * 姓名表单组件  施阳  2019-08-28
 * @param {number} id 唯一标识 必传
 * @param {obj} form 父组件的form对象 必传
 *
 * @param {bool} required 是否是必填项 默认为false
 * @param {obj} formItemOption antd 中 FormItem 所支持的所有属性
 * @param {obj} decoratorOption antd 中 getFieldDecorator(id, option) 中option所支持的所有属性
 */
import React, { Component } from 'react';
import { Form } from 'antd';
import Name from './Name';

const FormItem = Form.Item;
export default class Index extends Component {
    // 自定义校验规则
    validator = (rule, value, callback) => {
        const { required } = this.props;

        !value && required && callback('请填写姓名');

        callback();
    };

    render() {
        const { id, form, required, formItemOption = {}, decoratorOption = {}, ...rest } = this.props;
        const { getFieldDecorator } = form;

        return (
            <FormItem label="姓名" required={required} {...formItemOption}>
                {getFieldDecorator(id, {
                    rules: [{ validator: this.validator }],
                    trigger: 'onBlur',
                    validateTrigger: ['onChange', 'onSubmit'],
                    ...decoratorOption
                })(<Name {...rest} />)}
            </FormItem>
        );
    }
}
