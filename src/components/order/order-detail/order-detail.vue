<template>
  <div class="container">
    <goods-menu @onMenuChange="onMenuChange" class="goods_menu"></goods-menu>

    <section class="order_detail">
      <nav class="nav_container">
        <div class="box">
          <el-button @click="$router.push('/')" type="text" icon="arrow-left">返回订单列表</el-button>
          <span class="order_name">订单：{{'1111'}}</span>
          <p class="order_comment text_ellipsis" @dblclick="dialogCommitForm = true">
            备注:
            <span class="small">{{1111 || '暂无备注'}}</span>
          </p>
          <el-button @click="printPdf" class="pdf fr">导出订单</el-button>
        </div>
      </nav>

      <div class="content_box">
        <header class="header">
          <span>订单详情页</span>
          <el-button class="fr" type="primary" @click="saveOrder">保存订单</el-button>
          <el-button class="fr mr30" type="text"><strong>合计：{{orderAmount}}</strong></el-button>
        </header>

        <order-table-layout @deleteGoods="_fetchOrderDetail" class="order_table"></order-table-layout>
      </div>
    </section>
  </div>
</template>
<script>
  import GoodsMenu from 'base/goods-menu/goods-menu'
  import OrderTableLayout from './order-table-layout'
  import { UPDATE_ORDER_DETAIL } from 'store/mutation-types'
  import { mapState } from 'vuex'

  export default {
    components: {
      GoodsMenu,
      OrderTableLayout,
    },

    data() {
      const { order_id } = this.$route.params
      return {
        order_id,
        order_name: '',
        order_comment: '',
        otherOrderList: [],
      }
    },

    created() {
      this._fetchOrderDetail()
    },

    computed: {
      ...mapState({
        orderAmount: state => {
          const amount = state.orderDetail.reduce((num, prev) => {
            let profit = (prev.profit + 100) / 100
            return num + (prev.price * prev.num * profit)
          }, 0)

          return Number(amount.toFixed(2))
        }
      }),

      ...mapState({
        orderDetail: state => state.orderDetail
      }),
    },

    methods: {
      _fetchOrderDetail() {
        const params = {
          order_id: this.order_id
        }

        this.$http.get('order/order_detail', {params}).then(res => {
          if(!res || !res.data) return
          const { orderDetails, order_name, order_comment, orderExtendDetails } = res.data
          this.$store.commit(UPDATE_ORDER_DETAIL, orderDetails)
          this.otherOrderList = orderExtendDetails
          this.order_name = order_name
          this.order_comment = order_comment
        })
      },

      onMenuChange(query) {
        this.$router.push({
          path: '/goods-list/' + this.order_id,
          query,
        })
      },

      printPdf() {
        window.open(process.env.BASE_API + 'order/order_excel?order_id=' + this.$route.params.order_id)
      },

      saveOrder() {
        const sp = this.orderDetail.map(goods =>
          goods.sku + '@' +
          goods.profit + '@' +
          goods.num
        ).join(',')
        const data = {
          sp,
          order_id: this.order_id
        }
        this.$http.post('order/save_all_goods', data).then(res => {
          if(!res) return
          if(res.success) {
            this.$message.success('保存订单成功！')
          } else {
            this.$message.error('保存订单失败！')
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

    .order_detail
      flex: 1

  .nav_container
    padding: 0 20px
    width: 100%
    height: 50px
    background: #eee

    .order_name
      margin-left: 30px
      margin-right: 20px
      line-height: 50px
      font-size: 16px

    .order_comment
      width: 500px
      overflow: hidden
      display: inline-block
      vertical-align: top
      line-height: 50px
      font-size: 16px
      color: #20a0ff
      cursor: pointer

      .small
        font-size: 14px
        color: #3a3a3a

    .pdf
      margin-top: 5px


  .content_box
    padding: 20px
    width: 100%
    height: auto

    .header
      margin-bottom: 10px
      width: 100%
      height: 36px
      line-height: 36px


    .order_table
      width: 100%
      height: auto
  </style>
