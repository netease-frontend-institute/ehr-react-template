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
                    component: () => import('@/view/intro/company/Index.jsx')
                },
                {
                    link: '/bu',
                    title: '业务介绍',
                    component: () => import('@/view/intro/bu/Index.jsx'),
                    sub: [
                        {
                            link: '/bu/music',
                            title: '音乐',
                            component: () => import('@/view/intro/bu/music/Index.jsx')
                        },
                        {
                            link: '/bu/game',
                            title: '游戏',
                            component: () => import('@/view/intro/bu/game/Index.jsx')
                        }
                    ]
                }
            ]
        }
    ]
};

export default routes;
