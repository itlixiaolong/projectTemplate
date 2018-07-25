<template>
  <div>
    <!--用户管理上部分start-->
    <div class="menu_new">
      <div class="menu-left">
      <el-select class="gap-right" v-model="searchDept" value-key="depCode" placeholder="请选择部门">
        <el-option
          v-for="(item,index) in deptOptions"
          :value="item.value"
          :key="index"
          :label="item.label"
        >
        </el-option>
      </el-select>
      <el-input v-model="projectName"
                placeholder="请输入项目名称"
                class="gap-right"
                maxlength="20"
                style="width: 203px;">

      </el-input>
      <el-input v-model="jenkinsJobName"
                placeholder="请输入job名称"
                class="gap-right"
                maxlength="20"
                style="width: 203px;">
      </el-input>
      <el-button
        @click="searchEvt"
      >
        查询
      </el-button>

      </div>
      <div class="menu-right">
        <el-button
          class="createBtn"
          @click="createEvt()"
          type="primary"
          :disabled="!functions.createpipline"
        >
          创建流水线
        </el-button>
      </div>
    </div>
    <!--用户管理上部分end-->
    <el-table
      v-loading.body="loading"
      ref="multipleTable"
      element-loading-text="拼命加载中..."
      :data="getDataList"
      tooltip-effect="dark"
      style="width: 100%;margin-top: 12px"
      border
      center
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        align="center">
      </el-table-column>
      <el-table-column
        label="序号"
        align="center"
        width="80"
        type="index"
        :index="indexMethod"
      >
      </el-table-column>
      <el-table-column
        prop="jenkinsJobName"
        label="job"
        align="center"
        width="120"
      >
      </el-table-column>
      <el-table-column
        prop="projectName"
        label="项目名称"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="totalBuildTimes"
        label="构建次数"
        align="center"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="failureRate"
        label="失败率"
        align="center"
        width="80"
      >
      </el-table-column>
      <el-table-column
        prop="depName"
        label="所属部门"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间"
        align="center"
        width="220"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="jenkin(scope.row.jenkinsJobUrl)" :disabled="!functions.jenkins">
           JenKins
          </el-button>
          <el-button type="text" size="small" @click="recor(scope.row.jenkinsJobName)" :pushUrl="url" :disabled="!functions.record">构建记录</el-button>
          <el-tooltip placement="top" effect="light" :disabled="flag" :open-delay = '500'>
            <div slot="content" style="width:400px" class="stepshov">
              <el-steps :active="6" :align-center="true">
                <el-step  v-for="(item, index) in PipelineNodeNames" :title="item" :key="index"></el-step>
              </el-steps>
            </div>
            <span class="nodeText" @click="nodemanag(scope.row.jenkinsJobName)" @mouseover="nodeFn(scope.row.jenkinsJobName)" :disabled="!functions.nodesManage">节点管理</span>
          </el-tooltip>

        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-box clearfix">
      <el-pagination
        v-if="pagetotle>1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagetotle"
        :page-size="pagesize"
        :current-page="pageindex"
        @size-change="sizeChange"
        @current-change="indexChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins'
import { getFunctions } from 'utils/getFunctions'
import {getPipelinelist, getNodemanagement} from '../../api/pipeLine/index'
import {getCodedepartment} from '../../api/code/index'
export default{
  mixin: [mixin],
  data () {
    return {
      loading: true,
      deptNumber: '',
      jobName: '',
      deptOptions: [],
      searchDept: '',
      getDataList: [],
      multipleSelection: [],
      depCode: '',
      projectName: '',
      jenkinsJobName: '',
      pageindex: 1,
      pagesize: 20,
      pagetotle: 0,
      url: '',
      PipelineNodeNames: [],
      flag: true,
      functions: ''
    }
  },
  created () {
    this.functions = getFunctions(this)
    this.projectName = this.$route.params.projectName === 'default' ? '' : this.$route.params.projectName
    this.getData(this.projectName)
    this.getDeptOptions()
  },
  methods: {
    indexMethod (index) {
      return (this.pageindex - 1) * this.pagesize + index
    },
    getData () {
      let params = {
        page: this.pageindex,
        depCode: this.searchDept.depCode,
        projectName: this.projectName === 'default' ? '' : this.projectName,
        jenkinsJobName: this.jenkinsJobName
      }
      getPipelinelist(params).then((res) => {
        this.getDataList = res.data.data
        this.pagetotle = res.data.paging.total
        this.loading = false
        if (this.projectName) {
          if (!res.data.data.length) {
            this.$message.warning('暂未找到创建的流水线，出门左转创建页面去新建。。。')
          }
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    listItem (name, value) {
      var obj = {}
      obj.value = value
      obj.label = name
      return obj
    },
    getDeptOptions () { // 获取部门
      getCodedepartment().then((res) => {
        let deptdata = res.data.data
        for (var i = 0; i < deptdata.length; i++) {
          this.deptOptions.push(this.listItem(deptdata[i].depName, {depCode: deptdata[i].depCode, depName: deptdata[i].depName}))
        }
        this.deptOptions.unshift(this.listItem('全部', '0'))
      }).catch(err => {
        console.log(err)
      })
    },
    // 搜索
    searchEvt () {
      this.getData()
      this.pageindex = 1
    },
    jenkin (url) { // jenkin
      window.open(url)
    },
    recor (name) { // 构建记录跳转
      this.$router.push({
        path: '/pipeline-construct/' + name
      })
    },
    nodemanag (val) { // 节点管理
      this.$router.push({
        path: `/pipeline-create/${val}`
      })
    },
    createEvt () { // 创建流水线按钮
      this.$router.push({
        path: `/pipeline-create/default`
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 分页相关方法
    indexChange (val) {
      this.pageindex = val
      this.getData()
    },
    sizeChange (val) {
      this.pagesize = val
      this.getData()
    },
    nodeFn (val) { // 节点管理划过方法
      this.PipelineNodeNames = []
      this.flag = true
      getNodemanagement(val).then((res) => {
        if (res.data.code === 200) {
          this.PipelineNodeNames = res.data.data.PipelineNodeNames
          if (this.PipelineNodeNames.length > 0) {
            this.flag = false
          }
        }
      })
    }
  },
  watch: {
    '$route' (to) {
      if (to.params.projectName === 'default') {
        this.projectName = ''
        this.getData()
      }
    }
  }
}
</script>

<style scoped>
  .menu_list{
    text-align: left;
  }
  .pagination-box{
    padding: 20px 0;
    background: #fff;
  }
  .pagination-box .el-pagination{
    float: right;
  }
  .el_btnurl{
    color:#409EFF;
    text-decoration:none;
    font-size: 13px;
  }
  .el_btnurl:hover{
    color:#409EFF;
  }
  .nodeText{
    font-size: 13px;
    margin-left: 10px;
    cursor:pointer;
    color:#409EFF;
  }
  .nodeText:hover{color:#409EFF}
  .createBtn{
    float: right;
  }
</style>
<style>
  .el-step is-horizontal{
    flex-basis: 100px !important;
  }
 .stepshov .el-step__title.is-wait{
   color:#409EFF;
 }
</style>
