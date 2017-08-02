const OrderList = resolve => import('order/order-list/order-list').then(module => resolve(module))
const Login = resolve => import('login/login').then(module => resolve(module))

const routers = [
  {
    path: '/',
    redirect: '/order-list'
  },

  {
    path: '/order-list',
    component: OrderList,
    meta: {
      title: '订单列表'
    },
  },

  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录'
    },
  }
]

export default routers
