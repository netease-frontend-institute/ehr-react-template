import React from 'react';
import { withRouter } from 'react-router-dom';
import './index.less';

function Footer(props) {
    return (
        <div className="m-footer">
            <span>Project Template with React v16.9.0 © Ehr FED, 2020</span>
        </div>
    );
}

export default withRouter(Footer);
