<template>
  <div class="container">
    <goods-menu class="goods_menu"></goods-menu>
    <section class="goods_list">
      <header class="header_nav">
        <div class="box">
          订单：{{order_name}}
          <router-link :to="'/order_detail/'" class="order_name heme_color"></router-link>
          <el-input
            ref="searchInput"
            class="search_input fr mt10"
            v-model="searchKey"
            placeholder="请输入商品名称或商品编号"
            icon="search"
            v-if="showSearch"
            @keyup.enter.native="searchGoods"
            :on-icon-click="searchGoods">
          </el-input>
          <el-button class="add_num_btn fr" type="text" v-if="showSearch">已添加：{{addedGoodsCount}} 个商品</el-button>
        </div>
      </header>

      <div class="content_box">
        <header class="bread_box">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
          </el-breadcrumb>
        </header>

        <goods-table-layout :tableData="goodsListData" class="goods_table"></goods-table-layout>

        <el-pagination
          class="page_list"
          layout="prev, pager, next"
          @current-change="onPageChange"
          :current-page="pageIndex"
          :page-count="pageCount">
        </el-pagination>
      </div>
    </section>
  </div>
</template>
<script>
  import GoodsMenu from 'base/goods-menu/goods-menu'
  import GoodsTableLayout from './goods-table-layout.vue'
  import { mapState } from 'vuex'

  export default {
    components: {
      GoodsMenu,
      GoodsTableLayout,
    },

    data() {
      return {
        showSearch: true,
        searchKey: '',
        goodsListData: [],
        addedGoodsCount: 0, // 该订单里已添加的商品数
        pageCount: 0,
        pageIndex: 1,
        breadData: {},
        order_name: '',
      }
    },

    created() {
      this.$store.dispatch('fetchGoodsList')
    },

    computed: mapState(['fetchGoodsListParams', 'goodsList']),

    watch: {
      goodsList(data) {
        const {
          goodsListVos,
          goods_count,
          page_count,
          page_index,
          title,
          order_name,
        } = data
        this.goodsListData = goodsListVos
        this.breadData = title
        this.addedGoodsCount = goods_count
        this.pageIndex = page_index
        this.pageCount = page_count
        this.order_name = order_name
      },

      fetchGoodsListParams() {

      },
    },

    methods:{
      searchGoods() {

      },

      onPageChange(page_index) {
        this.$store.dispatch('fetchGoodsList', {page_index})
      },
    },
  }
</script>
<style lang="sass" scoped>
  .container
    width: 100%
    min-height: 100vh
    display: flex

    .goods_menu
      width: 220px

    .goods_list
      flex: 1

  .header_nav
    padding: 0 20px
    width: 100%
    box-sizing: border-box
    height: 50px
    background: #eee

    .order_name
      line-height: 50px
      font-size: 16px

    .add_num_btn
      margin-top: 10px
      margin-right: 20px

    .search_input
      width: 200px

  .content_box
    padding: 20px
    width: 100%
    height: auto

    .bread_box
      height: 30px
      line-height: 30px

    .goods_table
      width: 100%
      height: auto


    .page_list
      margin: auto
      text-align: center
      margin-top: 20px
</style>
