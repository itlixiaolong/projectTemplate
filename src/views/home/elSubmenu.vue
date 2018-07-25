<template>
    <div>
          <!--一级-->
        <el-submenu style="{'width':width}" v-for="(item,indexs) in routerList" :key='indexs' :index='item.name' v-if="indexs !=0">
        <template slot="title">
            <div class="box_left">
            <i :class="'iconfont' +' '+ icons[indexs-1]"></i>
            <span class="tits">{{item.name}}</span>
            </div>
        </template>
        <el-menu-item-group>
          <!--二级-->
            <el-menu-item v-for="(v,i) in item.children" :key='i' :index='indexs +"-"+i' :route="{path:v.path}" v-if='v.children.length === 0'  class="el_er">
                <div>{{v.name}}</div>
            </el-menu-item>
        </el-menu-item-group>
        <el-submenu v-for="(v,i) in item.children" :key='i' :index='indexs +"-"+i' v-if='v.children.length > 0' class="level_item">
            <template slot="title">
              <div>
                  {{v.name}}
              </div>
            </template>
            <el-menu-item v-for="(v,index) in v.children" :route='{path:v.path}' :index=' indexs+"-"+i+"-"+index' class="nav_san" :key="index">
              <span>
                 {{v.name}}
              </span>
            </el-menu-item>
        </el-submenu>
        </el-submenu>
    </div>
</template>
<script>

export default {
  name: 'elSubmenus',
  props: ['width', 'isCollapse', 'routerList'],
  data () {
    return {
      icons: ['icon-suyaniconchanpinleibufenzuodaohangbufen87', 'icon-yuangongliebiao', 'icon-quanxianguanli1', 'icon-xiangmuguanli', 'icon-xiangmutixi', 'icon-zhibiaotongji'],
      routerData: ''
    }
  },
  methods: {
  }
}
</script>
<style scoped>
</style>
