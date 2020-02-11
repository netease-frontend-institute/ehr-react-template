import React from 'react';
import img from '@/assets/img/404.png';

function NotFound() {
    return (
        <div className="m-not-found">
            <img src={img} alt="404" />
        </div>
    );
}

export default NotFound;
