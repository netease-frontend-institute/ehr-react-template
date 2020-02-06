import React from 'react';
import { Routes } from '@/router/tools';
import './index.less';

const Content = props => {
    return (
        <div className="m-content">
            <Routes origin {...props} />
        </div>
    );
};

export default Content;
