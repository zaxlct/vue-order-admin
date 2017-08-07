<template>
  <div class="container">
    <keep-alive>
      <goods-menu @onMenuChange="onMenuChange" class="goods_menu"></goods-menu>
    </keep-alive>
    <section class="goods_list">
      <header class="header_nav">
        <div class="box">
          订单：<router-link class="order_name" :to="'/order-detail/' + this.order_id">{{order_name}}</router-link>
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
        <header class="bread_box">
          <el-breadcrumb class="bread fl" separator="/" v-if="Object.keys(breadData).length">
            <el-breadcrumb-item :key="index" v-for="(item, index) in breadData">{{item}}</el-breadcrumb-item>
          </el-breadcrumb>

          <el-select class="color_select" v-model="goodsColor" clearable size="small" placeholder="颜色筛选">
            <el-option
              v-for="item in goodsColorsList"
              :key="item.code"
              :label="item.codeDesc"
              :value="item.code">
              <span style="vertical-align: top;">{{item.codeDesc}}</span>
              <img
                class="color_circle"
                :src="item.url"
                style="width:20px; height:20px; border: 1px #3a3a3a solid; border-radius: 50%; vertical-align: top; margin-left: 10px;"
              />
            </el-option>
          </el-select>
        </header>

        <goods-table-layout
          :tableData="goodsListData"
          :order_name="order_name"
          v-if="goodsListData.length"
          @onAddedGoodsCountChange="num => addedGoodsCount = num"
          class="goods_table">
        </goods-table-layout>

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

      this.$store.dispatch('fetchGoodsList', {...this.$route.query, order_id: this.order_id})
      this.$store.dispatch('fetchGoodsColorsList')
    },

    computed: mapState(['fetchGoodsListParams', 'goodsList', 'goodsColorsList']),

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

      goodsColor(goods_color) {
        // 改变 pageIndex 时会自动触发 onPageChange 事件，故需要设置 onPageChangeLock
        if(this.pageIndex !== 1) {
          this.onPageChangeLock = true
          this.pageIndex = 1
        }
        const params = {
          goods_color,
          page_index: this.pageIndex,
          menu_id: 0,
          level: 1,
        }
        this.$store.dispatch('fetchGoodsList', params)
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
        const params = {
          search_key: this.searchKey,
          page_index: this.pageIndex,
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
        // 商品菜单变动时清空 searchKey
        this.searchKey = ''
        params = {
          ...params,
          search_key: '',
        }
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
      margin-bottom: 5px
      height: 32px
      line-height: 32px

      .bread
        line-height: 32px

      .color_select
        width: 140px
        float: right

    .goods_table
      width: 100%
      height: auto


    .page_list
      margin: auto
      text-align: center
      margin-top: 20px
</style>
