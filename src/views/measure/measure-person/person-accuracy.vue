<template>
  <div>
    <div class="searchBox">
      <!--版本号-->
      <el-select v-model="version" placeholder="请选择版本号">
        <el-option
          v-for="item in versionp"
          :value="item.projectVersion"
          :key="item.version"
        >
        </el-option>
      </el-select>
      <el-select v-model="depName" placeholder="请选择部门">
        <el-option
          v-for="item in nameObj"
          :value="item.depName"
          :key="item.depName"
        >
        </el-option>
      </el-select>
      <el-button
        @click="searchEvt"
      >
        查询
      </el-button>
    </div>
    <div class="table-text">
    </div>

    <el-table
      v-loading.body="loading"
      :data="getDataList"
      id="table-default"
      border
      style="width: 100%"
      :default-sort = "{prop: 'bugRate', order: 'descending'}"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="70"
      >
      </el-table-column>
      <el-table-column
        prop="version"
        label="版本号"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="empNo"
        label="员工工号"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goTo(scope.row.git_path)">{{scope.row.empNo}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="empName"
        label="员工名称"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="depName"
        label="部门名称"
        header-align="center"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="spent"
        label="实际消耗 （天）"
        header-align="center"
        align="center"
        show-overflow-tooltip
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="estimate"
        label="预估时间 （天）"
        header-align="center"
        align="center"
        show-overflow-tooltip
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="deviation"
        label="偏差时间 （天）"
        header-align="center"
        align="center"
        width="110px"
      >
      </el-table-column>
      <el-table-column
        prop="deviationRate"
        label="估算准确度"
        header-align="center"

        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{scope.row.deviationRate ? (JSON.stringify(scope.row.deviationRate).indexOf('.') >0?scope.row.deviationRate.toFixed(2):scope.row.deviationRate): 0}}
          &nbsp;<span>%</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box clearfix">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagetotle"
        :page-size="pagesize"
        @size-change="sizeChange"
        @current-change="indexChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import mixin from '@/mixins/index'
export default {
  data () {
    return {
      vers: '3.8.3',
      loading: false, // 需要修改
      pages: 1,
      total: 0,
      getdataobj: {},
      getDataList: [],
      empName: '',
      labels: '',
      depName: '',
      empNo: '',
      version: this.$store.state.text,
      platform: '',
      pageindex: 1,
      pagesize: 20,
      pagetotle: 100,
      queryUrl: 'jira/list?',
      nameUrl: 'departSpentSummarys/deptList',
      nameObj: [], // 部门名称
      verUrl: 'projectVersion/getProjectVersionList',
      versionp: '',
      searchProject: '',
      projectOptions: []
    }
  },
  created () {
    this.gets()
    this.getName()
  },
  mixins: [mixin],
  methods: {
    handleCurrentChange (page) {
      this.pages = page
    },
    changes (e) {
      this.$store.commit('hello', e)
    },
    getData () {
      let url = this.queryUrl + '&page=' + this.pageindex + '&rows=' + this.pagesize
      this.Api.httpGet(url)
        .then(res => {
          this.getdataobj = res.data
          this.getDataList = this.getdataobj.list
          this.loading = false
          if (this.pageindex === 1) {
            let summary = res.data.summary
            this.pagesize = summary.rows
            this.pagetotle = summary.countNum
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    gets () { // 版本号
      let url = this.verUrl
      let _this = this
      this.Api.httpGet(url).then(res => {
        var versiondata = res.data
        for (var prop in versiondata) {
          _this.projectOptions.push({'value': prop})
        }
        this.selectOptions = versiondata
        this.searchProject = _this.projectOptions[0].value
        this.versionp = this.selectOptions.toon
        this.version = this.selectOptions.toon[0].projectVersion
        this.queryUrl = `jira/list?version=${this.version}`
        this.getData()
      }).catch(err => {
        console.log(err)
      })
    },
    changeSearchType (val) {
      for (var prop in this.selectOptions) {
        if (prop === val) {
          this.versionp = this.selectOptions[prop]
          this.version = this.selectOptions[prop][0].projectVersion
        }
      }
    },
    getName () { // 部门名称
      let url = this.nameUrl

      this.Api.httpGet(url)
        .then(res => {
          this.nameObj = res.data
          this.nameObj.unshift({'depName': '全部'})
        })
        .catch(err => {
          console.log(err)
        })
    },
    indexChange (val) {
      this.pageindex = val
      this.getData()
    },
    sizeChange (val) {
      this.pagesize = val
      this.getData()
    },
    searchEvt () {
      this.queryUrl = 'jira/list'
      let str = '?'

      if (this.version) {
        str += str === '?' ? 'version=' + this.version : '&version=' + this.version
      }
      if (this.empNo) {
        str += str === '?' ? 'empNo=' + this.empNo : '&empNo=' + this.empNo
      }
      if (this.empName) {
        str += str === '?' ? 'empName=' + this.empName : '&empName=' + this.empName
      }
      if (this.depName && this.depName !== '全部') {
        str += str === '?' ? 'depName=' + this.depName : '&depName=' + this.depName
      }
      if (this.labels) {
        str += str === '?' ? 'labels=' + this.labels : '&labels=' + this.labels
      }
      this.queryUrl += str === '?' ? '' : str
      this.getData()
    },
    linkToDetail (emp) {
      this.$router.push({name: 'personDetail', params: {emp, version: this.version}})
    },
    goTo (val) {
      window.open(val)
    }
  }
}
</script>
<style scoped>
  .searchBox {
    margin-bottom: 10px;
    float: left;
  }
  .pagination-box{
    padding: 20px 0;
    background: #fff;
  }
  .pagination-box .el-pagination{
    float: right;
  }
  .el-table__header{
    width: 1191px !important;
  }
  .el-table__body{
    width: 1186px;
  }
</style>
