<template>
  <div class="container">
    <goods-menu @onMenuChange="onMenuChange" class="goods_menu"></goods-menu>
    <section class="goods_list">
      <header class="header_nav">
        <div class="box">
          订单：<router-link :to="'/order-detail/' + this.order_id">{{order_name}}</router-link>
          <router-link :to="'/order_detail/'" class="order_name heme_color"></router-link>
          <el-input
            ref="searchInput"
            class="search_input fr mt10"
            v-model="searchKey"
            placeholder="请输入商品名称或商品编号"
            icon="search"
            @keyup.enter.native="searchGoods"
            :on-icon-click="searchGoods">
          </el-input>
          <el-button class="add_num_btn fr" type="text">已添加：{{addedGoodsCount}} 个商品</el-button>
        </div>
      </header>

      <div class="content_box">
        <header class="bread_box" v-if="Object.keys(breadData).length">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :key="index" v-for="(item, index) in breadData">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>
        </header>

        <goods-table-layout :tableData="goodsListData" v-if="goodsListData.length" class="goods_table"></goods-table-layout>

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
  import GoodsTableLayout from './goods-table-layout'
  import { mapState } from 'vuex'

  export default {
    components: {
      GoodsMenu,
      GoodsTableLayout,
    },

    data() {
      const { order_id } = this.$route.params
      return {
        order_id,
        searchKey: '',
        goodsListData: [],
        addedGoodsCount: 0, // 该订单里已添加的商品数
        pageCount: 0,
        pageIndex: 1,
        breadData: {},
        order_name: '',
        goodsColor: '',
      }
    },

    created() {
      // pageIndex 一旦改变就触发 onPageChange 事件有点不妥，故加了这个变量做限制
      this.onPageChangeLock = false
      this.$store.dispatch('fetchGoodsList', {order_id: this.order_id})
    },

    computed: mapState(['fetchGoodsListParams', 'goodsList']),

    watch: {
      goodsList(data) {
        const {
          goodsListVos = [],
          goods_count,
          page_count,
          title = {},
          order_name = '',
        } = data
        this.goodsListData = goodsListVos || []
        this.breadData = title || {}
        this.addedGoodsCount = goods_count
        this.pageCount = page_count
        this.order_name = order_name
      },

      // 把 params 序列化到 URL 的 query 里，
      // TODO: 但是网页刷新后并没有反过来把 URL query 里的参数分配到 params 里
      fetchGoodsListParams(params) {
        this.$router.replace({
          query: params
        })
      },
    },

    methods:{
      searchGoods() {
        // 只要搜索传值了，后端会把所有的条件置空去搜索，尽管这样前端还是得把一些条件给清空
        // 改变 pageIndex 时会自动触发 onPageChange 事件，故需要设置 onPageChangeLock
        if(this.pageIndex !== 1) {
          this.onPageChangeLock = true
          this.pageIndex = 1
        }
        this.goodsColor = ''
        const params = {
          search_key: this.searchKey,
          page_index: this.pageIndex,
          goods_color: this.goodsColor,
          menu_id: 0,
          level: 1,
        }
        this.$store.dispatch('fetchGoodsList', params)
      },

      onPageChange(page_index) {
        if(this.onPageChangeLock) {
          this.onPageChangeLock = false
          return
        }
        this.pageIndex = page_index
        this.$store.dispatch('fetchGoodsList', {page_index})
      },

      onMenuChange(params) {
        this.$store.dispatch('fetchGoodsList', params)
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
