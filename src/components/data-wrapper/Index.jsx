import React from 'react';
import UIcon from '@/components/common/u-icon';
import './index.less';

function DataWrapper(props) {
    const { children, className, visibleIcon = true, iconType = 'zanwujilu', visibleEmpty, emptyText = '暂无数据' } = props;

    return (
        <span className={`${className} u-data-wrapper`}>
            {!visibleEmpty ? children : <NoData emptyText={emptyText} visibleIcon={visibleIcon} iconType={iconType} />}
        </span>
    );
}

function NoData(props) {
    const { visibleIcon, iconType, emptyText } = props;

    return (
        <div className="u-no-data">
            {visibleIcon && <UIcon type={iconType} />}
            <p>{emptyText}</p>
        </div>
    );
}

export default DataWrapper;
