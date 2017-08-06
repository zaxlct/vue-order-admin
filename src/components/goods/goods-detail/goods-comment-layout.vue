<template>
  <div class="goods_comment_container">
    <h2 class="h2">评论列表</h2>
    <div class="add_comment_btn">
      <el-button class="fr" size="large" @click="addComment" type="primary">添加评论</el-button>
    </div>
    <ul class="comment_list">
      <li class="comment_box" v-for="(comment, index) in commentList" :key="index">
        <header class="header">
          <span class="name">账号：{{comment.userName}}</span>
          <span class="order_name text_ellipsis">项目名：{{comment.orderName || '暂无'}}</span>
          <span class="time">评论时间：{{comment.createdTime}}</span>

          <div class="btn_area">
            <el-button :disabled="!comment.power" type="primary" @click="editComment(comment)" size="small">
              修改评论
            </el-button>
            <el-button :disabled="!comment.power" type="danger" @click="deleteComment(comment.goodsCommentId)" size="small">删除评论</el-button>
          </div>
        </header>

        <div class="rate_box" v-for="rate in rateList" :key="rate.key">
          <span class="demonstration">{{rate.value}}</span>
          <el-rate
            class="rate"
            disabled
            :value="comment[rate.key]"
            :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
          </el-rate>
        </div>

        <h4 class="h4" v-if="comment.goodsCommentImgVOs.length">评论图片</h4>
        <ul v-if="comment.goodsCommentImgVOs.length" class="img_list">
          <li v-for="(img, index) in comment.goodsCommentImgVOs" :key="index" :style="backgroundImage(img.imgPath)"></li>
        </ul>

        <h4 class="h4">评论内容</h4>
        <p class="content">
          {{comment.comment}}
        </p>
      </li>
    </ul>

    <el-dialog
      size="full"
      :before-close="closeDialog"
      :visible.sync="dialogCommitForm">
      <header slot="title" class="dialogTitle">
        <p class="title">{{dialogTitle}}<small class="small">（按 ESC 关闭）</small></p>
      </header>
      <edit-comment-layout :code="code" ref="editCommentComponent"></edit-comment-layout>
    </el-dialog>
  </div>
</template>

<script>
  import EditCommentLayout from './edit-comment-layout'
  import { backgroundImage } from 'common/js/mixins'
  export default {
    props: ['code'],
    mixins: [backgroundImage],
    components: {
      EditCommentLayout,
    },
    data() {
      return {
        dialogCommitForm: false,
        dialogTitle: '',
        commentList: [],
        currentEditId: '',
        currentComment: '',
        rateList: [
          {key: 'timeLimit', value: '工期'},
          {key: 'quality', value: '质量'},
          {key: 'effect', value: '效果'},
          {key: 'customerService', value: '售后'},
        ],
        rateForm: {
          timeLimit: 5,
          quality: 5,
          effect: 5,
          customerService: 5,
        },
      }
    },

    watch: {
      code(code) {
        if(code) {
          this._fetchCommentData()
        }
      },
    },

    methods: {
      _fetchCommentData() {
        const params = {
          code: this.code
        }
        this.$http('goods/goods_comment', {params}).then(res => {
          if(!res) return
          this.commentList = res.data
        })
      },

      deleteComment(goods_comment_id) {
        const data = { goods_comment_id }
        this.$http.post('goods/del_goods_comment', data).then(res => {
          if(!res) return
          if(res.success) {
            this.$message.success('删除成功！')
            this._fetchCommentData()
          } else {
            this.$message.error('删除失败！')
          }
        })
      },

      addComment() {
        this.dialogCommitForm = true
        this.dialogTitle = '添加商品评论'
      },

      editComment(data) {
        this.dialogCommitForm = true
        this.dialogTitle = '修改商品评论'
        this.$nextTick(() => {
          this.$refs.editCommentComponent._initCommentData(data)
        })
      },

      // 关闭 Dialog 时清空 子组件里的数据
      closeDialog(done) {
        if(this.$refs.editCommentComponent.isEditedComment) {
          this._fetchCommentData()
        }
        this.$refs.editCommentComponent._clearCommentData()
        done()
      },
    },
  }
</script>

<style lang="sass" scoped>
  .goods_comment_container
    width: 100%
    height: auto

  .h2
    text-align: center
    font-size: 24px

  .add_comment_btn
    height: 30px
    clear: both

  .comment_list
    padding: 0
    padding-top: 10px

  .comment_box
    margin-bottom: 20px
    padding: 10px
    width: 100%
    height: auto
    list-style: none
    border: 1px #ddd solid
    text-align: left

    .header
      margin-bottom: 10px
      height: 30px
      line-height: 30px

    .name
      margin-right: 20px
      font-size: 16px
      color: #20a0ff

    .order_name
      margin-right: 15px
      display: inline-block
      vertical-align: top
      max-width: 160px
      font-size: 14px

    .time
      margin-right: 15px
      font-size: 14px

    .rate_box
      font-size: 14px

    .btn_area
      float: right

    .h4
      margin-bottom: 0

    .content
      margin-top: 15px
      word-wrap: break-word
      word-break: break-word
      color: #666
      font-size: 14px

    .img_list
      margin-top: 10px
      padding-left: 0

      li
        display: inline-block
        margin: 10px
        width: 220px
        height: 220px


  .demonstration
    line-height: 22px
    vertical-align: middle


  .rate
    display: inline-block
    vertical-align: top
</style>
