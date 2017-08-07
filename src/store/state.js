const state = {
  fetchGoodsListParams: {
    menu_id: 0,
    level: 1,
    goods_color: '',
    page_index: 1,
    page_size: 6,
    search_key: '',
    order_id: '',
    // current_id 三个参数只是记录商品菜单的层级，请求 API 时不需要这三个参数
    current_id_a: 0,
    current_id_b: 0,
    current_id_c: 0,
  },
  goodsList: {},
  orderDetail: [],
  goodsCategoryList: [],
  goodsColorsList: [],
}

export default state
