import React from 'react';
import { Link } from 'react-router-dom';
import Routes, { getSubList } from '@/router/tools';
import { Button } from 'antd';
import './index.less';

function InroCompany(props) {
    const LinkMap = getSubList(props);

    return (
        <div className="m-company">
            公司介绍页
            <ul className="link-wrapper">
                {LinkMap.map(item => (
                    <Link key={item.link} to={item.link}>
                        <Button>{item.title}</Button>
                    </Link>
                ))}
            </ul>
            <Routes {...props} />
        </div>
    );
}

export default InroCompany;
