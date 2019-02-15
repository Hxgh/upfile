/**
 * @param {boolean} requireAuth 登录授权
 */
export default [{
  name: '/',
  path: '/',
  redirect: '/operator'
}, {
  name: '',
  path: '/web',
  redirect: '/operator'
}, {
  path: '/login',
  name: 'login',
  meta: {
    title: '登录页',
    menu: false,
  },
  component: () => import('../pages/login/login.vue')
}, {
  path: '/operator',
  name: 'operator',
  meta: {
    title: '服务商列表',
    requireAuth: true,
    menu: true,
  },
  component: () => import('../pages/operator/operator.vue')
}, {
  path: '/strategy',
  name: 'strategy',
  meta: {
    title: '策略设置',
    requireAuth: true,
    menu: true,
  },
  component: () => import('../pages/strategy/strategy.vue')
}, {
  path: '/application',
  name: 'application',
  meta: {
    title: '应用设置',
    requireAuth: true,
    menu: true,
  },
  component: () => import('../pages/application/application.vue')
}]