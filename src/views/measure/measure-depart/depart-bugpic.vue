<template>
  <div>
    <div class="menu_new">
      <!--placeholder="版本号"-->
      <div class="menu-left">
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
        <el-button
          @click="searchEvt"
        >
          查询
        </el-button>
        <el-button
          @click="linkBack"
        >
          返回统计表
        </el-button>
        <el-button
          v-if="status === 1"
          @click="changeBtn(1)"
        >
          查看新增行bug率
        </el-button>
        <el-button
          v-if="status === 2"
          @click="changeBtn(2)"
        >
          查看总行bug率
        </el-button>
      </div>
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
      vers: '3.8.3',
      version: this.$store.state.text,
      his: '',
      status: 1,
      hisOption: [],
      hisData: [],
      hisRateData: [],
      hisPluRateData: [],
      verUrl: 'projectVersion/getProjectVersionList',
      versionp: '',
      searchProject: '',
      projectOptions: []
    }
  },
  methods: {
    drawHis (id) {
      let colors = ['#5793f3', '#d14a61']
      this.his = echarts.init(document.getElementById(id))
      this.his.setOption({
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'cross' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          data: ['bug 数', 'bug 率']
        },
        xAxis: [
          {
            type: 'category',
            data: this.hisOption
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'bug 数',
            min: 0,
            max: 400,
            interval: 80,
            position: 'left',
            axisLine: {
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: 'bug 率',
            min: 0,
            max: this.status === 1 ? 1 : 5,
            position: 'right',
            axisLine: {
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} ‰'
            }
          }
        ],
        series: [
          {
            name: 'bug数',
            type: 'bar',
            barWidth: '20%',
            data: this.hisData
          },
          {
            name: 'bug率',
            type: 'bar',
            barWidth: '20%',
            data: this.status === 1 ? this.hisRateData : this.hisPluRateData,
            yAxisIndex: 1
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
            this.hisData.push(val.bugCount)
            this.hisRateData.push(Number(val.bugRate))
            this.hisPluRateData.push(Number(val.bugRateForLineP))
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
        this.queryUrl = `bugrate/listBugRateForDep?version=${this.version}`
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
    searchEvt () {
      this.queryUrl = 'bugrate/listBugRateForDep'
      let str = '?'

      if (this.version) {
        str += str === '?' ? 'version=' + this.version : '&version=' + this.version
      }
      this.queryUrl += str === '?' ? '' : str
      this.getData()
    },
    // 获取时间戳
    getTimeCode (val) {
      return this.Api.getTimeCode(val)
    },
    changeBtn (num) {
      this.status = num === 1 ? 2 : 1
      this.$nextTick(() => {
        this.drawHis('histogram')
      })
    },
    linkBack () {
      this.$router.push({name: '千行代码BUG率'})
    }
  },
  changes (e) {
    this.$store.commit('hello', e)
  },
  // 调用
  mounted () {
    this.gets()
  }
}
</script>
<style>
  .searchBox {
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-start;
  }
</style>
