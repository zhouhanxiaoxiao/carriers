import Vue from 'vue'
import App from './App.vue'
import router from "@/router/router";
import axios from "axios";
import $ from "jquery";
import i18n from "@/i18n";
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import util from "@/components/public/util";
import store from "@/store/store";
import VueCookies from 'vue-cookies';


Vue.use(iView);
Vue.prototype.$axios = axios;
Vue.prototype.$ = $;
Vue.prototype.$cookies = VueCookies;

axios.defaults.baseURL = "http://localhost:8890/test";
axios.defaults.withCredentials = true
// axios.defaults.baseURL = "";
axios.interceptors.response.use(response =>{
  return response;
},error => {
  console.log(error);
  if (error.response){
    switch (error.response.status) {
      case 403:
        router.replace({
          path : "/login",
          query : {redirect : router.currentRoute.fullPath}
        });
        return Promise.reject("转到登录啦！");
      case 401:
        var currentUrl = window.location.href.replaceAll("/","%2F").replaceAll(":","%3A");
        console.log(currentUrl)
        window.location.href = util.loginUrl + currentUrl;
        break;
      default:
        break;
    }
  }
  router.replace({
    path : "/error",
    query : {redirect : router.currentRoute.fullPath}
  });
});


new Vue({
  router,
  store,
  i18n,
  render: h => h(App),
}).$mount('#app')
