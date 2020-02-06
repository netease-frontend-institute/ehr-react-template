import { Table } from 'antd';

import React, { Component } from 'react';

import CustomPagination from './CustomPagination.jsx';

export default class BasicTable extends Component {
    state = {
        local: {
            emptyText: '暂无数据'
        }
    };
    /**
     *
     * @changeTable
     * @param p pagination
     * @param f filters
     * @param s sorter
     * @memberof BasicTable
     */
    opChageTable = (p, f, s) => {
        const { changeTable } = this.props; // 上级目录中传入需要执行的函数
        p.current = p.current < 1 ? 1 : p.current;
        changeTable(p, f, s);
    };

    render() {
        // 使用案例
        // 参数说明 expandIconColumnIndex,展开按钮的索引
        // 常用属性 rowSelection,根据需要自行加入。
        //const { dataSource, loading=true, columns, expandIconColumnIndex=-1, rowSelection={} } = this.props;
        const {
            rowKey = 'id',
            expandIconColumnIndex = -1,
            pagination = {
                total: 0
            }
        } = this.props;
        return (
            <div className="m-basic-table">
                <Table {...this.props} local={this.state.local} pagination={false} rowKey={rowKey} expandIconColumnIndex={expandIconColumnIndex} />
                {this.props.pagination.total > 0 && <CustomPagination {...pagination} change={this.opChageTable} />}
            </div>
        );
    }
}
