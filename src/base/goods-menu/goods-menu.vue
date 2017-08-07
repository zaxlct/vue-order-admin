<template>
  <div class="menu_layout">
    <router-link to="/"><img src="~common/image/logo.png" class="logo" /></router-link>

    <div class="menu menu_a" v-for="(data, index) in goodsCategoryList" :key="index">
      <div
        @click="changeTree('current_id_a', data.menu_id, 1)"
        class="item">
        <i v-show="data.node_list && data.menu_id !== current_id_a" class="i i-right"></i>
        <i v-show="data.node_list && data.menu_id === current_id_a" class="i i-down"></i>
        {{data.name}}
      </div>

      <el-collapse-transition v-for="data_son in data.node_list" :key="data_son.menu_id">
        <section class="menu menu_b" v-if="data.node_list && data.menu_id === current_id_a">
          <div
            @click="changeTree('current_id_b', data_son.menu_id, 2)"
            :class="[ data_son.menu_id === current_id_b && !data_son.node_list ? 'active' : '', 'item']"
          >
            <i v-show="data_son.node_list && data_son.menu_id !== current_id_b" class="i i-right"></i>
            <i v-show="data_son.node_list && data_son.menu_id === current_id_b" class="i i-down"></i>
            {{data_son.name}}
          </div>

          <el-collapse-transition v-for="data_grandson in data_son.node_list" :key="data_grandson.menu_id">
            <section class="menu menu_c" v-if="(data_son.node_list && data_son.menu_id === current_id_b)">
              <div
                @click="changeTree('current_id_c', data_grandson.menu_id, 3)"
                :class="[ data_grandson.menu_id === current_id_c ? 'active' : '', 'item']">
                {{data_grandson.name}}
              </div>
            </section>
          </el-collapse-transition>

        </section>
      </el-collapse-transition>
    </div>

    <a class="admin_icon" href="http://rzk.in-zhuang.com/gzk/index.html" target="_blank">
      <i class="el-icon-menu"></i>
    </a>

  </div>

</template>

<script>
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        current_id_a: 0,
        current_id_b: 0,
        current_id_c: 0,
      }
    },

    created() {
      this.$store.dispatch('fetchGoodsCategoryList')
    },

    mounted() {
      let { current_id_a = 0, current_id_b = 0, current_id_c = 0 } = this.$route.query
      if(this.$route.name === 'GoodsList') {
        this.current_id_a = Number(current_id_a)
        this.current_id_b = Number(current_id_b)
        this.current_id_c = Number(current_id_c)
      } else {
        // 在不是 GoodsList 页面时，默认展开左侧商品菜单的第一个分类
//        if(this.goodsCategoryList.length) {
//          this.current_id_a = this.goodsCategoryList[0].menu_id
//        }
      }
    },

    computed: mapState(['goodsCategoryList']),

    watch: {
      goodsCategoryList(data) {
        if(this.$route.name === 'GoodsList') return
        // 在不是 GoodsList 页面时，默认展开左侧商品菜单的第一个分类
//        if(data.length) {
//          this.current_id_a = data[0].menu_id
//        }
      },
    },

    methods: {
      changeTree(key, menu_id, level) {
        if(key === 'current_id_b') this.current_id_c = ''
        if(this[key] === menu_id) {
          this[key] = ''
        } else {
          this[key] = menu_id
        }

        const params = {
          menu_id,
          level,
          current_id_a: this.current_id_a,
          current_id_b: this.current_id_b,
          current_id_c: this.current_id_c,
        }
        this.$emit('onMenuChange', params)
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import "~common/scss/mixins";
  $color: #021d44;

  .menu_layout {
    position: relative;
    padding-top: 20px;
    min-height: 100vh;
    overflow-y: scroll;
    background: $color;

    .admin_icon {
      display: block;
      margin: auto;
      margin-top: 20px;
      text-align: center;
      font-size: 24px;
    }
  }

  .logo {
    display: block;
    margin: auto;
    margin-bottom: 20px;
    height: 50px;
  }

  .menu {
    width: 100%;
    height: auto;
    font-size: 14px;
    color: #fff;
    @extend %text_ellipsis;

    .item {
      margin-bottom: 1px;
      height: 40px;
      line-height: 40px;
      padding-left: 20px;
      cursor: pointer;

      &:hover {
        color: #FFDC00;
        background: rgba(255,255,255,.2);
      }

      .i {
        margin-right: 5px;
        font-size: 12px;
      }
    }

    .active {
      color: #FFDC00;
      font-weight: 400;
      background: rgba(255,255,255,.2);
    }
  }

  .db {
    display: block !important;
  }

  .menu_b {
    background: lighten($color, 8%);

    .item {
      padding-left: 40px;
    }
  }

  .menu_c {
    background: lighten($color, 14%);

    .item {
      padding-left: 75px;
    }
  }
</style>
