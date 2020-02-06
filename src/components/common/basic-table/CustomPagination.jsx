import { Pagination, Input } from 'antd';

import React, { Component } from 'react';

export default class CustomPagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 1,
            pageSize: 10
        };
    }
    // 初始化状态

    onChange = (current, pageSize) => {
        this.setState({
            current: current,
            pageSize: pageSize
        });
        this.props.change({ pageSize: pageSize, current: current });
    };

    enter = e => {
        const { change } = this.props;
        if (e.key === 'Enter') {
            const current = parseInt(e.target.value, 10);
            let maxPage = Math.ceil(this.props.total / this.state.pageSize);
            if (isNaN(current)) {
                return;
            }
            this.setState(
                {
                    current: current > maxPage ? maxPage : current < 1 ? 1 : current
                },
                () => change({ pageSize: this.state.pageSize, current: this.state.current })
            );
        }
    };

    blur = e => {
        const { change } = this.props;
        const current = parseInt(e.target.value, 10);
        let maxPage = Math.ceil(this.props.total / this.state.pageSize);
        if (isNaN(current)) {
            return;
        }
        // 校验一下是否与上一次输入一样
        if (this.state.current === current) {
            return;
        }
        this.setState(
            {
                current: current > maxPage ? maxPage : current < 1 ? 1 : current
            },
            () => change({ pageSize: this.state.pageSize, current: this.state.current })
        );
    };
    render() {
        return (
            <div className="m-pagination" style={{ margin: '28px', textAlign: 'center' }}>
                <Pagination
                    current={this.state.current}
                    pageSize={this.state.pageSize}
                    onChange={this.onChange}
                    onShowSizeChange={this.onChange}
                    // showSizeChanger
                    total={this.props.total}
                    style={{ display: 'inline-block', verticalAlign: 'top', marginRight: 8 }}
                />
                跳转到：第 <Input style={{ width: 60 }} placeholder="" onKeyDown={this.enter} onBlur={this.blur} /> 页
            </div>
        );
    }
}
