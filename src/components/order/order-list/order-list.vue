<template>
  <section id="home_page">
    <header class="header_nav">
      <div class="container">
        <router-link to="/"><img src="~common/image/logo.png" class="logo" /></router-link>
        <el-button class="fr logout" @click="logout">注销登录</el-button>
        <el-input
          class="search_input fr"
          placeholder="请输入订单名称"
          icon="search"
          v-model="search_key"
          @keyup.enter.native="searchOrder"
          :on-icon-click="searchOrder">
        </el-input>
        <el-button class="add_order fr" @click="dialogFormVisible = true" type="primary">新建订单</el-button>

        <el-dialog title="请输入订单名称" :visible.sync="dialogFormVisible">
          <el-input v-model="order_name" @keyup.enter.native="addOrder" placeholder="请输入内容订单名称"></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addOrder">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </header>

    <div class="order_list_container">
      <router-link
        tag="div"
        v-if="order_list.length"
        :to="/order_detail/ + order.order_id"
        class="order_box"
        v-for="order in order_list" :key="order.order_id">
        <header class="thead">
          {{order.order_name}}

          <span class="order_note text_ellipsis">
            备注：{{order.comment || '暂无备注'}}
          </span>

          <el-button @click.stop.native="downloadPDF(order.order_id)" size="small" type="primary" class="export_order_btn fr">导出订单</el-button>

          <i class="i fr i-edit" />
          <span class="fr">
            订单总额：{{order.sum}}
          </span>
          <span class="fr">
            创建时间：{{order.created_time | getLocalTime}}
          </span>
        </header>

        <ul class="img_list">
          <li v-for="img_src in order.img_list.slice(0, 7)" :key="img_src" :style="backgroundImage(img_src)"></li>
        </ul>
      </router-link>

      <h1 v-if="!order_list.length">没有数据</h1>

      <el-pagination
        v-if="order_list.length"
        class="page_list"
        layout="prev, pager, next"
        @current-change="onPageChange"
        :current-page="page_index"
        :page-count="page_count">
      </el-pagination>
    </div>
  </section>
</template>

<script>
  import { backgroundImage } from 'common/js/mixins'
  export default {
    data() {
      return {
        order_name: '',
        search_key: '',
        page_index: 1,
        page_size: 6,
        page_count: 1,
        dialogFormVisible: false,
        order_list: [],
      }
    },

    mixins: [backgroundImage],

    created() {
      // page_index 一旦改变就触发 onPageChange 事件有点不妥，故加了这个变量做限制
      this.onPageChangeLock = false
      this.fetchData()
    },

    filters: {
      getLocalTime(timestamp) {
        const date = new Date(timestamp)
        let Y = date.getFullYear(),
          m = date.getMonth()+1,
          d = date.getDate(),
          H = date.getHours(),
          i = date.getMinutes(),
          s = date.getSeconds()
        if(m<10){
          m = '0'+m;
        }
        if(d<10){
          d = '0'+d;
        }
        if(H<10){
          H = '0'+H;
        }
        if(i<10){
          i = '0'+i;
        }
        if(s<10){
          s = '0'+s;
        }
        return Y+'-'+m+'-'+d+' '+H+':'+i+':'+s;
      }
    },

    methods: {
      addOrder() {
        if (!this.order_name) {
          this.$message.error('请输入订单名称！', 'error')
          return
        }
        const DATA = {
          order_name: this.order_name
        }

        this.$http.post('order/add_order', DATA).then(res => {
          this.dialogFormVisible = false
          if (!res || !res.data) return
          const order_id = res.data
          if (order_id) {
            this.$router.push(`/goods-list/${order_id}`)
          } else {
            this.$message.error('创建订单失败！', 'error')
          }
        })
      },

      downloadPDF(id) {
        window.open(process.env.BASE_API + 'order/order_excel?order_id=' + id)
      },

      logout() {
        const keys=document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
          for (let i = keys.length; i--;)
            document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
        }
        this.$router.push('/login')
      },

      fetchData() {
        const params = {
          page_index: this.page_index,
          page_size: this.page_size,
          search_key: this.search_key,
        }

        this.$http.get('order/order_list', {params} ).then(res => {
          if (res) {
            const {
              orderListVos = [], page_count = 1
            } = res.data
            this.order_list = orderListVos
            this.page_count = page_count
          }
        })
      },

      // 搜索
      searchOrder() {
        // 只要搜索传值了，后端会把所有的条件置空去搜索，尽管这样前端还是得把一些条件给清空
        // 改变 pageIndex 时会自动触发 onPageChange 事件，故需要设置 onPageChangeLock
        if(this.pageIndex !== 1) {
          this.onPageChangeLock = true
          this.pageIndex = 1
        }
        this.fetchData()
      },

      // 选择页码
      onPageChange(page) {
        if(this.onPageChangeLock) {
          this.onPageChangeLock = false
          return
        }
        this.page_index = page
        this.fetchData()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .header_nav {
    padding: 0 30px;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background: #eee;

    .add_order {
      margin-top: 12px;
      margin-right: 60px;
      width: 150px;
    }

    .logo {
      width: 150px;
      height: 50px;
      vertical-align: middle;
    }

    .logout {
      margin-top: 10px;
      margin-left: 20px;
    }

    .search_input {
      width: 200px;
    }
  }

  .order_list_container {
    margin-top: 30px;
    margin-left: 20px;
    margin-right: 20px;

    .order_box {
      margin-bottom: 20px;
      display: block;
      background: #fff;
      cursor: pointer;

      &:hover {
        background: rgba(227, 232, 238, 0.33);
      }
    }

    .thead {
      color: #3a3a3a;
      height: 36px;
      line-height: 36px;
      padding: 0 50px;
      border-bottom: 1px #e3e8ee solid;
      font-size: 14px;

      .export_order_btn {
        margin-top: 4px;
        margin-left: 30px;
      }

      .fr {
        margin-left: 20px;
      }

      .i-edit {
        margin-top: 2px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        color: #0142a1;
        border-radius: 50%;
        text-align: center;
        border: 1px #0142a1 solid;
        font-size: 20px;
        cursor: pointer;
      }
    }


    .order_note {
      margin-top: 10px;
      padding-left: 2%;
      width: 98%;
      color: #666;
      font-size: 14px;
      line-height: 18px;
    }

    .img_list {
      margin: 0;
      width: 100%;
      height: 100px;

      li {
        display: inline-block;
        width: 130px;
        height: 100px;
        margin-right: 10px;
        cursor: pointer;
        background-size: contain;
        overflow: hidden;
      }
    }
  }

  .page_list {
    text-align: center;
    margin: 20px auto;
  }
</style>
