<template>

  <div>
    <div class="menu-list clearfix">
      <div class="searchBox">
        <template>
          <el-select class="gap-right" v-model="searchvalue" @change="changeSearchType">
            <el-option
              v-for="item in searchvalueoptions"
              :key="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select class="gap-right" v-if="searchtype == 'chart4version'" v-model="searchProject" placeholder="请选择项目名称" @change="changeSearchProject">
            <el-option
              v-for="item in projectOptions"
              :key="item.value"
              :value="item.value"
              :data-id="item.id"
            >

            </el-option>
          </el-select>
          <el-select class="gap-right" v-if="searchtype == 'chart4version'" v-model="searchParamValue" :placeholder="paramPlaceholder" @change="changeSearchParam">
          <el-option
            v-for="item in searchParamoptions"
            :key="item.projectVersion"
            :value="item.projectVersion"
            :data-id="item.id"
          >

          </el-option>
        </el-select>
          <el-select class="gap-right" v-if="searchtype == 'chart4dept'" v-model="searchParamValue" :placeholder="paramPlaceholder" @change="changeSearchParam">
            <el-option
              v-for="item in searchParamoptions"
              :key="item.value"
              :value="item.value"
              :data-id="item.id"
            >

            </el-option>
          </el-select>
        </template>
        <el-button
          @click="searchEvt"
        >
          查询
        </el-button>
        <el-button
          @click="tableChanChart"
        >
          {{btnText}}
        </el-button>
      </div>
    </div>
    <el-table
      v-if="showTableData"
      v-loading.body="loading"
      element-loading-text="拼命加载中..."
      :data="getDataList"
      border
      style="width: 100%;margin-bottom: 15px"
    >
      <el-table-column
        v-if="showDept"
        label="部门名称"
        prop="deptNames"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        v-if="!showDept"
        label="项目版本"
        prop="versions"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="BUG数(个)"
        prop="bugNum"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{scope.row.bugNum ? (JSON.stringify(scope.row.bugNum).indexOf('.') > 0 ? scope.row.bugNum.toFixed(2): scope.row.bugNum) : 0}}
        </template>
      </el-table-column>
      <el-table-column
        label="BUG产出率(%)"
        prop="bugRate"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{scope.row.bugRate ? (JSON.stringify(scope.row.bugRate).indexOf('.') > 0 ? scope.row.bugRate.toFixed(2): scope.row.bugRate) : 0}}
          <span>%</span>
        </template>
      </el-table-column>
      <el-table-column
        label="新增行BUG率(%)"
        prop="bugRateAddLine"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{scope.row.bugRateAddLine ? (JSON.stringify(scope.row.bugRateAddLine).indexOf('.') > 0 ? scope.row.bugRateAddLine.toFixed(2): scope.row.bugRateAddLine) : 0}}
          <span>%</span>
        </template>
      </el-table-column>
      <el-table-column
        label="总BUG率(%)"
        prop="bugRateLine"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{scope.row.bugRateLine ? (JSON.stringify(scope.row.bugRateLine).indexOf('.') > 0 ? scope.row.bugRateLine.toFixed(2): scope.row.bugRateLine) : 0}}
          <span>%</span>
        </template>
      </el-table-column>
      <el-table-column
        label="团队负荷率(%)"
        prop="cafacity"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{scope.row.cafacity ? (JSON.stringify(scope.row.cafacity).indexOf('.') > 0 ? scope.row.cafacity.toFixed(2): scope.row.cafacity) : 0}}
          <span>%</span>
        </template>
      </el-table-column>
      <el-table-column
        label="日均代码行(行)"
        prop="codeRate"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{scope.row.codeRate ? (JSON.stringify(scope.row.codeRate).indexOf('.') > 0 ? scope.row.codeRate.toFixed(2): scope.row.codeRate) : 0}}
        </template>
      </el-table-column>
      <el-table-column
        label="估算偏差率(%)"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{scope.row.deviation ? (JSON.stringify(scope.row.deviation).indexOf('.') > 0 ? scope.row.deviation.toFixed(2): scope.row.deviation) : 0}}
          <span>%</span>
        </template>
      </el-table-column>
      <el-table-column
        label="蔓延率(%)"
        prop="detailRate"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{scope.row.detailRate ? (JSON.stringify(scope.row.detailRate).indexOf('.') > 0 ? scope.row.detailRate.toFixed(2): scope.row.detailRate) : 0}}
          <span>%</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="bugRate4Testcase"
        label="用例数bug率(%)"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{scope.row.bugRate4Testcase ? (JSON.stringify(scope.row.bugRate4Testcase).indexOf('.') > 0 ? scope.row.bugRate4Testcase.toFixed(2): scope.row.bugRate4Testcase) : 0}}
          <span>%</span>
        </template>
      </el-table-column>
      <el-table-column
        label="可用工时(天)"
        prop="efficient"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        label="预估时间(天)"
        prop="estimate"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        label="实际时间(天)"
        prop="spent"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
    </el-table>
    <div :class="className" :id="id" v-if="!showTableData" :style="{height:height,width:width}" ref="myEchart">
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  props: {
    className: {
      type: String,
      default: 'yourClassName'
    },
    id: {
      type: String,
      default: 'yourID'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    }
  },
  data () {
    return {
      showTableData: true,
      showDept: true,
      loading: false,
      pagetotle: 1000,
      getDataList: [],
      selectOptions: [],
      versionOptions: [],
      projectOptions: [],
      deptOptions: [],
      paramPlaceholder: '',
      searchvalueoptions: [{
        value: '按部门显示图表'
      }, {
        value: '按项目显示图表'
      }],
      searchProject: '',
      searchParamoptions: [],
      searchvalue: '按项目显示图表',
      searchtype: 'chart4version',
      searchParamValue: '',
      searchParam: '',
      btnText: '查看统计图',
      chart: null,
      title: {},
      xdata: [],
      seriesdata: [],
      legend: []
    }
  },
  methods: {
    getData () {
      this.loading = true
      // 加载原始数据
      this.getDataList = []
      if (this.searchtype === 'chart4dept') {
        this.showDept = false
      } else if (this.searchtype === 'chart4version') {
        this.showDept = true
      }
      let url = 'departSpentSummarys/' + this.searchtype + '/' + this.searchParam
      var _this = this
      this.Api.httpGet(url).then(res => {
        if (res.status === 200) {
          if (_this.showTableData) {
            var data = res.data
            var bugNum = []
            var bugRate = []
            var cafacity = []
            var codeRate = []
            var deptCodes = []
            var deptNames = []
            var deviation = []
            var efficient = []
            var estimate = []
            var spent = []
            var versions = []
            var bugRateAddLine = []
            var bugRateLine = []
            var detailRate = []
            var bugRate4Testcase = []
            for (let prop in data) {
              if (prop === 'bugNum') {
                bugNum = data[prop]
              } else if (prop === 'bugRate') {
                bugRate = data[prop]
              } else if (prop === 'cafacity') {
                cafacity = data[prop]
              } else if (prop === 'codeRate') {
                codeRate = data[prop]
              } else if (prop === 'deptCodes') {
                deptCodes = data[prop]
              } else if (prop === 'deptNames') {
                deptNames = data[prop]
              } else if (prop === 'deviation') {
                deviation = data[prop]
              } else if (prop === 'efficient') {
                efficient = data[prop]
              } else if (prop === 'estimate') {
                estimate = data[prop]
              } else if (prop === 'spent') {
                spent = data[prop]
              } else if (prop === 'versions') {
                versions = data[prop]
              } else if (prop === 'bugRateAddLine') {
                bugRateAddLine = data[prop]
              } else if (prop === 'bugRateLine') {
                bugRateLine = data[prop]
              } else if (prop === 'detailRate') {
                detailRate = data[prop]
              } else if (prop === 'bugRate4Testcase') {
                bugRate4Testcase = data[prop]
              } else {
                continue
              }
            }
            if (_this.searchtype === 'chart4dept') {
              for (var p = 0; p < versions.length; p++) {
                let obj = {
                  'versions': versions[p],
                  'deptCodes': deptCodes[p],
                  'bugNum': bugNum[p],
                  'bugRate': bugRate[p],
                  'cafacity': cafacity[p],
                  'codeRate': codeRate[p],
                  'deptNames': deptNames[p],
                  'deviation': deviation[p],
                  'efficient': efficient[p],
                  'estimate': estimate[p],
                  'spent': spent[p],
                  'bugRateLine': bugRateLine[p],
                  'bugRateAddLine': bugRateAddLine[p],
                  'detailRate': detailRate[p],
                  'bugRate4Testcase': bugRate4Testcase[p]
                }
                _this.getDataList.push(obj)
              }
            } else if (_this.searchtype === 'chart4version') {
              for (let p = 0; p < deptCodes.length; p++) {
                let obj = {
                  'deptCodes': deptCodes[p],
                  'bugNum': bugNum[p],
                  'bugRate': bugRate[p],
                  'cafacity': cafacity[p],
                  'codeRate': codeRate[p],
                  'deptNames': deptNames[p],
                  'deviation': deviation[p],
                  'efficient': efficient[p],
                  'estimate': estimate[p],
                  'spent': spent[p],
                  'bugRateLine': bugRateLine[p],
                  'bugRateAddLine': bugRateAddLine[p],
                  'detailRate': detailRate[p],
                  'bugRate4Testcase': bugRate4Testcase[p]

                }
                _this.getDataList.push(obj)
              }
            }
          } else {
            let data = res.data
            this.seriesdata = []
            if (this.searchtype === 'chart4dept') {
              this.xdata = data.versions
            } else if (this.searchtype === 'chart4version') {
              this.xdata = data.deptNames
            }
            for (var propi in data) {
              var newObj = {}
              if (propi === 'bugNum') {
                newObj.name = 'BUG数量'
                this.legend.push(newObj.name)
                newObj.type = 'line'
                newObj.smooth = true
                newObj.data = data[propi]
                this.seriesdata.push(newObj)
              } else if (propi === 'bugRate') {
                newObj.name = 'BUG产出率'
                this.legend.push(newObj.name)
                newObj.type = 'line'
                newObj.smooth = true
                newObj.data = data[propi]
                this.seriesdata.push(newObj)
              } else if (propi === 'bugRateAddLine') {
                newObj.name = '新增行BUG率'
                this.legend.push(newObj.name)
                newObj.type = 'line'
                newObj.smooth = true
                newObj.data = data[propi]
                this.seriesdata.push(newObj)
              } else if (propi === 'bugRateLine') {
                newObj.name = '总BUG率'
                this.legend.push(newObj.name)
                newObj.type = 'line'
                newObj.smooth = true
                newObj.data = data[propi]
                this.seriesdata.push(newObj)
              } else if (propi === 'cafacity') {
                newObj.name = '团队负荷率'
                this.legend.push(newObj.name)
                newObj.type = 'line'
                newObj.smooth = true
                newObj.data = data[propi]
                this.seriesdata.push(newObj)
              } else if (propi === 'codeRate') {
                newObj.name = '日均代码行'
                this.legend.push(newObj.name)
                newObj.type = 'line'
                newObj.smooth = true
                newObj.data = data[propi]
                this.seriesdata.push(newObj)
              } else if (propi === 'deviation') {
                newObj.name = '估算偏差率'
                this.legend.push(newObj.name)
                newObj.type = 'line'
                newObj.smooth = true
                newObj.data = data[propi]
                this.seriesdata.push(newObj)
              } else if (propi === 'efficient') {
                newObj.name = '可用工时'
                this.legend.push(newObj.name)
                newObj.type = 'line'
                newObj.smooth = true
                newObj.data = data[propi]
                this.seriesdata.push(newObj)
              } else if (propi === 'estimate') {
                newObj.name = '预估时间'
                this.legend.push(newObj.name)
                newObj.type = 'line'
                newObj.smooth = true
                newObj.data = data[propi]
                this.seriesdata.push(newObj)
              } else if (propi === 'spent') {
                newObj.name = '实际时间'
                this.legend.push(newObj.name)
                newObj.type = 'line'
                newObj.smooth = true
                newObj.data = data[propi]
                this.seriesdata.push(newObj)
              } else if (propi === 'detailRate') {
                newObj.name = '蔓延率'
                this.legend.push(newObj.name)
                newObj.type = 'line'
                newObj.smooth = true
                newObj.data = data[propi]
                this.seriesdata.push(newObj)
              } else if (propi === 'bugRate4Testcase ') {
                newObj.name = '用例数bug率'
                this.legend.push(newObj.name)
                newObj.type = 'line'
                newObj.smooth = true
                newObj.data = data[propi]
                this.seriesdata.push(newObj)
              }
            }
            this.initChart()
          }
          this.loading = false
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 图表数据配置
    tableChanChart () {
      this.showTableData = !this.showTableData
      if (this.showTableData) {
        this.btnText = '查看统计图'
      } else {
        this.btnText = '返回列表页'
      }
      this.getData()
    },
    initChart () {
      this.chart = echarts.init(this.$refs.myEchart)
      // 把配置和数据放这里
      this.chart.setOption({

        title: this.title,
        color: ['#003366', '#006699', '#4cabce', '#e5323e', '#9ff048', '#F2635F', '#F4D00C', '#7F5417', '#674ea7', '#6aa84f'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          textStyle: {
            align: 'left'
          },
          formatter: function (params, ticket, callback) {
            var res = params[0].name
            for (var i = 0, l = params.length; i < l; i++) {
              if (params[i].seriesName.indexOf('率') > 0) {
                res += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value.toFixed(2) + '%'
              } else {
                res += '<br/>' + params[i].marker + params[i].seriesName + ' : ' + params[i].value.toFixed(2)
              }
            }
            setTimeout(function () {
              // 仅为了模拟异步回调
              callback(ticket, res)
            }, 100)
            return 'loading...'
          }
        },
        legend: {
          data: this.legend
        },
        toolbox: {
          show: true,
          feature: {
            mark: {show: true},
            magicType: {show: true, type: ['line', 'bar']},
            saveAsImage: {show: true}
          }
        },
        calculable: true,
        xAxis: {
          type: 'category',
          boundaryGap: [0, 0.01],
          data: this.xdata,
          axisLabel: {
            interval: 0, // 横轴信息全部显示
            rotate: -30 // -30度角倾斜显示
          }
        },
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: this.seriesdata
      })
    },
    listItem (name, id) {
      var obj = {}
      obj.value = name
      obj.id = id
      return obj
    },
    getVersionOptions () { // 获取项目版本
      let url = 'projectVersion/getProjectVersionList'
      let _this = this
      this.Api.httpGet(url).then(res => {
        var versiondata = res.data
        for (var prop in versiondata) {
          _this.projectOptions.push({'value': prop})
        }
        function getFirstAtt (data) {
          for (var key in data) {
            return data[key]
          }
        }
        this.selectOptions = versiondata
        let firstAtt = getFirstAtt(this.selectOptions)
        this.searchParamoptions = firstAtt
        _this.searchParamValue = firstAtt[0].projectVersion
        _this.searchParam = firstAtt[0].projectVersion
        _this.searchProject = _this.projectOptions[0].value
        _this.getData()
      }).catch(err => {
        console.log(err)
      })
    },
    getDeptOptions () { // 获取部门
      let url = 'departSpentSummarys/deptList'
      let _this = this
      this.Api.httpGet(url).then(res => {
        var deptdata = res.data
        for (var i = 0; i < deptdata.length; i++) {
          _this.deptOptions.push(_this.listItem(deptdata[i].depName, deptdata[i].depCode))
        }
      }).catch(err => {
        console.log(err)
      })
    },
    changeSearchType () {
      if (this.searchvalue.indexOf('部门') > 0) {
        this.searchtype = 'chart4dept'
        this.searchParamValue = ''
        this.paramPlaceholder = '请选择部门'
        this.searchParamoptions = this.deptOptions
        this.searchParamValue = this.deptOptions[0].value
        this.searchParam = this.deptOptions[0].id
      } else if (this.searchvalue.indexOf('项目') > 0) {
        this.searchtype = 'chart4version'
        this.searchParamValue = ''
        this.paramPlaceholder = '请选择项目版本'
        this.searchParamoptions = this.selectOptions.toon
      }
    },
    changeSearchProject (val) {
      for (var prop in this.selectOptions) {
        if (prop === val) {
          this.searchParamoptions = this.selectOptions[prop]
          this.searchParam = this.selectOptions[prop][0].projectVersion
          this.searchParamValue = this.selectOptions[prop][0].projectVersion
        }
      }
    },
    changeSearchParam (val) {
      if (this.searchtype === 'chart4dept') {
        let obj = {}
        obj = this.searchParamoptions.find((item) => {
          return item.value === val
        })
        this.searchParam = obj.id
      } else if (this.searchtype === 'chart4version') {
        this.searchParam = val
      }
    },
    searchEvt () {
      this.getData()
    }
  },
  created () {
    this.getVersionOptions()
    this.getDeptOptions()
  }
}
</script>
<style scoped>
  .searchBox {
    margin-bottom: 10px;
    float: left;
  }
</style>
