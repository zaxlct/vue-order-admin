<template>
  <section id="home_page">
    <header class="header_nav">
      <div class="container">
        <router-link to="/"><img src="~common/image/logo.png" class="logo" /></router-link>
        <el-button class="fr logout" type="danger" @click="logout">注销登录</el-button>
        <el-input
          class="search_input fr mt10"
          placeholder="请输入订单名称"
          icon="search"
          v-model="search_key"
          @keyup.enter.native="searchOrder"
          :on-icon-click="searchOrder">
        </el-input>
      </div>
    </header>

    <div class="table_container container">
      <header class="btn_area">
        <el-button class="add_order fr" @click="dialogFormVisible = true" type="primary">新建订单</el-button>
        <el-dialog title="请输入订单名称" :visible.sync="dialogFormVisible">
          <el-input v-model="order_name" @keyup.enter.native="asyncOK" placeholder="请输入内容订单名称"></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="asyncOK">确 定</el-button>
          </div>
        </el-dialog>
      </header>

      <div class="table">
        <router-link tag="div" v-if="order_list.length" :to="/order_detail/ + order.order_id" class="item" v-for="order in order_list" :key="order.order_id">
          <header class="header">
            {{order.order_name}}
            <el-button @click.stop.native="downloadPDF(order.order_id)" size="small" style="margin-top: 4px;" type="primary" class="fr">导出订单</el-button>

            <i class="i fr i-edit" />
            <span class="fr">
              订单总额：{{order.sum}}
            </span>
            <span class="fr">
              创建时间：{{order.created_time | getLocalTime}}
            </span>
          </header>

          <p class="order_note text_ellipsis">
            备注：{{order.comment || '暂无备注'}}
          </p>

          <ul class="img_list">
            <li v-for="img_src in order.img_list.slice(0, 7)" :key="img_src" :style="backgroundImage(img_src)"></li>
          </ul>
        </router-link>

        <h1 v-if="!order_list.length">没有数据</h1>

        <el-pagination
          v-if="order_list.length"
          class="page_list"
          layout="prev, pager, next"
          @current-change="changePage"
          :current-page="page_index"
          :page-count="page_count">
        </el-pagination>
      </div>
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
      asyncOK() {
        if (!this.order_name) {
          this.message('请输入订单名称！', 'error')
          this.dialogFormVisible = false
          return
        }
        const DATA = {
          order_name: this.order_name
        }
        const AJAX = new AjaxFactory('order/add_order', DATA)
        AJAX.POST().then(res => {
          this.dialogFormVisible = false
          if (!res || !res.data) return
          const order_id = res.data
          if (order_id) {
            this.$router.push(`/order/${order_id}/select_goods`)
          } else {
            this.message('创建订单失败！', 'error')
          }
        })
      },

      background(img) {
        return {
          backgroundImage: 'url('+ img +')',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }
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
        const DATA = {
          page_index: this.page_index,
          page_size: this.page_size,
          search_key: this.search_key,
        }

        this.$http.get('order/order_list', DATA).then(res => {
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
        this.page_index = 1
        this.fetchData()
      },

      // 选择页码
      changePage(page) {
        this.page_index = page
        this.fetchData()
      },
    },
  }
</script>

<style lang="scss" scoped>
  .header_nav {
    width: 100%;
    height: 50px;
    background: #eee;
  }

  .logo {
    width: 145px;
    height: 50px;
  }

  .logout {
    margin-left: 20px;
    margin-top: 8px;
  }

  .search_input {
    width: 200px;
  }

  .table_container {
    margin-top: 15px;
  }

  .btn_area {
    width: 100%;
    margin: auto;
    height: 40px;
  }

  .table {
    margin-left: 20px;
    margin-right: 20px;

    .item {
      display: block;
      background: #fff;
      cursor: pointer;

      &:hover {
        background: rgba(227, 232, 238, 0.33);
      }
    }

    .header {
      color: #3a3a3a;
      height: 36px;
      line-height: 36px;
      padding: 0 50px;
      border-bottom: 1px #e3e8ee solid;
      font-size: 14px;

      .fr {
        margin-left: 30px;
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
    .img_list {
      padding: 15px 50px;
      padding-bottom: 0;
      height: 110px;

      li {
        display: inline-block;
        width: 130px;
        height: 80px;
        margin-right: 10px;
        cursor: pointer;
        background-size: contain;
        overflow: hidden;
      }
    }

    .order_note {
      padding-left: 2%;
      width: 98%;
      color: #666;
      font-size: 12px;
    }
  }

  .page_list {
    text-align: center;
    margin: 20px auto;
  }
</style>
