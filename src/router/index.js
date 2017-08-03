const OrderList = resolve => import('order/order-list/order-list').then(module => resolve(module))
const Login = resolve => import('login/login').then(module => resolve(module))
const GoodsList = resolve => import('goods/goods-list/goods-list').then(module => resolve(module))

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
  },

  {
    path: '/goods-list/:order_id',
    component: GoodsList,
    meta: {
      title: '商品列表'
    },
  },
]

export default routers
