<template>
  <el-container style="overflow: hidden">
    <el-aside ref="asidebox" :class="isCollapse?'left_small':'left'" :style="{'width': width + 'px'}">
      <el-container style="overflow: hidden">
        <el-header class="el-head">
          <p class="el-title1">{{isCollapse?'IEP':'IEP集成效率平台'}}</p>
        </el-header>
        <el-main :style="{'width': width + 18 + 'px'}">
  <!--导航-->
        <div class="left_nav" style="overflow: hidden">
           <el-menu
           background-color="#232F49"
           :default-active="$route.path"
           class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            @select = 'handselect'
            text-color="#fff"
            :router='true'
            :collapse="isCollapse"
            active-text-color="#ffd04b">
              <elsubmenu v-if="routerList.length > 0" :routerList='routerList' :isCollapse='isCollapse'/>
            </el-menu>
        </div>
     <!--导航左右滑动-->
        <div class="hover_btn" @click.stop="settings($event)">
            <i :class='!isCollapse?"iconfont icon-double-left":"iconfont icon-double-right"'></i>
          </div>
      </el-main>
      </el-container>
    </el-aside>
    <el-container>
  <!--右面小导航-->
      <el-header class="main-header">
        <menutab></menutab>
        <div class="loginbox">
          <el-menu   class="el-menu-demo" mode="horizontal" background-color="#ffffff" active-text-color="#333">
            <el-submenu index="2" popper-class="login-submenu">
              <template slot="title"><span>欢迎您!&nbsp;</span>{{this.userName}}</template>
              <el-menu-item  @click="exit" index="2-1">退出</el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
      </el-header>

  <!--内容页面-->
      <el-main style="margin-right: -20px;padding-right: 20px;">
        <div class="main_cont">
          <div class="breadcrumbs">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }"><i class="iconfont icon-shouye1"></i></el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item,index) in router_methed" v-if="index !=0" :key="index">{{item.name}}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <administrator v-if="pwdShow" :pwdShow='pwdShow' v-on:changePwd='changePwd'></administrator>
          <router-view ></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import administrator from './administrator'
import elsubmenu from './elSubmenu'
import menutab from '@/components/menutab/index'
import { getCookie, delCookie } from 'utils/cookie'
import { getSessionStorage, removeSesssionStorage } from 'utils/storage'
import { mapMutations } from 'vuex'

export default {
  components: {
    administrator,
    elsubmenu,
    menutab
  },
  data () {
    return {
      nav_index: 0,
      nav_left: 0,
      nav_left_allwidth: 0,
      nav_right: 0,
      nav_right_allwidth: 0,
      isCollapse: false,
      active: 'department',
      pwdShow: false,
      dialogshow: true,
      userName: '',
      router_methed: [],
      icons: ['icon-suyaniconchanpinleibufenzuodaohangbufen87', 'icon-xiangmuguanli', 'icon-xiangmutixi', 'icon-zhibiaotongji'],
      routerList: [],
      navigationArr: [],
      width: 200,
      functions: 'fff'
    }
  },
  mounted () {
    // 检测登陆
    if (getCookie('userinfo')) {
      this.userName = JSON.parse(getCookie('userinfo')).name
      this.$router.push({path: this.$route.path})
    } else {
      this.$router.push({path: '/login'})
    }
    this.routerList = JSON.parse(getSessionStorage('menu'))[0].children
    this.routerList.unshift(
      {path: '/'}
    )
    this.functions = JSON.parse(getSessionStorage('function'))
    this.router_methed = this.$route.matched
  },
  methods: {
    handleOpen (key, keyPath) {
    },
    handselect (index, keyPath) {
    },
    handleClose (key, keyPath) {
    },
    exit () {
      delCookie('userinfo')
      removeSesssionStorage('menu')
      this.clearOption()
      this.$router.push({path: '/login'})
    },
    currentNavfn (command) {
      if (command === 0) {
        this.navigationArr.splice(this.nav_index, 1)
      } else if (command === 1) {
        this.navigationArr.splice(0, this.navigationArr.length)
      }
    },
    nav_index_fn (index) {
      this.nav_index = index
    },
    nav_removefn (index) {
      this.navigationArr.splice(index, 1)
      this.nav_index = this.navigationArr.length - 1
    },
    settings (e) { // 导航左右滑动
      if (this.isCollapse) {
        this.isCollapse = !this.isCollapse
        this.width = 200
        setTimeout(() => {
          this.width = 200
        }, 200)
      } else {
        this.width = 60
        this.isCollapse = !this.isCollapse
      }
    },
    changePwd () { // 修改密码
      if (this.pwdShow) {
        this.pwdShow = false
      } else {
        this.pwdShow = true
      }
    },
    loginOut () { // 退出
      let _this = this
      function out (action, instance) {
        if (action === 'confirm') {
          localStorage.removeItem('userid')
          _this.$router.push({path: '/login'})
        }
      }
      this.$confirm('您确定要退出吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        callback: out
      })
    },
    ...mapMutations({
      setFlag: 'SET_FLAG',
      clearOption: 'CLEAR_OPTION'
    })
  },
  watch: {
    '$route' (to, from) {
      this.router_methed = this.$route.matched
      if (to.params.jobName === 'default') {
        this.setFlag(true)
      } else {
        this.setFlag(false)
      }
    }
  }
}
</script>

