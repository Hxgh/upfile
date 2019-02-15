import Vue from "vue";
import App from "./App.vue";
import router from "@/router";
import ElementUI from "element-ui";
import '@/css/theme.scss';
import '@/css/layout.css';
import store from '@/store';
import '@/assets/iconfont/iconfont.css';

Vue.use(ElementUI);

Vue.config.productionTip = false;

window.app = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount("#app");