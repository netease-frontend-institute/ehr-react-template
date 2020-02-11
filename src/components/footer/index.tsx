import React from 'react';
import { withRouter } from 'react-router-dom';
import './index.less';

function Footer() {
    return (
        <div className="m-footer">
            <span>A project template for React v16.9.0 © Ehr FED</span>
        </div>
    );
}

export default withRouter(Footer);
