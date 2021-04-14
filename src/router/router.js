import Vue from 'vue'
import VueRouter from 'vue-router'
import home from "@/components/home";
import carrierDetail from "@/components/carrierDetail";
import carrierConfig from "@/components/carrierConfig";

Vue.use(VueRouter)

/*配置路由*/
const routes = [
    {path: '', redirect : "/home"},
    {path: '/', redirect : "/home"},
    {path: '/home', component: home, meta: {index: 0}},
    {path: '/carrier',name : "carrier", component: carrierDetail, meta: {index: 1}},
    {path: '/config',name : "config", component: carrierConfig, meta: {index: 2}},

]
/*实例化路由*/
const router = new VueRouter({
    routes: routes, // （简写）相当于 routes: routes
});

/*导出路由模块*/
export default router