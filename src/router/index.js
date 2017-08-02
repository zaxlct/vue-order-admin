const OrderList = resolve => import('order/order-list/order-list').then(module => resolve(module))

const routers = [
  {
    path: '/',
    redirect: '/order-list'
  },
  {
    path: '/order-list',
    component: OrderList,
  },
]

export default routers
