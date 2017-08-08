const OrderList = () => import('order/order-list/order-list')
const Login = () => import('login/login')
const GoodsList = () => import('goods/goods-list/goods-list')
const GoodsDetail = () => import('goods/goods-detail/goods-detail')
const OrderDetail = () => import('order/order-detail/order-detail')

const routers = [
  {
    path: '/',
    redirect: '/order-list'
  },

  {
    path: '/order-list',
    name: 'OrderList',
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
    name: 'GoodsList',
    component: GoodsList,
    meta: {
      title: '商品列表'
    },
  },

  {
    path: '/goods-detail/:order_id/:code',
    name: 'GoodsDetail',
    component: GoodsDetail,
    meta: {
      title: '商品详情页'
    },
  },

  {
    path: '/order-detail/:order_id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: {
      title: '订单详情'
    },
  }
]

export default routers
