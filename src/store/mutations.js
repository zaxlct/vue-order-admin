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
}

export default matutaions
