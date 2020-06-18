import React from 'react';
import { withRouter } from 'react-router-dom';
import './index.less';

function Footer(props) {
    return (
        <div className="m-footer">
            <span>EHR前端模板（单页/js）React v16.9.0 © Ehr FED</span>
        </div>
    );
}

export default withRouter(Footer);
