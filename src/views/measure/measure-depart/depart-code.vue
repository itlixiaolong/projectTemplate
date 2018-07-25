<template>
  <div>
    <div class="menu_new">
      <div class="menu-left">
        <el-select class="gap-right" v-model="searchDept" placeholder="请选择部门" :disabled="roleId !== '1'">
          <el-option
            v-for="(item,index) in deptOptions"
            :key="index"
            :label="item.depName"
            :value="item.depCode"
          >
          </el-option>
        </el-select>
        <el-date-picker
          v-model="startTime"
          type="date"
          placeholder="开始日期"
        >
        </el-date-picker>
        <span class="linsap">至</span>
        <el-date-picker
          class="gap-right"
          v-model="endTime"
          type="date"
          placeholder="结束日期"
        >
        </el-date-picker>
        <el-button
          @click="searchEvt"
        >
          查询
        </el-button>
        <el-button
          @click="routerLink"
        >
          查看统计图
        </el-button>
      </div>
    </div>
    <!--id="table-default"-->
    <div class="clearfix"></div>
    <el-table
      v-loading.body="loading"
      :data="getDataList"
      border
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="depName"
        label="部门名称"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="lineP"
        label="增加行"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="lineM"
        label="删除行"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="lineAll"
        label="总行数"
        header-align="center"
        align="center"
      >
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import mixin from '@/mixins/index'
import { getTimeCode } from 'utils/date'
import { getCookie } from 'utils/cookie'
import { getCodedepartment } from '@/api/code/index'

export default {
  data () {
    return {
      loading: false, // 调接口改成 true
      showDetail: false,
      pages: 1,
      total: 0,
      getDataList: [],
      form: {
        depCode: '',
        beginDate: '',
        endDate: ''
      },
      startTime: '',
      endTime: '',
      searchDept: '',
      deptOptions: [],
      queryUrl: 'statistic/listStatistic',
      roleId: ''
    }
  },
  created () {
    let obj = Object.assign({}, this.$route.params)
    if (!obj.hasOwnProperty('status')) {
      this.endTime = new Date().getTime()
      this.startTime = new Date().getTime() - 3600 * 1000 * 24 * 7
    } else {
      this.endTime = this.$route.params.endTime
      this.startTime = this.$route.params.startTime
    }

    this.queryUrl = 'statistic/listStatistic'
    let str = '?'

    if (this.startTime) {
      str += str === '?' ? 'beginDate=' + this.getTimeCode(this.startTime) : '&beginDate=' + this.getTimeCode(this.startTime)
    }
    if (this.endTime) {
      str += str === '?' ? 'endDate=' + this.getTimeCode(this.endTime) : '&endDate=' + this.getTimeCode(this.endTime)
    }
    this.queryUrl += str === '?' ? '' : str
    this.getData()
    this.gets()
    this.roleId = JSON.parse(getCookie('userinfo')).roleId
    this.searchDept = JSON.parse(getCookie('userinfo')).depCode
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
    gets () { // 部门名称
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
      this.queryUrl = 'statistic/listStatistic'
      let str = '?'

      if (this.endTime && this.startTime) {
        if (this.getTimeCode(this.endTime) < this.getTimeCode(this.startTime)) {
          this.resultInfo('结束时间不能早于开始时间', 'warning')
          return
        }
      }
      if (this.searchDept && this.searchDept !== '全部') {
        str += str === '?' ? 'depCode=' + this.searchDept : '&depCode=' + this.searchDept
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
      return getTimeCode(val)
    },
    routerLink () {
      this.$router.push({name: '统计图', params: {endTime: this.getTimeCode(this.endTime), startTime: this.getTimeCode(this.startTime)}})
    }
  }
}
</script>
<style scoped>
  .searchBox {
    margin-bottom: 10px;
    float: left;
  }
  .el-table .cell{
    padding: 10px 0 !important;
  }
  .el-table td, .el-table th{
    padding: 12px 0 !important;
  }
  .linsap{
    margin: 8px 5px 0 5px;
  }
</style>
