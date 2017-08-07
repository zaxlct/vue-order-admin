import * as types from './mutation-types'
import { Axios } from "common/js/Axios"

export const fetchGoodsList = function({state, commit}, params) {
  commit(types.CHANGE_FETCH_GOODS_LIST_PARAMS, params)
  Axios.get('goods/goods_list', {params: state.fetchGoodsListParams}).then(res => {
    if(!res) return
    if(!res.data) {
      commit(types.UPDATE_GOODS_LIST, {})
    } else {
      commit(types.UPDATE_GOODS_LIST, res.data)
    }
  })
}

export const fetchGoodsCategoryList = function({state, commit}){
  if(!state.goodsCategoryList.length) {
    Axios.get('goods/goods_category').then(res => {
      if(!res || !res.data) return
      commit(types.FETCH_GOODS_CATEGORY_LIST, res.data)
    })
  }
}
