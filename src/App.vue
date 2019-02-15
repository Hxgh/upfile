<template>
  <div id="app">
    <left-menu v-if="isShowMenu"></left-menu>
    <router-view v-else class="main"></router-view>
  </div>
</template>

<script>
import leftMenu from "./components/left-menu";
// eslint-disable-next-line no-unused-vars
import { mapState, mapActions } from "vuex";
export default {
  name: "App",
  components: {
    leftMenu
  },
  computed: {
    ...mapState({
      //..是超引用，可以在这里放多少属性值
      isShowMenu: state => state.app.showMenu
    })
  },
  methods: {
    ...mapActions({
      showMenu: "app/showMenu",
      hideMenu: "app/hideMenu"
    })
  },
  watch: {
    $route(to) {
      let self = this;
      to.meta.menu ? self.showMenu() : self.hideMenu();
    }
  }
};
</script>

<style lang="less" scope>
@import "./css/reset.css";
@import "./css/app.css";
</style>
