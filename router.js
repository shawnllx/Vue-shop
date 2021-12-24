import Vue from 'vue'
import Router from 'vue-router'

//实现路由的懒加载 const 组件名=() => import('组件路径');
// import Login from "@/components/Login";
const Login = () => import("@/components/Login")

// const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login')
// import VueRouter from 'vue-router'
//可以选择这种形式 const Cate=()=>import("../components/goods/Cate") 不需要什么插件，直接可以实现懒加载
// import Home from "@/components/Home";
const Home = () => import("@/components/Home")
// import Welcome from "@/components/Welcome";
const Welcome = () => import("@/components/Welcome")

// import Users from "@/components/user/Users";
const Users = () => import("@/components/user/Users")
// import Rights from "@/components/power/Rights";
const Rights = () => import("@/components/power/Rights")
// import Roles from "@/components/power/Roles";
const Roles = () => import("@/components/power/Roles")
// import Cate from '@/components/goods/Cate'
const Cate = () => import("@/components/goods/Cate")
// import Params from '@/components/goods/Parmas'
const Params = () => import("@/components/goods/Parmas")
// import GoodsList from "@/components/goods/List";
const GoodsList = () => import("@/components/goods/List")
// import Add from "@/components/goods/Add";
const Add = () => import("@/components/goods/Add")
// import Order from "@/components/order/Order";
const Order = () => import("@/components/order/Order")
// import Report from "@/components/report/Report";
const Report = () => import("@/components/report/Report")
// import Detail = () => import("@/components/detail/detail")

Vue.use(Router)
const router = new Router({
  routes: [
    {path: '/', redirect: '/login'},
    {path: '/login', component: Login},
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {path: '/Welcome', component: Welcome},
        {path: '/users', component: Users},
        {path: '/rights', component: Rights},
        {path: '/roles', component: Roles},
        {path: '/categories', component: Cate},
        {path: '/params', component: Params},
        {path: '/goods', component: GoodsList},
        {path: '/goods/add', component: Add},
        {path: '/orders', component: Order},
        {path: '/reports', component: Report},
      ]
    }
  ]
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next是一个函数,表示放行
  //  next()放行 next('/login') 强制跳转
  if (to.path === '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router