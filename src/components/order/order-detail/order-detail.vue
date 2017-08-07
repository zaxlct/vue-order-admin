<template>
  <div class="container">
    <keep-alive>
      <goods-menu @onMenuChange="onMenuChange" class="goods_menu"></goods-menu>
    </keep-alive>
    <div class="order_container">
      <section class="order_detail">
        <nav class="nav_container">
          <div class="box">
            <el-button @click="$router.push('/')" type="text" icon="arrow-left">返回订单列表</el-button>
            <span class="order_name">订单：{{order_name}}</span>
            <p class="order_comment text_ellipsis" @dblclick="dialogCommentForm = true">
              备注:
              <span class="small">{{order_comment || '暂无备注'}}</span>
            </p>
            <el-button @click="printPdf" class="pdf fr">导出订单</el-button>
          </div>
        </nav>

        <div class="content_box">
          <header class="header">
            <b class="subtitle">订单详情</b>
            <el-button class="fr" type="primary" @click="saveOrder">保存订单</el-button>
            <el-button class="fr mr30" type="text"><strong>合计：{{orderAmount}}</strong></el-button>
          </header>

          <order-table-layout :order_name="order_name" @deleteGoods="_fetchOrderDetail" class="order_table"></order-table-layout>
        </div>

        <el-dialog title="备注" :visible.sync="dialogCommentForm">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入备注"
            :value="order_comment"
            ref="comment_ipt">
          </el-input>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCommentForm = false">取 消</el-button>
            <el-button type="primary" @click="submitComment">确 定</el-button>
          </div>
        </el-dialog>
      </section>

      <section class="other_goods_list">
        <div class="content_box">
          <header class="header">
            <b class="subtitle">第三方商品</b>
            <el-button class="fr" type="primary" @click="addOtherGoods">添加商品</el-button>
          </header>

          <other-goods-layout
            @deleteGoods="_fetchOrderDetail"
            @editGoods="openEditOtherGoodsDialog"
            v-for="(goods, index) in otherOrderList"
            :key="index"
            :goods="goods">
          </other-goods-layout>
        </div>

        <el-dialog
          :visible.sync="isShowEditGooods"
          size="full"
          :before-close="closeEditGoodsDialog"
        >
          <header slot="title" class="dialogTitle">
            <p class="title">{{goodsModelTitle}}<small class="small">（按 ESC 关闭）</small></p>
          </header>
          <edit-goods-layout ref="editGoodsComponent"></edit-goods-layout>
        </el-dialog>
      </section>
    </div>
  </div>
</template>
<script>
  import GoodsMenu from 'base/goods-menu/goods-menu'
  import OrderTableLayout from './order-table-layout'
  import OtherGoodsLayout from './other-goods-layout'
  import EditGoodsLayout from './edit-goods-layout'
  import { UPDATE_ORDER_DETAIL } from 'store/mutation-types'
  import { mapState, mapGetters } from 'vuex'

  export default {
    components: {
      GoodsMenu,
      OrderTableLayout,
      OtherGoodsLayout,
      EditGoodsLayout,
    },

    data() {
      const { order_id } = this.$route.params
      return {
        order_id,
        order_name: '',
        order_comment: '',
        otherOrderList: [],
        dialogCommentForm: false,
        isShowEditGooods: false,
        goodsModelTitle: '',
      }
    },

    created() {
      this._fetchOrderDetail()
    },

    computed: {
      ...mapGetters(['orderAmount', 'orderSpList']),

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

      onMenuChange(params) {
        this.$store.dispatch('fetchGoodsList', params)
        this.$router.push({path: '/goods-list/' + this.order_id})
      },

      printPdf() {
        window.open(process.env.BASE_API + 'order/order_excel?order_id=' + this.$route.params.order_id)
      },

      saveOrder() {
        const data = {
          sp: this.orderSpList,
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

      submitComment() {
        let comment = this.$refs.comment_ipt.$refs.textarea.value.trim()

        if(comment.length > 50) {
          return this.$message.error('最多不能超过 50字！')
        }
        this.order_comment = comment
        this.dialogCommentForm = false
        const data = {
          comment,
          order_id: this.order_id,
        }
        this.$http.post('order/order_comment', data).then(res => {
          if(!res) return
          if(res.success) {
            this.$message.success('添加备注成功！')
          } else {
            this.$message.error('添加备注失败！')
          }
        })
      },

      addOtherGoods() {
        this.isShowEditGooods = true
        this.goodsModelTitle = '添加第三方商品'
      },

      openEditOtherGoodsDialog(data) {
        this.goodsModelTitle = '修改第三方商品'
        this.isShowEditGooods = true
        this.$nextTick(() => {
          this.$refs.editGoodsComponent._initGoodsData(data)
        })
      },

      // 关闭 Dialog 时清空 子组件里的数据
      closeEditGoodsDialog(done) {
        if(this.$refs.editGoodsComponent.isEditedGoods) {
          this._fetchOrderDetail()
        }
        this.$refs.editGoodsComponent._clearGoodsData()
        done()
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

    .order_container
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

      .subtitle
        font-size: 18px


    .order_table
      width: 100%
      height: auto

  </style>
