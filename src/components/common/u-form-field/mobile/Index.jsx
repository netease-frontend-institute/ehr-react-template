/**
 * 手机号码表单组件  施阳  2019-08-28
 * @param {number} id 唯一标识 必传
 * @param {obj} form 父组件的form对象 必传
 *
 * @param {bool} required 是否是必填项 默认为false
 * @param {obj} formItemOption antd 中 FormItem 所支持的所有属性
 * @param {obj} decoratorOption antd 中 getFieldDecorator(id, option) 中option所支持的所有属性
 *
 * @return {obj}
 * {
 *    mobileType: 1, // 0-大陆地区 1-其他地区
 *    mobile: 12345678901
 * }
 */
import React, { Component } from 'react';
import { Form } from 'antd';
import Mobile from './Mobile';
import { isMobile } from '@/utils/tools';

const FormItem = Form.Item;

class Item extends Component {
    // 自定义校验规则
    validator = (rule, value = {}, callback) => {
        const { required } = this.props;

        if (required) {
            // 必填项校验
            !value.mobile && callback('请填写手机号');

            [undefined, null].includes(value.mobileType) && callback('请选择类型');
        }

        value.mobile && !isMobile(value.mobile) && value.mobileType === 0 && callback('格式错误');

        callback();
    };

    render() {
        const { id, form, required, formItemOption = {}, decoratorOption = {}, ...rest } = this.props;
        const { getFieldDecorator } = form;

        return (
            <FormItem label="手机号码" required={required} {...formItemOption}>
                {getFieldDecorator(id, {
                    rules: [{ validator: this.validator }],
                    validateTrigger: ['onChange', 'onSubmit'],
                    initialValue: {
                        mobileType: 0
                    },
                    ...decoratorOption
                })(<Mobile {...rest} />)}
            </FormItem>
        );
    }
}

export default Item;
