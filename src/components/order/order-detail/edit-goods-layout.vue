<template>
  <section class="edit_goods_container">
    <ul class="item_list">
      <li class="item">
        标题：<el-input class="input" v-model.trim="form.title" placeholder="请输入商品标题"></el-input>
      </li>
      <li class="item">
        价格：
        <el-input class="input" type="number" v-model.number.trim="form.price" placeholder="请输入商品价格"></el-input>
      </li>
      <li class="item">
        链接：
        <el-input class="input" v-model.trim="form.link" placeholder="请输入商品链接"></el-input>
      </li>
      <li class="item">
        描述：
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6}"
          placeholder="请输入商品描述，最多500字"
          v-model.trim="form.desc">
        </el-input>
      </li>
    </ul>

    <div v-if="uploadImgList.length">
      <p class="delete_msg">双击选择要删除的图片</p>
      <ul class="img_list">
        <li
          class="item"
          :class="del_img_ids.indexOf(img.id) > -1 ? 'active' : ''"
          v-for="(img, index) in uploadImgList"
          :key="index"
          @dblclick="selectedImg(img.id)"
          :style="backgroundImage(img.imgPath)">
        </li>
      </ul>
    </div>

    <el-button class="submit_btn" type="success" @click="onSubmit">提交</el-button>

    <el-upload
      class="upload_container"
      ref="upload"
      name="file"
      :action="uploadUrl"
      :data="form"
      :multiple="false"
      :file-list="fileList"
      :with-credentials="true"
      :before-upload="beforeUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      :auto-upload="true">
      <el-button slot="trigger" size="small" type="primary">选取图片</el-button>
      <div slot="tip" class="el-upload__tip">每次只能上传一张，格式为 jpg/png ，且不超过 10M</div>
    </el-upload>
  </section>
</template>

<script>
  import { backgroundImage } from 'common/js/mixins'

  export default {
    data() {
      return {
        form: {
          link: '',
          title: '',
          price: '',
          desc: '',
          order_detail_extend_id: '',
          order_id: this.$route.params.order_id,
        },
        uploadUrl: process.env.BASE_API + '/order/add_extend_goods',
        uploadImgList: [],
        fileList: [],
        del_img_ids: [],

        //是否更新了这个商品，用于关闭 dialog 时，判断要不要再从服务器请求数据，刷新第三方商品
        isEditedGoods: false,
      }
    },

    mixins: [backgroundImage],

    methods: {
      // 从父组件接收即将编辑的商品数据，该方法由父组件调用
      _initGoodsData(data){
        if(data.orderDetailExtendId) {
          const {
            desc,
            link,
            title,
            price,
            extendGoodsImgVOs,
            orderDetailExtendId,
          } = data
          this.form = {
            link,
            title,
            price,
            desc,
            order_detail_extend_id: orderDetailExtendId,
            order_id: this.$route.params.order_id,
          }
          this.uploadImgList = extendGoodsImgVOs
        }
      },

      // 关闭 Dialog 时清空该组件内的商品数据，该方法由父组件调用
      _clearGoodsData() {
        this.isEditedGoods = false
        this.uploadImgList = []
        this.fileList = []
        this.del_img_ids = []
        this.form = {
          link: '',
          title: '',
          price: '',
          desc: '',
          order_detail_extend_id: '',
          order_id: this.$route.params.order_id,
        }
      },

      selectedImg(id) {
        if(this.del_img_ids.indexOf(id) > -1) {
          this.del_img_ids = this.del_img_ids.filter(oldId => oldId !== id)
        } else {
          this.del_img_ids.push(id)
        }
      },

      onSubmit() {
        const { del_img_ids, form } = this
        if(form.desc.length > 500) {
          this.$message.error('商品描述超过了 500 个字符！')
          return
        }
        const data = {
          ...form,
          img_ids: del_img_ids.join(),
        }
        this.$http.post('order/add_extend_goods', data).then(res => {
          if (!res) return
          this.isEditedGoods = true
          this.del_img_ids = []
          this.uploadImgList = this.uploadImgList.filter(img => del_img_ids.indexOf(img.id) < 0)
          this.form.order_detail_extend_id = res.data.orderDetailExtendId
          this.$message.success('提交成功！')
        })
      },

      beforeUpload(file) {
        if(this.form.desc.length > 500) {
          this.$message.error('商品描述超过了 500 个字符！')
          return
        }
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 10

        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 或 PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 10MB!')
        }
        return isJPG && isLt2M
      },

      handleUploadSuccess(res) {
        const { data } = res
        if(!data) {
          this.fileList = []
          return this.$message.error('上传失败，请重新上传！')
        }
        if(data.extendGoodsImgVOs) {
          this.isEditedGoods = true
          this.form.order_detail_extend_id = data.orderDetailExtendId
          this.uploadImgList = data.extendGoodsImgVOs
        }
      },

      handleUploadError() {
        console.error('图片上传失败')
        this.$message.error('图片上传失败，请重试！')
      },
    },
  }
</script>

<style lang="sass" scoped>
  .edit_goods_container
    margin-bottom: 20px
    width: auto
    height: auto
    border: 1px #ddd solid

  .item_list
    .item
      margin-bottom: 15px

    .input
      display: inline-block
      width: 700px

  .delete_msg
    padding-left: 50px
    margin-top: 20px
    color: red

  .img_list
    margin-top: 0

    .item
      display: inline-block
      margin-right: 10px
      margin-bottom: 10px
      width: 250px
      height: 250px

    .active
      border: 2px red solid

  .upload_container
    margin-top: 10px
    margin-bottom: 20px
    padding-left: 20px
    width: 320px

  .submit_btn
    margin-top: 20px
    margin-bottom: 20px
    margin-left: 20%
    width: 200px
</style>
