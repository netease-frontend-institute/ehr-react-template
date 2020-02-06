/**
 * @param {bool} showToday 结束时间是否展示”至今“；区别于组件本身的api属性，为了业务本身
 * @param {array} placeholder 注意是数组形式
 * @return {obj} 返回体包含以下三个参数
 * startDate: 开始时间
 * endDate: 结束时间
 * isHitherto: 是否选择至今
 */
import React, { Component } from 'react';
import { DatePicker, Row, Col } from 'antd';
import moment from 'moment';

class RangePicker extends Component {
    state = {
        open: false // 是否展示日期面板
    };

    // 选择至今
    selectToday = () => {
        let { onChange, value = {} } = this.props;
        value.endDate = moment();
        value.isHitherto = true;
        this.setState({ open: false });
        onChange && onChange(value);
    };

    onChange = (val, type) => {
        let { onChange, value = {} } = this.props;
        value[type] = val;
        value.isHitherto = false;
        onChange && onChange(value);
    };

    render() {
        const { open } = this.state;
        const { placeholder = ['开始时间', '结束时间'], showToday, form, value = {}, ...rest } = this.props;
        return (
            <Row>
                <Col span={11}>
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder={placeholder[0]}
                        allowClear={false}
                        {...rest}
                        showToday={false}
                        value={value.startDate}
                        onChange={data => this.onChange(data, 'startDate')}
                    />
                </Col>
                <Col span={2}>
                    <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>至</span>
                </Col>
                <Col span={11}>
                    <DatePicker
                        style={{ width: '100%' }}
                        placeholder={placeholder[1]}
                        allowClear={false}
                        open={open}
                        onOpenChange={open => this.setState({ open })}
                        renderExtraFooter={() =>
                            showToday && (
                                <div className="f-tac" onClick={this.selectToday}>
                                    <span className={value.isHitherto ? 'f-cp f-danger' : 'f-cp'}>至今</span>
                                </div>
                            )
                        }
                        {...rest}
                        showToday={false}
                        value={value.endDate}
                        onChange={data => this.onChange(data, 'endDate')}
                    />
                </Col>
            </Row>
        );
    }
}

export default RangePicker;
