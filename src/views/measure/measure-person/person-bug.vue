<template>
  <div>
    <div class="searchBox">
      <el-select class="gap-right" v-model="searchProject" placeholder="请选择项目" @change="changeSearchType">
        <el-option
          v-for="item in projectOptions"
          :key="item.value"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-select class="gap-right" v-model="version" placeholder="请选择版本号">
        <el-option
          v-for="item in versionp"
          :value="item.projectVersion"
          :key="item.version"
        >
        </el-option>
      </el-select>
      <el-input
        v-model="name"
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
        prop="name"
        label="员工名称"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="jobDesc"
        label="职位描述"
        header-align="center"
        align="center"
        show-overflow-tooltip
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
        prop="lineP"
        label="增加行"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="lineM"
        label="删除行"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="lineAll"
        label="总行数"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="linkToDetail(scope.row.empNo)">{{scope.row.lineAll}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="bugCount"
        label="bug数"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="goTo(scope.row.jiraBugPath)">{{scope.row.bugCount}}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="bugRateForLineP"
        label="增行bug率"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{scope.row.bugRateForLineP ? scope.row.bugRateForLineP : 0}}
        </template>
      </el-table-column>
      <el-table-column
        prop="bugRate"
        label="bug率"
        header-align="center"
        align="center"
        sortable
        show-overflow-tooltip
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
      loading: false,
      pages: 1,
      total: 0,
      getDataList: [],
      vers: '3.8.3',
      version: this.$store.state.text,
      name: '',
      depName: '',
      bugCount: '',
      bugRate: '',
      queryUrl: 'bugrate/listBugRateForEmp',
      deptOptions: '', // 部门名称
      verUrl: 'projectVersion/getProjectVersionList',
      versionp: '',
      searchProject: '',
      selectOptions: [],
      projectOptions: [],
      roleId: ''
    }
  },
  created () {
    this.get()
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
      this.queryUrl = 'bugrate/listBugRateForEmp'
      let str = '?'
      if (this.version) {
        str += str === '?' ? 'version=' + this.version : '&version=' + this.version
      }
      if (this.name) {
        str += str === '?' ? 'name=' + this.name : '&name=' + this.name
      }
      if (this.depName && this.depName !== '全部') {
        str += str === '?' ? 'depName=' + this.depName : '&depName=' + this.depName
      }
      if (this.bugCount) {
        str += str === '?' ? 'bugCount=' + this.bugCount : '&bugCount=' + this.bugCount
      }
      if (this.bugRate) {
        str += str === '?' ? 'bugRate=' + this.bugRate : '&bugRate=' + this.bugRate
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
    get () { // 版本号
      let url = this.verUrl
      let _this = this
      this.Api.httpGet(url).then(res => {
        var versiondata = res.data
        for (var prop in versiondata) {
          _this.projectOptions.push({'value': prop})
        }
        this.selectOptions = versiondata
        this.searchProject = _this.projectOptions[0].value

        // 获取第一个项目的版本信息
        function getFirstAtt (data) {
          for (var key in data) {
            return data[key]
          }
        }
        let firstAtt = getFirstAtt(this.selectOptions)
        this.versionp = firstAtt
        this.version = firstAtt[0].projectVersion
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
      this.pageIndex = 1
      this.loading = true
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
    },
    linkToDetail (emp) {
      this.$router.push({
        // name:'代码详细列表',
        path: '/person-detail',
        query: {emp, version: this.version}
      })
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
  .el-table--border{margin-bottom: 15px;}
</style>
