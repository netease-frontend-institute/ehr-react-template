/**
 * 时间表单组件  施阳  2019-09-30
 * @param {number} id 唯一标识 必传
 * @param {obj} form 父组件的form对象 必传
 *
 * @param {bool} required 是否是必填项 默认为false
 * @param {obj} formItemOption antd 中 FormItem 所支持的所有属性
 * @param {obj} decoratorOption antd 中 getFieldDecorator(id, option) 中option所支持的所有属性
 */
import React, { Component } from 'react';
import { Form } from 'antd';
import RangePicker from './RangePicker';

const FormItem = Form.Item;
export default class Index extends Component {
    // 自定义校验规则
    validator = (rule, value = {}, callback) => {
        const { required } = this.props;

        required && !value.startDate && !value.endDate && callback('请选择时间');

        (!value.startDate || !value.endDate) && callback('请完善时间');

        value.startDate && value.endDate && !value.startDate.isBefore(value.endDate) && callback('开始时间要小于等于结束时间');

        callback();
    };

    render() {
        const { id, form, required, formItemOption = {}, decoratorOption = {}, ...rest } = this.props;
        const { getFieldDecorator } = form;

        return (
            <FormItem label="时间" required={required} {...formItemOption}>
                {getFieldDecorator(id, {
                    rules: [{ validator: this.validator }],
                    validateTrigger: ['onChange', 'onSubmit'],
                    ...decoratorOption
                })(<RangePicker {...rest} />)}
            </FormItem>
        );
    }
}
