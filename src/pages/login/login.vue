<template>
  <div class="login">
    <div class="login-box">
      <div class="login-box-head">
        <span>文件上传平台</span>
      </div>
      <div class="login-box-main">
        <el-input
          type="text"
          maxlength="20"
          clearable
          @clear="psd = ''"
          placeholder="请输入账号"
          prefix-icon="iconfont icon-user"
          v-model="name"
        ></el-input>
        <el-input
          type="password"
          maxlength="20"
          placeholder="请输入密码"
          prefix-icon="iconfont icon-eye"
          v-model="psd"
        ></el-input>
        <el-button type="primary" :loading="loading" @click="login_fn" plain>登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { login } from "@/utils/public";
import { api_login } from "@/api/login.js";
export default {
  data() {
    return {
      name: "",
      psd: "",
      loading: false
    };
  },
  methods: {
    login_fn() {
      let self = this;
      let data = {
        name: self.name,
        pwd: self.psd
      };
      self.loading = true;
      api_login(data)
        .then(res => {
          let token = res.data.token;
          let expire_in = res.data.expire_in;
          login(token,expire_in);
          Message.success("登录成功");
          setTimeout(() => {
            window.app.$router.push({ name: "/" });
          }, 1000);
          self.loading = false;
        })
        .catch(error => {
          Message.success(`登录失败${error}`);
          self.loading = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100vh;
  background: linear-gradient(90deg, #2193b0, #6dd5ed);
}
.login-box {
  position: absolute;
  right: calc(50% - 150px);
  top: 50%;
  transform: translateY(-60%);
  width: 300px;
  min-height: 50px;
  background: #fff;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;
  box-shadow: 0px 1px 10px 0px rgba(17, 17, 17, 0.1);
}
.login-box:hover {
  transition: all 0.2s;
  box-shadow: 0 1px 20px 0px rgba(17, 17, 17, 0.1);
}
.login-box-head {
  padding: 15px 20px;
  border-bottom: 1px solid #e8eaec;
}
.login-box-head span {
  display: inline-block;
  font-size: 14px;
  color: #17233d;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.login-box-main {
  padding: 10px 20px;
}
.login-box-main > * {
  margin: 10px 0;
  width: 100%;
}
</style>

