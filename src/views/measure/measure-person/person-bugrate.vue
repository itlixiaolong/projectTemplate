<template>
  <div>
    <div class="searchBox">
      <!--placeholder="版本号"-->
      <el-select class="gap-right" v-model="searchProject" placeholder="请选择项目" @change="changeSearchType">
        <el-option
          v-for="item in projectOptions"
          :key="item.value"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select class="gap-right" v-model="searchVersion" placeholder="请选择版本号">
        <el-option
          v-for="item in versionOptions"
          :value="item.projectVersion"
          :key="item.projectVersion"
        >
        </el-option>
      </el-select>
      <el-select class="gap-right" v-model="searchDept" placeholder="请选择部门" :disabled="roleId !== '1'">
        <el-option
          v-for="(item,index) in deptOptions"
          :key="index"
          :label="item.depName"
          :value="item.depCode"
        >
        </el-option>
      </el-select>
      <el-button
        @click="searchEvt"
      >
        查询
      </el-button>
    </div>
    <div class="clearfix"></div>
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
        width="80">
      </el-table-column>
      <el-table-column
        prop="version"
        label="版本号"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="depName"
        label="部门名称"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="empNo"
        label="员工工号"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="员工姓名"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="efficient"
        label="可用工时"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="bugCount"
        label="bug数"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="bugRate"
        label="bug产出率"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{scope.row.bugRate ? (JSON.stringify(scope.row.bugRate).indexOf('.') > 0 ? scope.row.bugRate.toFixed(2): scope.row.bugRate) : 0}}
          &nbsp;<span>%</span>
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
  </div>
</template>
<script>
import mixin from '@/mixins/index'
import { getCookie } from 'utils/cookie'
import { getCodedepartment } from '@/api/code/index'

export default {
  data () {
    return {
      loading: false,
      pages: 1,
      total: 0,
      getdataObj: {},
      getDataList: [],
      depName: '',
      searchVersion: '',
      pageindex: 1,
      pagesize: 14,
      pagetotle: 100,
      queryUrl: 'bugrate/list',
      deptOptions: '', // 部门名称
      verUrl: 'projectVersion/getProjectVersionList',
      versionOptions: [],
      searchProject: '',
      projectOptions: [],
      roleId: ''
    }
  },
  created () {
    this.gets()
    this.getName()
    this.roleId = JSON.parse(getCookie('userinfo')).roleId
    this.searchDept = JSON.parse(getCookie('userinfo')).depCode
  },

  mixins: [mixin],
  methods: {
    changes (e) {
      this.$store.commit('hello', e)
    },
    indexChange (val) {
      this.pageindex = val
      this.getData()
    },
    sizeChange (val) {
      this.pagesize = val
      this.getData()
    },
    getData () {
      this.queryUrl = 'bugrate/list'
      let str = '?'

      if (this.searchVersion) {
        str += str === '?' ? 'version=' + this.searchVersion : '&version=' + this.searchVersion
      }
      if (this.depName && this.depName !== '全部') {
        str += str === '?' ? 'depName=' + this.depName : '&depName=' + this.depName
      }
      if (this.pageindex) {
        str += str === '?' ? 'page=' + this.pageindex : '&page=' + this.pageindex
      }
      if (this.pagesize) {
        str += str === '?' ? 'rows=' + this.pagesize : '&rows=' + this.pagesize
      }
      this.queryUrl += str === '?' ? '' : str
      let url = this.queryUrl
      this.Api.httpGet(url)
        .then(res => {
          this.getdataObj = res.data
          this.getDataList = this.getdataObj.list
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
        // 获取第一个项目的版本信息
        function getFirstAtt (data) {
          for (var key in data) {
            return data[key]
          }
        }
        let firstAtt = getFirstAtt(this.selectOptions)
        this.versionOptions = firstAtt
        this.searchVersion = firstAtt[0].projectVersion
        _this.searchProject = _this.projectOptions[0].value
        this.getData()
      }).catch(err => {
        console.log(err)
      })
    },
    changeSearchType (val) {
      for (var prop in this.selectOptions) {
        if (prop === val) {
          this.versionOptions = this.selectOptions[prop]
          this.searchVersion = this.selectOptions[prop][0].projectVersion
        }
      }
    },
    getName () { // 部门名称
      getCodedepartment()
        .then(res => {
          this.deptOptions = res.data.data
          this.deptOptions.unshift({depName: '全部', depCode: ''})
        })
        .catch(err => {
          console.log(err)
        })
    },
    searchEvt () {
      this.pageindex = 1
      this.getData()
    },
    // 获取时间戳
    getTimeCode (val) {
      return this.Api.getTimeCode(val)
    },
    getDateTime (val) {
      let str = ''
      let times = new Date(Number(val))
      str += times.getFullYear() + '-'
      str += (times.getMonth() + 1) + '-'
      str += times.getDate()
      return str
    }
  }
}
</script>
<style scoped>
  .searchBox {
    margin-bottom: 10px;
    float: left;
  }
  .el-table tr{
    padding:0 !important;
  }
  .el-table th{
    padding: 0 !important;
  }
  .pagination-box{
    padding: 20px 0;
    background: #fff;
  }
  .pagination-box .el-pagination{
    float: right;
  }
</style>