<style scoped>
  /*头部*/
  .breadcrumbs{
    padding:20px 0;
    margin-bottom: 20px;
    border-bottom:1px solid #cecece;
  }
  .el-header{
    display: flex;
    padding: 0 !important;
  }
  .main-header{
    position: relative;
    background: #FFFFFF;
  }
  .main-header:after{
     content: "";
     position: absolute;
     left: 0;
     bottom: 0;
     width: 100%;
     height: 2px;
     background-color: #b6bbc5;
     z-index: 1;
   }
  .el-head .el-title1{
    font-family:Helvetica;
    margin: 0;
    width: 100%;
    height:60px;
    background: #3F94FC;
    line-height: 60px;
    color:#FFFFFF;
    font-size: 18px;
  }
/*导航*/
  .el-submenu .el-submenu__title{
    font-size: 14px;
  }
  .el-submenu .el-submenu__title .iconfont{
    font-size: 14px;
    color:#838FA9;
    /*padding-right: 15px !important;*/
  }
  .title{
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .el-submenu__title{
    display: flex!important;
    justify-content: center!important;
  }
  /*内容页*/
  .nav_head{
    height: 139px;
  }
  .main_cont{
    background:#fff;
    margin: 2px auto;
    padding: 0 10px;
  }
  .nav_zhong .icon-yuandianxiao{
    font-size: 19px;
  }
  .nav_zhong_actions{
    color:#999999;
  }
  .nav_zhong_actions .icon-yuandianxiao{
    color:#3F94FC;
  }
  .nav_close{
    width: 20px;
  }
  .loginbox{
    display: flex;
    align-items: center;
  }
  .loginbox.el-submenu{
    color: #409EFF;
    width: auto !important;
    font-weight: bold;
  }
  .loginbox .el-submenu__title:hover{
    background-color:transparent !important;
  }
  .loginbox .el-menu--horizontal{
    border-bottom: 0;
  }
  .loginbox .is-opened>.el-submenu__title span{
    color: #838FA9 !important;
  }
  .loginbox .el-menu--horizontal>.el-submenu .el-submenu__title,.loginbox .el-menu--horizontal>.el-submenu.is-active .el-submenu__title{
    border-bottom: 0;
  }
  .el-menu-item.is-active:before{
    display: none;
  }
</style>
<style>
  .loginbox .el-menu--horizontal>.el-submenu.is-active .el-submenu__title{
    border-bottom: 0;
  }

  .login-submenu{
    width: 156px;
    overflow: hidden;
  }
  .login-submenu .el-menu{
    background: #fff !important;
  }
</style>
