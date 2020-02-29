/**
 * 路由自动化配置
 * @desc 路由自动化配置的使用方法：
 *         1、在路由表（src/router/index.ts）中配好相应的父子路由关系
 *         2、在需要使用渲染出口的父组件中使用<Routes {...props} />。（注：顶层出口需注明origin={true}）
 *
 * 一个内部方法：
 * @function SuspenseComponent 懒加载组件容器Suspense
 *
 * 三个暴露方法：
 * @function getRouteInfo 根据props，查找指定路由及其父路由信息；
 * @function getRouteLine 根据path，查找当前路由在路由表中的层级关系；
 * @function Routes 渲染出口生成
 *
 * @author heshiyu
 * @date 2019-11-25
 * @update 2020-02-27
 */

import React, { lazy, Suspense } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ULoading from '@/components/common/u-loading';
import { deepClone } from '@/utils/tools';
import allRoutes from '@/router';

const SuspenseComponent = Component => props => {
    return (
        <Suspense fallback={<ULoading />}>
            <Component {...props} />
        </Suspense>
    );
};

export const getRouteInfo = props => {
    // matchPath：当前处理的路由所对应的path（会随渲染层级改变而改变）
    // path：当前浏览器URL地址
    const [matchPath, path] = [props.match.path || '', props.location.pathname];
    const inMatchPath = matchPath === path; // 表示当前URL位于props.match.path（考虑重定向使用）
    let targetParent = { sub: [] },
        target = {};

    const _find = routes => {
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].link === matchPath) {
                targetParent = deepClone({ ...routes[i] });
                target = inMatchPath ? targetParent : (targetParent.sub || []).find(route => route.link === path);
                break;
            }
            // 若当前层不匹配，且当前路由还有下级路由，往下查找
            else if ((routes[i].sub || []).length) {
                _find(routes[i].sub);
            }
        }
    };

    _find(allRoutes);

    return { target, targetParent };
};

export const getRouteLine = path => {
    let navList = [];

    const _get = list => {
        list.forEach(item => {
            if (path.includes(item.link)) {
                navList.push(item);
                (item.sub || []).length && _get(item.sub || []);
            }
        });
    };

    _get(allRoutes);
    return navList;
};

export const Routes = props => {
    const _buildRoutes = () => {
        let routes = [], // 即将要渲染的路由表
            currentRoute, // 当前路由
            hasRedirect, // 当前路由是否带重定向
            fromApp = props.origin; // 是否为顶层App.js渲染

        // 类型1：未指定渲染的路由（用于顶层路由App.js渲染子路由）
        if (fromApp) {
            // 获取整张路由表
            routes = allRoutes;
        }
        // 类型2：已指定渲染的路由（用于组件内渲染子路由）
        else {
            let { targetParent, target } = getRouteInfo(props);

            currentRoute = target; // 取当前路由，用作生成Redirect
            hasRedirect = (currentRoute || {}).redirect;
            routes = targetParent.sub;
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

export default Routes;
