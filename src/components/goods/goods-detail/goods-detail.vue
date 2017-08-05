<template>
  <section class="container">
    <goods-menu @onMenuChange="onMenuChange" class="goods_menu"></goods-menu>

    <div class="goods_container">
      <nav class="nav"><router-link to="/">订单名字</router-link></nav>

      <section class="goods_white_card">
        <header class="goods_info">
          <div class="goods_cover" :style="backgroundImage(info.goods_img)"></div>
          <div class="goods_desc">
            <h2 class="h2">{{info.goods_name || '商品名字'}}</h2>
            <ul>
              <li>供应商：{{info.supplier}}</li>
              <li>产品编码：{{info.productNum}}</li>
              <li>产品材质：{{info.material}}</li>
              <li>工艺：{{info.goods_process_desc || '无'}}</li>
              <li>工期：{{info.time_limit}}</li>
              <li>描述：{{info.desc || '无'}}</li>
              <li>链接：
                <a class="text_breakWord" :href="info.link">{{info.link || '无'}}</a>
              </li>
              <li>税金：{{info.taxes || '无'}}</li>
              <li>运费：{{info.freight || '无'}}</li>
            </ul>

            <h3 class="h3">规格</h3>
            <p>
              {{info.sizes}}
            </p>
            <h1 class="h1">
              <small>￥</small>{{info.price}}
            </h1>

            <section class="add_goods_box">
              颜色：
              <div
                v-for="(vos, index) in info.goodsPropertyVos"
                :key="index"
                :style="backgroundImage(vos.color, 'cover')"
                @click="selectColor(vos.color, vos.sku, index)"
                :class="circle_index == index ? 'seleted' : ''"
                class="color_circle">
                <i class="i fr i-2"></i>
              </div>
              <span v-if="!info.goodsPropertyVos.length">暂无数据</span>
            </section>

            <el-input-number class="input_num" size="small" :max="100000" :min="1" v-model="num"></el-input-number>
            <div class="btn_list">
              <el-button class="add_order" @click="add_goods" type="primary">添加订单</el-button>

              <el-button type="primary" :disabled="!info.cad" @click="windowOpen(info.cad)" class="cad">CAD</el-button>
              <el-button type="primary" :disabled="!info.su" @click="windowOpen(info.su)" class="su">SU</el-button>
            </div>
          </div>
        </header>

        <div class="goods_show">
          <h2 class="divide">产品展示</h2>
          <div class="img_list">
            <div class="img" v-for="(src, index) in info.img_list" :key="index" :style="backgroundImage(src)"></div>
          </div>
        </div>

        <div class="comment_list">
          <!-- 必须要用 this.info.code，this.code 可能是 sku （从订单详情页传递过来的）-->
          <GoodsCommentLayout :code="this.info.code"></GoodsCommentLayout>
        </div>
      </section>
    </div>


  </section>
</template>

<script>
  import GoodsCommentLayout from './goods-comment-layout'
  import GoodsMenu from 'base/goods-menu/goods-menu'
  import { backgroundImage } from 'common/js/mixins'
  export default {
    data() {
      // 从商品列表页跳转过来的，URL 里的 code 是商品的code
      // 从订单详情页跳转过来的，URL 里的 code 其实商品的 sku
      const { code, order_id } = this.$route.params
      return {
        code,
        order_id,
        num: 1,
        info: {
          goodsPropertyVos: [],
          code: '',
        },
        sku: '',
        color: '',
        circle_index: 0,
      }
    },

    mixins: [backgroundImage],

    components: {
      GoodsCommentLayout,
      GoodsMenu,
    },
    created() {
      this._fetchGoodsDetail()
    },

    methods: {
      onMenuChange(query) {
        this.$router.push({
          path: '/goods-list/' + this.order_id,
          query,
        })
      },

      selectColor(color, sku, index) {
        this.color = color
        this.sku = sku
        this.circle_index = index
      },

      windowOpen(url) {
        if(url) window.open(url)
      },

      _fetchGoodsDetail() {
        const { code } = this
        const params = {
          [code.indexOf('.') > -1 ? 'sku' : 'code']: code,
        }

        this.$http('goods/goods_detail', {params}).then(res => {
          if (!res || !res.data) return
          const { data } = res
          this.info = data
          this.color = data.goodsPropertyVos[0].color
          this.sku = data.goodsPropertyVos[0].sku
        })
      },

      add_goods() {
        // TODO 选择 SKU 和 颜色暂时用默认值
        const DATA = {
          sku: this.sku,
          color: this.color,
          num: this.num,
          order_id: this.order_id,
        }
        const AJAX = new AjaxFactory('order/add_goods', DATA)
        AJAX.POST().then(res => {
          if (!res) return
          const {
            success = false
          } = res
          if (success) {
            this.message('添加商品成功！', 'success')
          } else {
            this.message('添加商品失败！', 'error')
          }
        })
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

    .goods_container
      width: 100%
      min-height: 100vh

      .nav
        padding-left: 20px
        height: 50px
        line-height: 50px
        background: #eee

      .goods_white_card
        margin-left: 20px
        margin-top: 20px
        padding-left: 20px
        padding-right: 20px
        width: 800px
        background: #fff

        .h2, .h3
          margin-bottom: 10px

        ul
          margin: 0
          padding: 0

        li
          line-height: 24px
          list-style: none


      .goods_info
        display: flex
        width: 100%

        .goods_cover
          margin-right: 20px
          width: 350px
          height: 450px

        .goods_desc
          flex: 1


        .input_num
          margin-top: 10px
          margin-bottom: 10px


        .color_circle
          position: relative
          left: 0
          top: 0
          width: 25px
          height: 25px
          border-radius: 50%
          display: inline-block
          cursor: pointer
          border: 1px #3a3a3a solid

        i
          display: none

        .seleted i
          display: block
          position: absolute
          bottom: 0
          right: 0
          color: green
          font-size: 14px !important

      .goods_show
        width: 100%
        text-align: center

        .divide
          margin-top: 70px
          margin-bottom: 5px

        .img_list
          width: 100%
          text-align: left

          .img
            margin-right: 30px
            margin-bottom: 20px
            vertical-align: top
            display: inline-block
            width: 300px
            height: 300px
            border: 1px #fff solid

            &:nth-child(2n + 0)
              margin-right: 0
            &:hover
              border: 1px #000 solid
</style>
