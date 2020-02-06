/**
 * component参数说明：
 * Function: () => import(path/to/component)；（懒加载）
 */

const routes = [
    {
        link: '/app/index',
        title: '首页',
        component: () => import('@/view/home')
    },
    {
        link: '/app/intro',
        title: '介绍主页',
        redirect: '/app/intro/company',
        component: () => import('@/view/intro'),
        sub: [
            {
                link: '/app/intro/company',
                title: '公司介绍',
                component: () => import('@/view/intro/company')
            },
            {
                link: '/app/intro/bu',
                title: '业务介绍',
                component: () => import('@/view/intro/bu')
            }
        ]
    }
];

export default routes;
