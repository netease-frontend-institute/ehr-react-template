/**
 * 路由自动化配置
 * @author heshiyu
 * @desc 路由自动化配置的使用方法：
 *         1、在路由表（src/router/index.js）中配好相应的父子路由关系
 *         2、在需要使用渲染出口的父组件中使用<Routes {...props} />。（注：顶层App.js无需传props）
 *
 * 三个内部方法：
 * @function lazy 将路由组件设为懒加载
 * @function findRoute 根据path，查找包括目标路由在内，及其上下级路由的信息；
 * @function getEntryName 获取当前入口信息（多页应用使用）
 *
 * 两个暴露方法：
 * @function getSubList 获取当前路由的子路由列表信息
 * @function Routes 渲染出口生成
 *
 * @date 2019-11-25
 */

import React, { lazy, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
// import Loadable from 'react-loadable';
// import ULoading from '@/components/common/u-loading';
import { deepClone } from '@/utils/tools';
import allRoutes from '@/router';

// const lazy = loader => Loadable({ loader, loading: ULoading });
const SuspenseComponent = Component => props => {
    console.log(props, 2);
    return (
        <Suspense fallback={null}>
            <Component {...props}></Component>
        </Suspense>
    );
};

const findRoute = (path = location.pathname.substring(location.pathname.lastIndexOf('/'))) => {
    let target = {};

    const _findRoute = routes => {
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].link === path) {
                target = deepClone({ ...routes[i] });
                break;
            }
            // 若当前层不匹配，且当前路由还有下级路由，往下查找
            else if ((routes[i].sub || []).length) {
                _findRoute(routes[i].sub);
            }
        }
    };

    let entryName = getEntryName();
    entryName && _findRoute(allRoutes[entryName]); // 1、拿到入口对应的路由表
    let targetSub = target.sub || [];

    return { target, targetSub };
};

const getEntryName = () => {
    let result = /^\/(.*).html/.exec(location.pathname);
    let entryName = result !== null ? result[1] : '';
    return entryName || 'index';
};

export const Routes = props => {
    const _buildRoutes = () => {
        let routes = [], // 即将要渲染的路由表
            currentRoute, // 当前路由
            hasRedirect, // 当前路由是否带重定向
            fromApp = props.origin; // 是否为顶层App.js渲染

        // 类型1：未指定渲染的路由（用于顶层路由App.js渲染子路由）
        if (fromApp) {
            // 多页应用使用方式（根据入口名得到对应整张路由表）
            let entryName = getEntryName();
            routes = allRoutes[entryName];
        }
        // 类型2：已指定渲染的路由（用于组件内渲染子路由）
        else {
            let currentPath = props.match.path || '',
                { target, targetSub } = findRoute(currentPath);

            currentRoute = target; // 取当前路由，用作生成Redirect
            hasRedirect = (currentRoute || {}).redirect;
            routes = targetSub; // 取子路由，用作生成Route
        }

        return [routes, currentRoute, hasRedirect];
    };

    // 渲染组件
    const _renderComponent = ({ link, redirect, component }, routeProps) => {
        let Component = lazy(deepClone(component)); // 将路由组件设为懒加载
        let { origin, ...propsFromParent } = props;
        // propsFromParent包括：上一级的所有props（除了origin）
        // routeProps包括当前路由的：match、location、history
        // 所以，每个组件中的props都会包含两部分：1、来自父亲的props；2、当前的路由信息
        return SuspenseComponent(Component)({ ...propsFromParent, ...routeProps });
        // return <Component {...propsFromParent} {...routeProps} />;
    };

    // 渲染路由（不设exact，约定父路由路径为子路由的前缀）
    const _renderRoute = r => <Route key={r.link} path={r.link} render={routeProps => _renderComponent(r, routeProps)} />;

    let [routes, currentRoute, hasRedirect] = _buildRoutes();
    let myRoutes = <Switch>{routes.map(r => _renderRoute(r))}</Switch>;
    let myRedirect = hasRedirect && <Route exact path={currentRoute.link} render={() => <Redirect to={currentRoute.redirect} push />} />;

    return (
        <Switch>
            {myRedirect}
            {myRoutes}
        </Switch>
    );
};

export const getSubList = props => {
    // props包含两部分：1、来自该组件父亲的props（除去origin）；2、当前的路由信息
    let currentPath = props.match.path || '',
        { targetSub } = findRoute(currentPath);

    return targetSub;
};

export default Routes;
