<template>
  <div>
    <div class="left-menu">
      <div class="logo">
        <span>文件上传平台</span>
      </div>
      <el-menu
        :default-active="index"
        class="el-menu-vertical-demo"
        select
        router
        background-color="#1d2935"
        text-color="#fff"
        active-text-color="#42b983"
      >
        <el-menu-item index="/operator">
          <i class="el-icon-setting"></i>
          <span slot="title">服务商列表</span>
        </el-menu-item>
        <el-menu-item index="/strategy">
          <i class="el-icon-news"></i>
          <span slot="title">策略设置</span>
        </el-menu-item>
        <el-menu-item index="/application">
          <i class="el-icon-menu"></i>
          <span slot="title">应用设置</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right">
      <div class="right-head">
        <div class="right-head-user">
          <el-dropdown trigger="click" :hide-on-click="true">
            <span class="el-dropdown-link">
              <el-button
                class="right-head-user-exit"
                slot="reference"
                icon="iconfont icon-user"
                circle
              ></el-button>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled>个人中心</el-dropdown-item>
              <el-dropdown-item divided>
                <span class="right-head-user-exit-logout" @click="logout">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="right-head-soul"></div>
      <router-view class="right-body"></router-view>
    </div>
  </div>
</template>
<script>
import { logout } from "@/utils/public";
export default {
  name: "leftMenu",
  data() {
    return {
      menu: [],
      logout: logout,
      index:window.location.pathname
    };
  }
};
</script>
 <style lang="less" scoped>
.left-menu {
  position: fixed;
  left: 0;
  height: 100%;
  width: auto;
}
.left-menu .logo {
  height: 60px;
  background: #1d2935;
  width: 240px;
  border-bottom: 1px solid #2c3e50;
}
.left-menu .logo span {
  display: block;
  line-height: 60px;
  padding-left: 25px;
  text-align: left;
  font-size: 16px;
  color: #fff;
}
.left-menu ul {
  height: 100%;
  width: 240px;
}
.right {
  position: relative;
  margin-left: 240px;
  width: calc(100% - 240px);
  height: 100vh;
}
.right-head {
  height: 60px;
  width: 100%;
  background: #fff;
  -webkit-box-shadow: 10px 0.5px 10px 0px #dfdfdf;
  box-shadow: 10px 0.5px 10px 0px #dfdfdf;
  position: absolute;
  top: 0;
  right: 0;
}
.right-head-soul {
  visibility: hidden;
  height: 60px;
  width: 100%;
}
.right-body {
  position: relative;
  margin: 0;
  padding: 0;
  width: 100%;
  height: calc(100vh - 60px);
  overflow: auto;
}
.right-head-user {
  float: right;
  display: block;
  line-height: 60px;
  padding-right: 10px;
}
.right-head-user-exit {
  width: 100%;
}
.right-head-user-exit-logout {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
