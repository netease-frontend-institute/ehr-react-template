import React from 'react';
import { withRouter } from 'react-router-dom';
import './index.less';

const LinkMap = [
    {
        link: '/app/index',
        name: '首页'
    },
    {
        link: '/app/intro',
        name: '介绍页'
    }
];

function Header(props) {
    return (
        <div className="m-header">
            <i className="icon-yingpinjilufangda icon iconfont"></i>
            <ul className="link-wrapper">
                {LinkMap.map(item => (
                    <li key={item.link} onClick={() => props.history.push(item.link)}>
                        {item.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default withRouter(Header);
