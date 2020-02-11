import React, { useState } from 'react';
import { Menu } from 'antd';
import { withRouter } from 'react-router-dom';
import { ClickParam } from 'antd/es/menu';
import { IProps } from './interface';
import './index.less';

const { Item } = Menu;

const getRouteName = () => {
    let result = /^(.*)\/(.)*/.exec(location.pathname);
    let entryName = result !== null ? result[1] : '';
    return entryName === '/app' ? '/app/index' : entryName;
};

function Header(props: IProps) {
    const { history } = props;
    const [selectedKey, setSelectedKey] = useState(getRouteName());

    const onClick = (e: ClickParam) => {
        setSelectedKey(e.key);

        history.push(e.key);
    };

    return (
        <div className="m-header">
            <Menu mode="horizontal" selectedKeys={[selectedKey]} onClick={onClick}>
                <Item key="/app/index">首页</Item>

                <Item key="/app/intro">
                    <i className="icon-offerfafang icon iconfont" />
                    介绍页
                </Item>
            </Menu>
        </div>
    );
}

export default withRouter(Header);
