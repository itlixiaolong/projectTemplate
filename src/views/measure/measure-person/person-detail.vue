<template>
  <div>
    <el-button @click="goBack" style="margin-bottom: 10px;" class="deta_btn">
      返回
    </el-button>
    <el-table
      v-loading.body="loading"
      :data="getDataList"
      id="table-default"
      border
      style="width: 100%"
    >
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
        prop="version"
        label="版本号"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="projectName"
        label="项目名称"
        header-align="center"
        align="center"
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
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import mixin from '@/mixins/index'
export default {
  data () {
    return {
      loading: true,
      pages: 1,
      total: 0,
      getDataList: [],
      empNo: '',
      version: '',
      queryUrl: 'statistic/listStatisticVersionForEmp'
    }
  },
  created () {
    this.empNo = this.$route.query.emp
    this.version = this.$route.query.version
    this.queryUrl = `statistic/listStatisticVersionForEmp?empNo=${this.empNo}&version=${this.version}`
    this.getData()
  },
  mixins: [mixin],
  methods: {
    handleCurrentChange (page) {
      this.pages = page
    },
    getData () {
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
    goTo (val) {
      window.open(val)
    },
    goBack () {
      window.history.go(-1)
    }
  }
}
</script>
<style scoped>
  .searchBox {
    margin-bottom: 10px;
  }
  .deta_btn{
    float: right;
    width: 10%;
  }
  .el-table--border{margin-bottom: 15px;}
</style>
