<template>
  <div class="menu_layout">
    <router-link to="/"><img src="~common/image/logo.png" class="logo" /></router-link>

    <div class="menu menu_a" v-for="(data, index) in menu_list" :key="index">
      <div
        @click="changeTree('current_id_a', data.menu_id, 1)"
        class="item">
        <i v-show="data.node_list && data.menu_id !== current_id_a" class="i i-right"></i>
        <i v-show="data.node_list && data.menu_id === current_id_a" class="i i-down"></i>
        {{data.name}}
      </div>

      <el-collapse-transition
        v-if="data.node_list && data.menu_id === current_id_a"
        v-for="data_son in data.node_list"
        :key="data_son.menu_id">
        <section class="menu menu_b">
          <div
            @click="changeTree('current_id_b', data_son.menu_id, 2)"
            :class="[ data_son.menu_id === current_id_b && !data_son.node_list ? 'active' : '', 'item']"
          >
            <i v-show="data_son.node_list && data_son.menu_id !== current_id_b" class="i i-right"></i>
            <i v-show="data_son.node_list && data_son.menu_id === current_id_b" class="i i-down"></i>
            {{data_son.name}}
          </div>


          <el-collapse-transition
            v-if="data_son.node_list && data_son.menu_id === current_id_b"
            v-for="data_grandson in data_son.node_list"
            :key="data_grandson.menu_id">
            <section class="menu">
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
  export default {
    name: "MenuLayout",
    data() {
      return {
        menu_list: [],
        current_id_a: '',
        current_id_b: '',
        current_id_c: '',
      }
    },

    created() {
      this._fetchMenuData()
    },

    methods: {
      changeTree(key, id, level) {
        if(key === 'current_id_b') this.current_id_c = ''
        if(this[key] === id) {
          this[key] = ''
        } else {
          this[key] = id
        }

//        this.$router.push({
//          path: `/order/${this.$route.params.order_id}/select_goods`,
//          query: { menu_id: id , level}
//        })
      },

      _fetchMenuData() {
        this.$http.get('goods/goods_category').then(res => {
          if(!res) return
          this.menu_list = res.data
          this.current_id_a = res.data[0].menu_id
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
  $color: #021d44;

  .menu_layout {
    position: relative;
    padding-top: 20px;
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
    font-size: 16px;
    color: #fff;

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
      padding-left: 45px;
    }
  }

  .menu_c {
    background: lighten($color, 14%);

    .item {
      padding-left: 75px;
    }
  }
</style>
