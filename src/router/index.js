/**
 * component参数说明：
 * Function: () => import(path/to/component)；（懒加载）
 */

const routes = {
    // key为entryName
    index: [
        {
            link: '/',
            title: '首页',
            component: () => import('@/view/index/Index.jsx')
        }
    ],
    intro: [
        {
            link: '/',
            title: '介绍页',
            component: () => import('@/view/intro/Index.jsx'),
            redirect: '/company',
            sub: [
                {
                    link: '/company',
                    title: '公司介绍',
                    component: () => import('@/view/intro/company/Index.jsx'),
                    sub: [
                        {
                            link: '/company/a',
                            title: 'a公司介绍',
                            component: () => import('@/view/intro/company/a/Index.jsx')
                        },
                        {
                            link: '/company/b',
                            title: 'b公司介绍',
                            component: () => import('@/view/intro/company/b/Index.jsx')
                        }
                    ]
                },
                {
                    link: '/bu',
                    title: '业务介绍',
                    component: () => import('@/view/intro/bu/Index.jsx')
                }
            ]
        }
    ]
};

export default routes;
