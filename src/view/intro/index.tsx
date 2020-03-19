import React from 'react';
import { Link } from 'react-router-dom';
import Routes, { getRouteInfo } from '@/router/tools';
import { Button } from 'antd';
import './index.less';

function IntroIndex(props: any) {
    const { targetParent } = getRouteInfo(props);

    return (
        <div className="m-intro-index">
            请选择介绍类型：
            <div className="link-wrapper">
                {(targetParent.sub || []).map((item: any) => {
                    return (
                        <Link key={item.link} to={item.link}>
                            <Button>{item.title}</Button>
                        </Link>
                    );
                })}
            </div>
            <Routes {...props} />
        </div>
    );
}

export default IntroIndex;
