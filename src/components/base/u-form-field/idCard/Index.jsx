/**
 * 身份证表单组件  施阳  2019-08-28
 * @param {number} id 唯一标识 必传
 * @param {obj} form 父组件的form对象 必传
 *
 * @param {bool} required 是否是必填项 默认为false
 * @param {obj} formItemOption antd 中 FormItem 所支持的所有属性
 * @param {obj} decoratorOption antd 中 getFieldDecorator(id, option) 中option所支持的所有属性
 *
 * @return {obj}
 * {
 *    idType: 1, // 0-身份证 1-其他
 *    idNumber: 12345678901
 * }
 */
import React, { Component } from 'react';
import { Form } from 'antd';
import IdCard from './IdCard';
import { isIdCard } from '@/utils/tools';

const FormItem = Form.Item;
export default class Item extends Component {
    // 自定义校验规则
    validator = (rule, value = {}, callback) => {
        const { required } = this.props;

        if (required) {
            // 必填项校验
            if (!value.idNumber) {
                callback('请填写证件信息');
                return;
            }
            !value.idNumber && callback('请填写证件信息');

            [undefined, null].includes(value.idType) && callback('请选择类型');
        }

        value.idNumber && !isIdCard(value.idNumber) && value.idType === 0 && callback('格式错误');

        callback();
    };

    render() {
        const { id, form, required, formItemOption = {}, decoratorOption = {}, ...rest } = this.props;
        const { getFieldDecorator } = form;

        return (
            <FormItem label="证件信息" required={required} {...formItemOption}>
                {getFieldDecorator(id, {
                    rules: [{ validator: this.validator }],
                    validateTrigger: ['onChange', 'onSubmit'],
                    initialValue: {
                        idType: 0
                    },
                    ...decoratorOption
                })(<IdCard {...rest} />)}
            </FormItem>
        );
    }
}
