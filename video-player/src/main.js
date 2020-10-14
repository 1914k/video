import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import axios from "axios";

Vue.use(ElementUI);

Vue.prototype.$axios = axios;
Vue.prototype.$axios.interceptors.request.use(
  function(config) {
    let token = localStorage.JX_ACCESS_TOKEN;

    if (token) {
      // debugger;
      config.headers["Authorization"] =
        "bearer " + localStorage.JX_ACCESS_TOKEN;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
