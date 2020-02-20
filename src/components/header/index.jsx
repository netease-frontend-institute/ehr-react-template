import React, { useState } from 'react';
import { Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import { getEntryName } from '@/router/tools';
import './index.less';

const { Item } = Menu;
const CURRENT_ENTRY = getEntryName(); // 当前入口

function Header(props) {
    const [selectedKey, setSelectedKey] = useState(CURRENT_ENTRY);

    const onClick = e => {
        console.log(e.key, 123);
        setSelectedKey(e.key);

        location.href = `/${e.key}.html`;
    };

    return (
        <div className="m-header">
            <Menu mode="horizontal" selectedKeys={[selectedKey]} onClick={onClick}>
                <Item key="index">首页</Item>

                <Item key="intro">
                    <i className="icon-offerfafang icon iconfont" />
                    介绍页
                </Item>
            </Menu>
        </div>
    );
}

export default withRouter(Header);
