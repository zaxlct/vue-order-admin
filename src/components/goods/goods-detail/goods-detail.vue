<template>
  <section class="container">
    <keep-alive>
      <goods-menu @onMenuChange="onMenuChange" class="goods_menu"></goods-menu>
    </keep-alive>

    <div class="goods_container">
      <nav class="nav"><router-link :to="'/order-detail/' + order_id">订单：{{$route.query.order_name}}</router-link></nav>

      <section class="goods_white_card">
        <header class="goods_info">
          <div class="goods_cover" :style="backgroundImage(goods.goods_img)"></div>
          <div class="goods_desc">
            <h2 class="h2">{{goods.goods_name || '商品名字'}}</h2>
            <ul>
              <li>供应商：{{goods.supplier}}</li>
              <li>产品编码：{{goods.productNum}}</li>
              <li>产品材质：{{goods.material}}</li>
              <li>工艺：{{goods.goods_process_desc || '无'}}</li>
              <li>工期：{{goods.time_limit}}</li>
              <li>描述：{{goods.desc || '无'}}</li>
              <li>链接：
                <a class="text_breakWord" :href="goods.link">{{goods.link || '无'}}</a>
              </li>
              <li>税金：{{goods.taxes || '无'}}</li>
              <li>运费：{{goods.freight || '无'}}</li>
            </ul>

            <h3 class="h3">规格</h3>
            <p>
              {{goods.sizes}}
            </p>
            <h1 class="h1">
              <small>￥</small>{{goods.price}}
            </h1>

            <section class="add_goods_box">
              颜色：
              <div
                v-for="(vos, index) in goods.goodsPropertyVos"
                :key="index"
                :style="backgroundImage(vos.color, 'cover')"
                @click="selectColor(index)"
                :class="whichColorIndex == index ? 'selected' : ''"
                class="color_circle">
                <i class="i fr i-2"></i>
              </div>
            </section>

            <el-input-number class="input_num" size="small" :max="100000" :min="1" v-model="num"></el-input-number>
            <div class="btn_list">
              <el-button class="add_order" @click="add_goods" type="primary">添加商品</el-button>

              <el-button type="primary" :disabled="!goods.cad" @click="windowOpen(goods.cad)" class="cad">CAD</el-button>
              <el-button type="primary" :disabled="!goods.su" @click="windowOpen(goods.su)" class="su">SU</el-button>
            </div>
          </div>
        </header>

        <div class="goods_show">
          <h2 class="divide">产品展示</h2>
          <div class="img_list">
            <div class="img" v-for="(src, index) in goods.img_list" :key="index" :style="backgroundImage(src)"></div>
          </div>
        </div>

        <!-- 必须要用 this.goods.code，this.code 可能是 sku （从订单详情页传递过来的）-->
        <GoodsCommentLayout :code="this.goods.code"></GoodsCommentLayout>
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
        goods: {},
        whichColorIndex: 0,
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
        this.$router.push({path: '/goods-list/' + this.order_id, query})
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
          this.goods = res.data
        })
      },

      selectColor(whichColorIndex) {
        this.whichColorIndex = whichColorIndex
      },

      add_goods() {
        const { sku, color } = this.goods.goodsPropertyVos[this.whichColorIndex]
        const data = {
          sku,
          color,
          num: this.num,
          order_id: this.order_id,
        }
        this.$http.post('order/add_goods', data).then(res => {
          if (!res) return
          if (res.success) {
            this.$message.success('添加商品成功！')
          } else {
            this.$message.error('添加商品失败！')
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
        width: 820px
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

        .selected i
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
