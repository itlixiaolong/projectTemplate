<template>
  <!--部门数据==查看数据表-->
  <div>
        <div class="searchBox">
      <el-date-picker
        v-model="startTime"
        type="date"
        placeholder="开始日期"
      >
      </el-date-picker>
      <span class="linsap">至</span>
      <el-date-picker
        v-model="endTime"
        class="gap-right"
        type="date"
        placeholder="结束日期"
      >
      </el-date-picker>
      <el-button
        @click="searchEvt"
        class="gap-right"
      >
        查询
      </el-button>
       <el-button
        @click="routerLink"
      >
        返回统计表
      </el-button>
      <el-button
        v-if="status === 1"
        @click="changeBtn(1)"
      >
        查看新增行代码量
      </el-button>
      <el-button
        v-if="status === 2"
        @click="changeBtn(2)"
      >
        查看总行代码量
      </el-button>
    </div>
    <div id="histogram" style="width: 100%;height: 500px;"></div>
  </div>
</template>
<script>
import echarts from 'echarts'

export default {
  data () {
    return {
      queryUrl: 'statistic/listStatistic',
      status: 1,
      name: '',
      startTime: '',
      endTime: '',
      his: '',
      hisOption: [],
      hisData: [],
      hisDataP: []
    }
  },
  methods: {
    drawHis (id) {
      this.his = echarts.init(document.getElementById(id))
      this.his.setOption({
        color: ['#3398DB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: { //  坐标轴指示器，坐标轴触发有效
            type: 'shadow' //  默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            name: '部 门',
            data: this.hisOption,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '代 码 量'
          }
        ],
        series: [
          {
            name: '代码量',
            type: 'bar',
            barWidth: '60%',
            data: this.status === 1 ? this.hisData : this.hisDataP
          }
        ]
      })
    },
    getData () {
      let url = this.queryUrl
      this.Api.httpGet(url)
        .then(res => {
          this.hisData = []
          this.hisOption = []
          let arr = res.data
          arr.map((val) => {
            this.hisData.push(val.lineAll)
            this.hisDataP.push(val.lineP)
            this.hisOption.push(val.depName)
          })
          this.$nextTick(() => {
            this.drawHis('histogram')
          })
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
    routerLink () {
      this.$router.push({name: '每天代码行', params: {endTime: this.getTimeCode(this.endTime), startTime: this.getTimeCode(this.startTime), status: '1'}})
    },
    changeBtn (num) {
      this.status = num === 1 ? 2 : 1
      this.$nextTick(() => {
        this.drawHis('histogram')
      })
    }
  },
  // 调用
  mounted () {
    this.endTime = this.$route.params.endTime
    this.startTime = this.$route.params.startTime
    this.queryUrl = `statistic/listStatistic`
    let str = '?'
    if (this.startTime) {
      str += str === '?' ? 'beginDate=' + this.getTimeCode(this.startTime) : '&beginDate=' + this.getTimeCode(this.startTime)
    }
    if (this.endTime) {
      str += str === '?' ? 'endDate=' + this.getTimeCode(this.endTime) : '&endDate=' + this.getTimeCode(this.endTime)
    }
    this.queryUrl += str === '?' ? '' : str
    this.getData()
  }
}
</script>
<style>
  .searchBox {
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
  }
  .linsap{
    margin: 8px 5px 0 5px;
  }
</style>
