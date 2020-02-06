import React, { Component } from 'react';

/**
 * use :  <UIcon type="logout"  />
 * @export
 * @class UIcon
 * @params className 非必传
 * @extends {Component}
 */
export default class UIcon extends Component {
    render() {
        const { type, children, className = '', style, ...res } = this.props;
        return (
            <span className={className + ' net-icon icon iconfont icon-' + type} style={style} {...res}>
                {children || ''}
            </span>
        );
    }
}
