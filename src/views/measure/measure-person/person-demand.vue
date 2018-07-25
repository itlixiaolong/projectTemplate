<template>
  <div>
    <div class="searchBox">
      <!--版本号-->
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
      <el-input
        v-model="empName"
        :maxlength="20"
        class="search-one gap-right"
        placeholder="员工名称"
        style="width: 160px"
      >
      </el-input>
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
    <div class="table-text">
    </div>
    <div class="clearfix"></div>
    <el-table
      v-loading.body="loading"
      :data="getDataList"
      id="table-default"
      border
      style="width: 100%;margin-bottom: 15px"
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
    </el-table>
  </div>
</template>
<script>
import mixin from '@/mixins/index'
import { getCookie } from 'utils/cookie'
import { getCodedepartment } from '@/api/code/index'

export default {
  data () {
    return {
      vers: '',
      loading: false, // 需要修改
      pages: 1,
      total: 0,
      getDataList: [],
      empName: '',
      labels: '',
      depName: '',
      searchVersion: '',
      platform: '',
      queryUrl: 'jira/listJiraInfoForEmp',
      verUrl: 'projectVersion/getProjectVersionList',
      versionOptions: [], // 版本号
      deptOptions: '', // 部门名称
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
    handleCurrentChange (page) {
      this.pages = page
    },
    changes (e) {
      this.$store.commit('hello', e)
    },
    getData () {
      this.queryUrl = 'jira/listJiraInfoForEmp'
      let str = '?'
      if (this.searchVersion) {
        str += str === '?' ? 'version=' + this.searchVersion : '&version=' + this.searchVersion
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
      let url = this.queryUrl
      this.Api.httpGet(url)
        .then(res => {
          this.getDataList = res.data
          this.loading = false
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
    text-align: left;
  }
</style>
