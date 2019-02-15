/**
 * @param {function} next 如果不设置就不会跳入下一页
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './router';
import "element-ui/lib/theme-chalk/index.css";
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {
    getToken
} from '@/utils/public';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: routes,
    mode: 'history'
});

router.beforeEach((to, from, next) => { //beforeEach是router的钩子函数，在进入路由前执行
    NProgress.start();
    if (to.meta.title) { //动态设置标题
        document.title = to.meta.title
    }
    if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
        if (getToken()) { // 通过vuex state获取当前的token是否存在
            next();
        } else {
            next({
                path: '/login'
            });
        }
    } else {
        next();
    }
});

router.afterEach(() => {
    NProgress.done();
});
export default router;