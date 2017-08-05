<template>
  <el-table
    :data="orderDetail"
    v-if="orderDetail.length"
    border
    stripe
    class="order_table"
    style="width: 100%">
    <el-table-column label="产品图" width="170">
      <template scope="scope">
        <div class="goods_img" :style="backgroundImage(scope.row.goods_img)"></div>
      </template>
    </el-table-column>

    <el-table-column label="产品基本信息" min-width="100">
      <template scope="scope">
        <p class="text_ellipsis">{{scope.row.goods_name}}</p>
        <p class="text_ellipsis">{{scope.row.productNum}}</p>
        <p class="text_ellipsis">{{scope.row.material}}</p>
        <div class="color_box">
          颜色：
          <img class="color_circle" :src="scope.row.color"  />
        </div>
        <p class="desc text_ellipsis">
          {{scope.row.goods_process_desc}}
        </p>
      </template>
    </el-table-column>

    <el-table-column label="规格" width="100">
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

    <el-table-column label="数量" width="130">
      <template scope="scope">
        <el-input-number
          size="small"
          style="width: 106px;"
          :value="scope.row.num"
          :min="1"
          @change="value => changeOrderDetail(value, 'num', scope.$index)">
        </el-input-number>
      </template>
    </el-table-column>

    <el-table-column label="利润 %" width="130">
      <template scope="scope">
        <el-input-number
          size="small"
          style="width: 106px;"
          :value="scope.row.profit"
          :min="0"
          :max="500"
          @change="value => changeOrderDetail(value, 'profit', scope.$index)">
        </el-input-number>
      </template>
    </el-table-column>


    <el-table-column label="合价" width="80">
      <template scope="scope">
        <p class="tc">{{scope.row.sum | computedTotal(scope.row.num, scope.row.profit, scope.row.price)}}</p>
      </template>
    </el-table-column>


    <el-table-column label="供应商" width="80">
      <template scope="scope">
        <p class="tc">{{scope.row.supplier}}</p>
      </template>
    </el-table-column>

    <el-table-column label="备注" width="80">
      <template scope="scope">
        <p class="tc">{{scope.row.comment}}</p>
      </template>
    </el-table-column>


    <el-table-column label="删除" width="70">
      <template scope="scope">
        <el-button
          size="small"
          type="danger"
          @click="deleteOrder">
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import { backgroundImage } from 'common/js/mixins'
  import { mapState } from 'vuex'
  import { UPDATE_ORDER_DETAIL_INDEX_VALUE } from 'store/mutation-types'

  export default {
    mixins: [backgroundImage],

    filters: {
      computedTotal(total, num, profit, price) {
        const newTotal = num *(profit / 100 + 1) * price
        return Number(newTotal.toFixed(2))
      },
    },

    computed: mapState(['orderDetail']),

    methods: {
      changeOrderDetail(value, key, keyIndex) {
        const params = { value, key, keyIndex }
        this.$store.commit(UPDATE_ORDER_DETAIL_INDEX_VALUE, params)
      },

      deleteOrder() {

      },
    },
  }
</script>

<style lang="sass" scoped>
  .order_table
    p
      font-size: 12px
      line-height: 20px

    .goods_img
      width: 100%
      min-height: 100px

    .color_box
      line-height: 28px

      .color_circle
        margin-top: 10px
        width: 20px
        height: 20px
        border: 1px #3a3a3a solid
        border-radius: 50%

</style>
