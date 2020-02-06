/*
 *author 施阳  2018/10/30
 *api:
 *1：maxCount: 最大显示个数，超出toast提示；
 *2：exactSearch：精确查询方法名；
 *3：slurSearch：模糊查询方法名；
 *4：params： 查询时的额外参数，例如字典数据查询时需要传code;
 *5：funcName: 下拉列表查询的方法名;
 *6: fieldNames: 下拉选项参数别名 {id: 'aId', name: 'aName'};
 *7: extra: 额外项，针对下拉选项中“请选择”、“不限”这种无实际意义的下拉选项；
 *8: exactCode: 精确查询入参，默认ids
 *9: slurCode: 模糊查询入参，默认name
 *10：支持antd中select组件的所有api；
 */

/*
 *1、普通用法： // 在组件内部请求
 *<Select funcName="getOptionsById" params={{ code: 'talentView' }} fieldNames={{id: 'id', name: 'name'}} /> 或者
 *
 *<Select>  // 在外部请求
 *	{majorTypeList.map(item => <Select.Option value={item.id + ''} key={item.id}>{item.name}</Select.Option>)}
 *</Select>
 */

/*
 *2、精确、模糊查询示例：
 *<Select maxCount="1" exactSearch="getUsersById" slurSearch="getUsersByName" params={{code: 'signCompany'}} />
 */

import React from 'react';
import { Select, message, Spin } from 'antd';
import { includeEn, empty, emptyAll } from '@/utils/tools';
import { debounce, isArray, isEqual } from 'lodash';
import * as http from '@/axios/api/index';

export default class SelfSelect extends Select {
    constructor(props) {
        super(props);
        this.onSearch = debounce(this.onSearch, 200); // 搜索节流阀
        this.newProps = {}; // 自定义属性
        props.maxCount && (this.newProps.mode = 'multiple'); // 当多选时，默认select模式为'multiple'
        this.state = {
            value: props.defaultValue || props.value,
            params: props.params, // 请求参数
            funcName: props.funcName, // 请求方法名
            list: props.list || [],
            fetching: false,
            hasReq: false // 是否
        };
    }

    componentWillMount() {
        const { funcName } = this.props;
        const { value } = this.state;
        funcName && this.queryList();
        value && this.onExactSearch(value);
    }

    componentWillReceiveProps(nextProps) {
        if (!isEqual(this.state.value, nextProps.value)) {
            this.setState({ value: nextProps.value });
            this.onExactSearch(nextProps.value);
        }

        if (!isEqual(this.state.params, nextProps.params)) {
            this.setState({ params: nextProps.params }, this.queryList);
        }

        if (!isEqual(this.state.funcName, nextProps.funcName)) {
            this.setState({ funcName: nextProps.funcName }, this.queryList);
        }

        if (nextProps.list && !isEqual(this.state.list, nextProps.list)) {
            this.setState({ list: nextProps.list });
        }
    }

    // 请求下拉列表
    queryList = () => {
        const { funcName, params } = this.props;
        funcName && http[funcName]({ ...params }).then(data => this.setState({ list: data || [], hasReq: true }));
    };

    // 精确查询
    onExactSearch = ids => {
        let { exactSearch, params, exactCode = 'idCode' } = this.props,
            id = isArray(ids) ? ids.join(',') : ids;
        if (!exactSearch || !id) return;
        this.setState({ fetching: true });
        http[exactSearch] &&
            http[exactSearch]({ [exactCode]: id, ...params }).then(data => {
                let res = Array.isArray(data || []) ? data : [data];
                this.setState({ list: res || [], fetching: false, hasReq: true });
            });
    };

    // 模糊查询
    onSlurSearch = name => {
        const { slurSearch, params, slurCode = 'name' } = this.props;
        if (!slurSearch) return;
        this.setState({ fetching: true });
        http[slurSearch] &&
            http[slurSearch]({ [slurCode]: name, ...params }).then(data =>
                this.setState({ list: this.uniqueArray((data || []).concat(this.state.list)), fetching: false, hasReq: true })
            );
    };

    // 数组对象去重
    uniqueArray = list => {
        let result = {},
            { fieldNames = {} } = this.props;
        list.map(item => (result[item[fieldNames.id || 'id']] = item));
        return Object.values(result);
    };

    onSearch = value => {
        const { onSearch } = this.props;
        value = includeEn(value) ? empty(value) : emptyAll(value);
        if (!value) return;
        this.onSlurSearch(value);

        onSearch && onSearch(value);
    };

    onChange = (value, option) => {
        const { maxCount, onChange, fieldNames = {} } = this.props;
        // 校验最大长度
        if (maxCount && (value || []).length > maxCount - 0) {
            message.warning(`最多选择${maxCount}个`, 2);
            value = value.slice(0, maxCount - 0);
        }

        let item = this.state.list.filter(item => item[fieldNames.id || 'id'] === value)[0]; // 当前选中项
        this.setState({ value }, () => {
            this.onExactSearch(value);
            onChange && onChange(value, option, item);
        });
    };

    render() {
        const { extra, children, maxCount, fieldNames = {}, ...rest } = this.props;
        const { list = [], value, fetching, hasReq } = this.state;
        return (
            <Select
                value={value}
                placeholder="点击选择"
                notFoundContent={fetching ? <Spin size="small" /> : hasReq ? '暂无数据' : null}
                filterOption={(input, option) =>
                    option.props.children
                        .toLowerCase()
                        .includes(includeEn(input.toLowerCase()) ? empty(input.toLowerCase()) : emptyAll(input.toLowerCase()))
                }
                getPopupContainer={triggerNode => triggerNode.parentNode}
                optionLabelProp="children"
                {...this.newProps}
                {...rest}
                onSearch={this.onSearch}
                onChange={this.onChange}
            >
                {extra && (
                    <Select.Option value="" key={extra}>
                        {extra}
                    </Select.Option>
                )}
                {children
                    ? children
                    : list.map(item => (
                          <Select.Option
                              key={item[fieldNames.id || 'id']}
                              value={item[fieldNames.id || 'id']}
                              title={item[fieldNames.name || 'name']}
                              label={item[fieldNames.name || 'name']}
                          >
                              {item[fieldNames.name || 'name']}
                          </Select.Option>
                      ))}
            </Select>
        );
    }
}
