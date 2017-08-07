import * as types from './mutation-types'

const matutaions = {
  [types.CHANGE_FETCH_GOODS_LIST_PARAMS](state, params) {
    state.fetchGoodsListParams = {
      ...state.fetchGoodsListParams,
      ...params,
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
