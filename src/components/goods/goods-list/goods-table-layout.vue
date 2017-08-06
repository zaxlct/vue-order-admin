<template>
  <el-table
    :data="newTableData"
    class="goods_table"
    stripe
    border>
    <el-table-column label="产品图" width="180">
      <template scope="scope">
        <router-link
          tag="div"
          :to="'/goods-detail/' + $route.params.order_id + '/' + scope.row.code + '?order_name=' + order_name"
          class="goods_img cursor"
          :style="backgroundImage(scope.row.goods_img)">
        </router-link>
      </template>
    </el-table-column>

    <el-table-column label="产品基本信息" min-width="180">
      <template scope="scope">
        <p class="text_ellipsis">{{scope.row.goods_name}}</p>
        <p>{{scope.row.goodsPropertyVos[scope.row.currentSkuIndex].sku}}</p>
        <div
          v-for="(vos, index) in scope.row.goodsPropertyVos"
          :key="index"
          :style="backgroundImage(vos.color, 'cover')"
          @click.stop="selectColor(index, scope.$index)"
          :class="scope.row.currentSkuIndex === index ? 'seleted' : ''"
          class="color_circle"
        >
          <i class="i fr i-2"></i>
        </div>
        <p class="desc text_ellipsis">
          {{scope.row.goods_process_desc}}
        </p>
      </template>
    </el-table-column>

    <el-table-column label="材质" width="80">
      <template scope="scope">
        <p class="tc">{{scope.row.material}}</p>
      </template>
    </el-table-column>

    <el-table-column label="规格" width="120">
      <template scope="scope">
        <p>{{scope.row.sizes}}</p>
      </template>
    </el-table-column>

    <el-table-column label="工期" width="80">
      <template scope="scope">
        <p class="tc">{{scope.row.time_limit}}</p>
      </template>
    </el-table-column>

    <el-table-column label="单价" width="80">
      <template scope="scope">
        <p class="tc">{{scope.row.price}}</p>
      </template>
    </el-table-column>

    <el-table-column label="供应商" width="80">
      <template scope="scope">
        <p class="tc">{{scope.row.supplier}}</p>
      </template>
    </el-table-column>

    <el-table-column label="综合评分" min-width="150">
      <template scope="scope">
        <div class="rate_box" v-for="(rate, index) in rateList" :key="index"  v-if="scope.row.goodsListCommentVo">
          <span class="demonstration">{{rate.value}}</span>
          <el-rate
            class="rate"
            disabled
            :value="scope.row.goodsListCommentVo[rate.key]"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
          </el-rate>
        </div>
        <p class="tc" v-if="!scope.row.goodsListCommentVo">暂无评分</p>
      </template>
    </el-table-column>

    <el-table-column label="操作" min-width="130">
      <template scope="scope">
        <el-button type="primary" class="add_goods_btn" @click="addGoods(scope.$index)">添加商品</el-button>
        <div class="btn_area">
          <el-button
            size="small"
            class="btn_cad"
            :disabled="!scope.row.cad"
            @click="windowOpen(scope.row.cad)">
            CAD
          </el-button>
          <el-button
            size="small"
            class="btn_sku"
            :disabled="!scope.row.su"
            @click="windowOpen(scope.row.su)">
            SU
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
  import { backgroundImage } from 'common/js/mixins'
  export default {
    props: {
      tableData: {
        type: Array,
      },
      order_name: {
        type: String,
      },
    },
    data() {
      const {order_id} = this.$route.params
      return {
        order_id,
        rateList: [
          {key: 'ctimeLimit', value: '工期'},
          {key: 'cquality', value: '质量'},
          {key: 'ceffect', value: '效果'},
          {key: 'ccustomerService', value: '售后'},
        ],
      }
    },

    mixins: [backgroundImage],

    computed: {
      newTableData() {
        return this.tableData.map(item => ({...item, currentSkuIndex: 0}))
      }
    },

    methods:{
      selectColor(whichSkuIndex, whichGoodsIndex) {
        let data = [...this.newTableData]
        data[whichGoodsIndex].currentSkuIndex = whichSkuIndex
        this.newTableData = data
      },

      addGoods(whichGoodsIndex) {
        const { currentSkuIndex, goodsPropertyVos } = this.newTableData[whichGoodsIndex]
        const {
          sku,
          color
        } =  goodsPropertyVos[currentSkuIndex]
        const data = {
          sku,
          color,
          order_id: this.order_id,
        }
        this.$http.post('order/add_goods', data).then(res => {
          if (!res || !res.data) {
            this.$message.error('添加商品失败！')
          } else {
            this.$message.success('添加商品成功！')
            this.$emit('onAddedGoodsCountChange', res.data)
          }
        })
      },

      windowOpen(url) {
        if(!url) return
        window.open(url)
      },
    },
  }
</script>
<style lang="sass" scoped>
.goods_table
  p
    font-size: 12px
    line-height: 20px

  .goods_img
    width: 100%
    min-height: 100px

  .color_circle
    position: relative
    left: 0
    top: 0
    width: 25px
    height: 25px
    border-radius: 50%
    background-size: cover
    display: inline-block
    cursor: pointer
    border: 1px #3a3a3a solid

    i
      display: none

  .seleted i
    display: block
    position: absolute
    top: 5px
    right: 0
    color: green
    font-size: 14px !important

  .rate_box
    font-size: 12px
    line-height: 18px

    .rate
      display: inline-block
      vertical-align: top

  .add_goods_btn
    width: 100%
    font-size: 14px

  .btn_area
    margin-top: 10px
    display: flex
    justify-content: space-between

    .btn_sku
      flex: 1

    .btn_cad
      @extend .btn_sku

</style>
