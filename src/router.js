import {createRouter, createWebHistory} from "vue-router";

// 公共路由
export const constantRoutes = [
    {
        path: '/index',
        component: () => import('./index.vue'),
        hidden: true
    },
    {
        path: '/Upload',
        component: () => import('./view/Upload.vue'),
        hidden: true
    },
    {
        path: '/ShortChain',
        component: () => import('./view/ShortChain.vue'),
        hidden: true
    },
    {
        path: '/PVUV',
        component: () => import('./view/PVUV.vue'),
        hidden: true
    },
]


const router = createRouter({
    history: createWebHistory(),
    routes: constantRoutes,
});

export default router;
