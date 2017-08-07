import * as types from './mutation-types'

const matutaions = {
  [types.CHANGE_FETCH_GOODS_LIST_PARAMS](state, params) {
    state.fetchGoodsListParams = {
      ...state.fetchGoodsListParams,
      ...params,
    }
  },

  [types.CLEAR_FETCH_GOODS_LIST_PARAMS](state) {
    state.fetchGoodsListParams = {
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
    }
  },

  [types.UPDATE_GOODS_LIST](state, newGoodsList) {
    state.goodsList = newGoodsList
  },

  [types.UPDATE_ORDER_DETAIL](state, newOrderDetail) {
    state.orderDetail = newOrderDetail
  },

  [types.UPDATE_ORDER_DETAIL_INDEX_VALUE](state, {value, key, keyIndex}) {
    state.orderDetail[keyIndex][key] = value
  },

  [types.FETCH_GOODS_CATEGORY_LIST](state, newCategoryList) {
    state.goodsCategoryList = newCategoryList
  },

  [types.FETCH_GOODS_COLORS_LIST](state, newColorsList) {
    state.goodsColorsList = newColorsList
  },
}

export default matutaions
