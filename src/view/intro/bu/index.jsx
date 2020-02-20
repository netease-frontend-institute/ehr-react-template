import React from 'react';
import { Link } from 'react-router-dom';
import Routes, { getSubList } from '@/router/tools';
import { Button } from 'antd';
import './index.less';

function InroCompany(props) {
    const LinkMap = getSubList(props);

    return (
        <div className="m-bu">
            请选择要了解的业务：
            <div className="link-wrapper">
                {LinkMap.map(item => (
                    <Link key={item.link} to={item.link}>
                        <Button>{item.title}</Button>
                    </Link>
                ))}
            </div>
            <Routes {...props} />
        </div>
    );
}

export default InroCompany;
