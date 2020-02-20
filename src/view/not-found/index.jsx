import React from 'react';
import img from '@/assets/img/404.png';

function NotFound(props) {
    return (
        <div className="m-not-found">
            <img src={img} alt="404" />
        </div>
    );
}

export default NotFound;
