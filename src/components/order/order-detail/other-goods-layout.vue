<template>
  <section class="other_goods_container">
    <div class="goods_info">
      <ul class="item_list fl">
        <li>标题：{{goods.title}}</li>
        <li>价格：{{goods.price}}</li>
        <li>链接：<a :href="goods.link">{{goods.link}}</a></li>
        <li>描述：{{goods.desc}}</li>
      </ul>

      <div class="btn_area fr">
        <el-button class="edit_button" @click="editOtherGoods">修改</el-button>
        <el-button @click="deleteGoods" type="danger">删除</el-button>
      </div>
    </div>

    <ul class="img_list">
      <li v-for="(img, index) in goods.extendGoodsImgVOs" :key="index" :style="backgroundImage(img.imgPath)"></li>
    </ul>
  </section>
</template>

<script>
  import { backgroundImage } from 'common/js/mixins'

  export default {
    props: ['goods'],

    mixins: [backgroundImage],

    methods: {
      deleteGoods() {
        const data = {
          order_id: this.$route.params.order_id,
          order_detail_extend_id: this.goods.orderDetailExtendId,
        }
        this.$http.post('order/del_extend_goods', data).then(res => {
          if(!res) return
          if(res.success) {
            this.$message.success('删除成功！')
            this.$emit('deleteGoods')
          } else {
            this.$message.error('删除失败！')
          }
        })
      },

      editOtherGoods() {
        this.$emit('editGoods', this.goods)
      },
    }
  }
</script>

<style lang="sass" scoped>
  .other_goods_container
    margin-bottom: 20px
    width: auto
    height: auto
    border: 1px #ddd solid

  .goods_info
    height: 100px

    .item_list
      font-size: 14px
      line-height: 20px

    .btn_area
      margin: 20px

      .edit_button
        margin-right: 20px

  .img_list
    li
      display: inline-block
      margin-right: 10px
      margin-bottom: 10px
      width: 250px
      height: 250px
</style>
