<template>
  <div>
    <el-table
            v-loading.body="loading"
            :data="getDataList"
            border
            style="width: 100%;"
    >
      <el-table-column
              label="序号"
              type="index"
              header-align="center"
              align="center"
              width="100"
      >
      </el-table-column>
      <el-table-column
              label="buildNum"
              prop="buildId"
              header-align="center"
              align="center"
      >
      </el-table-column>
      <el-table-column
            label="触发用户"
            prop="triggerUserName"
            header-align="center"
            align="center"
      >
        <template>
          <router-link to="http://172.28.18.79:8080/jenkins/job/ZJC_Java-IEPlatform_java_1/3">
          </router-link>
        </template>
      </el-table-column>
      <el-table-column
              label="构建状态"
              prop="status"
              header-align="center"
              align="center"
      >
      </el-table-column>
      <el-table-column
              label="构建时间"
              prop="keepTime"
              header-align="center"
              align="center"
              width="90"
      >
        <template slot-scope="scope"><span>{{(scope.row.keepTime/60000).toFixed()}}</span></template>
      </el-table-column>
      <el-table-column
              label="开始时间"
              prop="startTime"
              header-align="center"
              align="center"
              sortable
              width="210"
      >
        <template slot-scope="scope"><span v-fomatTime="scope.row.startTime"></span></template>
      </el-table-column>
      <el-table-column
              label="结束时间"
              prop="endTime"
              header-align="center"
              align="center"
              sortable
              width="210"
      >
        <template slot-scope="scope"><span v-fomatTime="scope.row.endTime"></span></template>
      </el-table-column>
      <el-table-column
              label="操作"
              header-align="center"
              align="center"
              width="240"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="modifyEvt(scope.row)">
            <a :href="scope.row.logUrl" target="_blank" class="el_btnurl">构建日志</a>
          </el-button>
          <el-button type="text" size="small" @click="changeEvt(scope.row.id)">代码变更记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box clearfix">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagetotle"
        :page-size="pagesize"
        :current-page="pageindex"
        @size-change="sizeChange"
        @current-change="indexChange"
      >
      </el-pagination>
    </div>
    <!--&lt;!&ndash;弹出层&ndash;&gt;-->
    <!--<newlist v-if="showDialog" :dialog-title="dialogTitle" :pushUrl="url" :show-dialog='showDialog' dialogWidth='80%'  labelWidth='90px' :params="params" v-on:newPagefn='newPagefn'>-->
    <!--</newlist>-->
  </div>
</template>
<script>
import mixin from '@/mixins/index'
// import newlist from '@/views/pipeline/shell/shell-logs'
import { getBuildrecor } from '../../api/code/index'
export default {
  name: 'pipeline-construct',
  components: {
    // newlist
  },
  data () {
    return {
      dialogTitle: '构建日志',
      loading: false,
      showDialog: false,
      modifyIndex: -1,
      modifyData: [],
      params: {
        labelWidth: '80'
      },
      getDataList: [],
      url: '',
      pageindex: 1,
      pagesize: 20,
      pagetotle: 0,
      jobName: ''
    }
  },
  mixins: [mixin],
  created () {
    this.jobName = this.$route.params.name
    this.getData()
  },
  methods: {
    getData () {
      let params = {
        pageSize: this.pagesize,
        page: this.pageindex,
        jobName: this.jobName
      }
      getBuildrecor(params).then((res) => {
        this.getDataList = res.data.data
        this.pagetotle = res.data.paging.totalPages
      })
    },
    modifyEvt (val) { // 构建日志
      this.newPagefn()
      this.url = val
    },
    changeEvt (id) { // 代码变更
      this.$router.push({
        path: '/pipeline-changelog/' + id
      })
    },
    newPagefn () { // 构建日志弹层
      if (this.showDialog) {
        this.showDialog = false
      } else {
        this.showDialog = true
      }
    },
    // 分页相关方法
    indexChange (val) {
      this.pageindex = val
      this.getData()
    },
    sizeChange (val) {
      this.pagesize = val
      this.getData()
    }
  },
  computed: {
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
  .searchBox {
    margin-bottom: 10px;
    float: left;
  }
  .el-table .cell {
    padding: 10px 0 !important;
  }

  .el-table td, .el-table th {
    padding: 12px 0 !important;
  }

  .linsap {
    margin: 8px 5px 0 5px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
  .fl-right {
    float: right;
  }
  .el_btnurl{
    color:#666666;
    text-decoration:none;
  }
  .el_btnurl:hover{
    color:#409EFF;
  }
  .pagination-box{
    padding: 20px 0;
    background: #fff;
  }
  .pagination-box .el-pagination{
    float: right;
  }
</style>
