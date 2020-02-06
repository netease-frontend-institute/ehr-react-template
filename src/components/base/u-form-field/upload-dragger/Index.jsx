/**
 * 大附件上传表单组件  施阳  2019-10-8
 * @param {number} id 唯一标识 必传
 * @param {obj} form 父组件的form对象 必传
 *
 * @param {bool} required 是否是必填项 默认为false
 * @param {obj} formItemOption antd 中 FormItem 所支持的所有属性
 * @param {obj} decoratorOption antd 中 getFieldDecorator(id, option) 中option所支持的所有属性
 */
import React, { Component } from 'react';
import { Form } from 'antd';
import UploadDragger from './UploadDragger';

const FormItem = Form.Item;

class Item extends Component {
    // 自定义校验规则
    validator = (rule, value, callback) => {
        const { required } = this.props;

        !(value || []).length && required && callback('请上传附件');

        callback();
    };

    render() {
        const { id, form, required, formItemOption = {}, decoratorOption = {}, ...rest } = this.props;
        const { getFieldDecorator } = form;

        return (
            <FormItem label="附件上传" required={required} {...formItemOption}>
                {getFieldDecorator(id, {
                    valuePropName: 'fileList',
                    rules: [{ validator: this.validator }],
                    validateTrigger: ['onChange', 'onSubmit'],
                    ...decoratorOption
                })(<UploadDragger {...rest} />)}
            </FormItem>
        );
    }
}

export default Item;
