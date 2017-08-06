<template>
  <section class="edit_goods_container">
    <div class="rate_box" v-for="(rate, index) in rateList" :key="index">
      <span class="demonstration">{{rate.value}}</span>
      <el-rate
        class="rate"
        style="display: inline-block"
        v-model="form[rate.key]"
        :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
      </el-rate>
    </div>

    <div class="input_box">
      项目名称：
      <el-input class="input" v-model.trim="form.order_name" placeholder="请输入项目名称"></el-input>
    </div>

    <div class="textarea_box">
      评论：
      <el-input
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4}"
        placeholder="请输输入商品评论"
        v-model.trim="form.comment">
      </el-input>
    </div>

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
    props: ['code'],

    data() {
      return {
        form: {
          comment: '',
          order_name: '',
          time_limit: 5,
          customer_service: 5,
          quality: 5,
          effect: 5,
          goods_comment_id: '',
          code: this.code,
        },
        rateForm: {
          timeLimit: 5,
          quality: 5,
          effect: 5,
          customerService: 5,
        },
        rateList: [
          {key: 'time_limit', value: '工期'},
          {key: 'quality', value: '质量'},
          {key: 'effect', value: '效果'},
          {key: 'customer_service', value: '售后'},
        ],
        uploadUrl: process.env.BASE_API + '/goods/add_goods_comment',
        uploadImgList: [],
        fileList: [],
        del_img_ids: [],

        //是否更新了这个商品，用于关闭 dialog 时，判断要不要再从服务器请求数据，刷新第三方商品
        isEditedComment: false,
      }
    },

    mixins: [backgroundImage],

    methods: {
      // 从父组件接收即将编辑的商品数据，该方法由父组件调用
      _initCommentData(data){
        if(data.goodsCommentId) {
          const {
            quality,
            effect,
            comment,
            orderName,
            timeLimit,
            customerService,
            goodsCommentImgVOs,
            goodsCommentId,
          } = data
          this.form = {
            quality,
            effect,
            comment,
            order_name: orderName,
            time_limit: timeLimit,
            customer_service: customerService,
            goods_comment_id: goodsCommentId,
            code: this.code,
          }
          this.uploadImgList = goodsCommentImgVOs
        }
      },

      // 关闭 Dialog 时清空该组件内的商品数据，该方法由父组件调用
      _clearCommentData() {
        this.isEditedComment = false
        this.uploadImgList = []
        this.fileList = []
        this.del_img_ids = []
        this.form = {
          comment: '',
          order_name: '',
          time_limit: 5,
          customer_service: 5,
          quality: 5,
          effect: 5,
          goods_comment_id: '',
          code: this.code,
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
        const data = {
          ...form,
          img_ids: del_img_ids.join(),
        }
        this.$http.post('goods/add_goods_comment', data).then(res => {
          if (!res) return
          this.isEditedComment = true
          this.del_img_ids = []
          this.uploadImgList = this.uploadImgList.filter(img => del_img_ids.indexOf(img.id) < 0)
          this.form.goods_comment_id = res.data.goodsCommentId
          this.$message.success('提交成功！')
        })
      },

      beforeUpload(file) {
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
        if(data.goodsCommentImgVOs) {
          this.isEditedComment = true
          this.form.goods_comment_id = data.goodsCommentId
          this.uploadImgList = data.goodsCommentImgVOs
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
    padding: 20px
    width: auto
    height: auto
    border: 1px #ddd solid

    .rate_box
      height: 30px

      .demonstration
        margin-right: 5px
        line-height: 22px
        vertical-align: middle


      .rate
        display: inline-block
        vertical-align: top


    .input_box
      margin-top: 20px
      width: 300px


    .textarea_box
      margin-top: 20px
      width: 600px

    .delete_msg
      padding-left: 50px
      margin-top: 20px
      color: red

    .img_list
      margin-top: 0
      margin-left: 0
      padding-left: 0

      .item
        display: inline-block
        margin: 10px
        width: 240px
        height: 240px

      .active
        border: 2px red solid


    .submit_btn
      margin-top: 20px
      margin-bottom: 20px
      width: 200px

    .upload_container
      margin-top: 20px
      margin-bottom: 20px
      width: 320px
</style>
