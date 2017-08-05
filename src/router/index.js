const OrderList = resolve => import('order/order-list/order-list').then(module => resolve(module))
const Login = resolve => import('login/login').then(module => resolve(module))
const GoodsList = resolve => import('goods/goods-list/goods-list').then(module => resolve(module))
const GoodsDetail = resolve => import('goods/goods-detail/goods-detail').then(module => resolve(module))
const OrderDetail = resolve => import('order/order-detail/order-detail').then(module => resolve(module))

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

  {
    path: '/goods-detail/:order_id/:code',
    component: GoodsDetail,
    meta: {
      title: '商品详情页'
    },
  },

  {
    path: '/order-detail/:order_id',
    component: OrderDetail,
    meta: {
      title: '订单详情'
    },
  }
]

export default routers
