import * as types from './mutation-types'

const matutaions = {
  [types.CHANGE_FETCH_GOODS_LIST_PARAMS](state, params) {
    state.fetchGoodsListParams = {
      ...state.fetchGoodsListParams,
      ...params,
    }
  },

  [types.UPDATE_GOODS_LIST](state, goodsList) {
    state.goodsList = goodsList
  },
}

export default matutaions
