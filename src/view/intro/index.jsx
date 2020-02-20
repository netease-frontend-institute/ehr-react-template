import React, { useState } from 'react';
import Routes, { getSubList } from '@/router/tools';
import { Menu } from 'antd';
import './index.less';

const { Item } = Menu;

function IntroIndex(props) {
    const { history } = props;
    const LinkMap = getSubList(props);

    const [selectedKey, setSelectedKey] = useState('');

    const onClick = e => {
        history.push(e.key);
        setSelectedKey(e.key);
    };

    return (
        <div className="m-intro-index">
            <Menu onClick={onClick} selectedKeys={[selectedKey]} mode="horizontal">
                {LinkMap.map(item => (
                    <Item key={item.link}>{item.title}</Item>
                ))}
            </Menu>

            <Routes {...props} />
        </div>
    );
}

export default IntroIndex;
