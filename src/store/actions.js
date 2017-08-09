import * as types from './mutation-types'
import { Axios } from "common/js/Axios"

export const fetchGoodsList = function({state, commit}, params) {
  commit(types.CHANGE_FETCH_GOODS_LIST_PARAMS, params)
  // current_id 三个参数只是记录商品菜单的层级，请求 API 时不需要这三个参数
  // 列举需要的参数
  const paramsList = [
    'menu_id',
    'level',
    'goods_color',
    'page_index',
    'page_size',
    'search_key',
    'order_id',
  ]
  const newParamsStr = JSON.stringify(state.fetchGoodsListParams, paramsList)

  Axios.get('goods/goods_list', {params: JSON.parse(newParamsStr)}).then(res => {
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

export const fetchGoodsColorsList = function({state, commit}){
  if(!state.goodsColorsList.length) {
    Axios.get('goods/goods_color').then(res => {
      if(!res || !res.data) return
      commit(types.FETCH_GOODS_COLORS_LIST, res.data)
    })
  }
}
