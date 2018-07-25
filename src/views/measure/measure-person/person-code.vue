<template>
  <div>
    <div class="searchBox">
      <el-input
        v-model="num"
        maxlength="20"
        class="search-one gap-right"
        placeholder="员工工号"
        style="width: 160px"
      >
      </el-input>
      <el-input
        v-model="name"
        maxlength="20"
        class="search-one gap-right"
        placeholder="员工名称"
        style="width: 160px"
      >
      </el-input>
      <el-date-picker
        v-model="startTime"
        type="date"
        placeholder="开始日期"
      >
      </el-date-picker>
      <span class="text">至</span>
      <el-date-picker
        class="gap-right"
        v-model="endTime"
        type="date"
        placeholder="结束日期"
      >
      </el-date-picker>
      <el-button v-on:click="searchEvt">
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
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80">
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
        prop="email"
        label="员工邮箱"
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
      <el-table-column
        prop="statisticsDate"
        label="统计日期"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          {{getDateTime(scope.row.statisticsDate)}}
        </template>
      </el-table-column>
    </el-table>
    <!--<div class="block footer_nav">
      <span class="other-style">共{{total}}条记录</span>
      <el-pagination
        class="pagination-style"
        @current-change="handleCurrentChange"
        :current-page="pages"
        :page-size="10"
        layout="prev, pager, next,  jumper"
        :total="total">
      </el-pagination>
    </div>-->
  </div>
</template>
<script>
import mixin from '@/mixins/index'
export default {
  data () {
    return {
      loading: false, // 调接口试改为 true
      pages: 1,
      total: 0,
      getDataList: [],
      num: '',
      name: '',
      startTime: '',
      endTime: '',
      queryUrl: 'statistic/listStatisticForEmp'
    }
  },
  created () {
    this.endTime = new Date().getTime()
    this.startTime = new Date().getTime() - 3600 * 1000 * 24 * 7
    this.queryUrl = `statistic/listStatisticForEmp?beginDate=${this.startTime}&endDate=${this.endTime}`
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
    searchEvt () {
      this.queryUrl = 'statistic/listStatisticForEmp'
      let str = '?'
      if (this.endTime && this.startTime) {
        if (this.getTimeCode(this.endTime) < this.getTimeCode(this.startTime)) {
          this.resultInfo('结束时间不能早于开始时间', 'warning')
          return
        }
      }
      if (this.num) {
        str += str === '?' ? 'empNo=' + this.num : '&empNo=' + this.num
      }
      if (this.name) {
        str += str === '?' ? 'empName=' + this.name : '&empName=' + this.name
      }
      if (this.startTime) {
        str += str === '?' ? 'beginDate=' + this.getTimeCode(this.startTime) : '&beginDate=' + this.getTimeCode(this.startTime)
      }
      if (this.endTime) {
        str += str === '?' ? 'endDate=' + (this.getTimeCode(this.endTime) + 86399999) : '&endDate=' + (this.getTimeCode(this.endTime) + 86399999)
      }
      this.queryUrl += str === '?' ? '' : str
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
  .text{
    margin: 8px 5px 0;
  }
</style>
