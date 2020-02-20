/**
 * 路由自动化配置
 * @author heshiyu
 * @desc 路由自动化配置的使用方法：
 *         1、在路由表（src/router/index.ts）中配好相应的父子路由关系
 *         2、在需要使用渲染出口的父组件中使用<Routes {...props} />。（注：顶层App.js无需传props）
 *
 * 一个内部方法：
 * @function SuspenseComponent 懒加载组件容器Suspense
 *
 * 两个暴露方法：
 * @function getRouteInfo 根据指定路径，返回：当前路由信息、父路由信息、整条路由的回溯信息；
 * @function Routes 渲染出口生成
 *
 * @date 2019-11-25
 * @update 2020-02-19
 */

import React, { lazy, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ULoading from '@/components/common/u-loading';
import { deepClone } from '@/utils/tools';
import allRoutes from '@/router';

const SuspenseComponent = Component => props => {
    return (
        <Suspense fallback={<ULoading />}>
            <Component {...props}></Component>
        </Suspense>
    );
};

export const getRouteInfo = (path = location.pathname) => {
    let currentRoute = {}, // 当前路由
        superRoute = { sub: allRoutes }, // 当前路由的上一级路由（默认为整张路由表的上级，无意义）
        traceList = []; // 整条路由的回溯信息

    const isTopRoute = path.split('/').length <= 3; // 判断当前是否为一级路径

    // 递归查找“当前路由信息（currentRoute）”
    const _findCurrent = () => {
        let routes = isTopRoute ? allRoutes : superRoute.sub; // 若为一级路由，则将整张路由表作为范围；否则为当前路由所处的同级路由表
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].link !== path) continue;

            currentRoute = deepClone({ ...routes[i] });
            traceList.push(currentRoute);
            break;
        }
    };

    // 递归查找“当前路由的上一级路由信息（superRoute）”
    const _findParent = (routes = allRoutes) => {
        let parentPath = path.slice(0, path.lastIndexOf('/')); // 获取上一级路径
        for (let i = 0; i < routes.length; i++) {
            // 若匹配，则深复制这个路由信息
            if (routes[i].link === parentPath) {
                superRoute = deepClone({ ...routes[i] });
                traceList.push(superRoute);
                _findCurrent();
                break;
            }
            // 若不匹配、且当前路由还有下级路由，继续往下查找
            else if ((routes[i].sub || []).length) {
                traceList.push(routes[i]);
                _findParent(routes[i].sub);
            } else {
                traceList.pop();
            }
        }
    };

    isTopRoute ? _findCurrent() : _findParent(); // 若为一级路由，仅查找当前路由信息（为了记录路由轨迹）；否则开始查找父路由

    return { currentRoute, superRoute, traceList }; // 分别对应：当前路由信息、父路由信息、整条路由的回溯信息；
};

export const Routes = props => {
    // 渲染组件
    const _renderComponent = ({ link, redirect, component }, routeProps) => {
        let Component = lazy(deepClone(component)); // 将路由组件设为懒加载
        let { origin, ...propsFromParent } = props;
        // propsFromParent包括：上一级的所有props（除了origin）
        // routeProps包括当前路由的：match、location、history
        // 所以，每个组件中的props都会包含两部分：1、来自父亲的props；2、当前的路由信息
        return SuspenseComponent(Component)({ ...propsFromParent, ...routeProps });
    };

    // 渲染路由（不设exact，约定父路由路径为子路由的前缀）
    const _renderRoute = r => <Route key={r.link} path={r.link} render={routeProps => _renderComponent(r, routeProps)} />;

    const fromApp = props.origin;
    const { currentRoute, superRoute } = getRouteInfo();
    const routes = fromApp ? allRoutes : superRoute.sub; // 若为顶层路由，则渲染整张路由表；否则渲染当前路由所处的同级路由表
    const hasRedirect = !fromApp && currentRoute.redirect; // 是否有重定向（仅当非顶层路由时）

    const myRedirect = hasRedirect && <Route exact path={currentRoute.link} render={() => <Redirect to={currentRoute.redirect} push />} />;
    const myRoutes = <Switch>{routes.map(r => _renderRoute(r))}</Switch>;

    return (
        <Switch>
            {myRedirect}
            {myRoutes}
        </Switch>
    );
};

export default Routes;
