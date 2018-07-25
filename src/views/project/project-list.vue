<template>
  <div>
    <div class="menu-list clearfix">
      <div class="menu_new">
        <div class="menu-left">
          <el-select class="gap-right" v-model="searchProject" placeholder="请选择项目" @change="changeSearchType">
            <el-option
              v-for="item in projectOptions"
              :value="item.value"
              :key="item.value"
            >
            </el-option>
          </el-select>
          <el-select class="gap-right" v-model="searchVersion" placeholder="请选择版本">
            <el-option
              v-for="item in versionOptions"
              :value="item.projectVersion"
              :key="item.projectVersion"
            >
            </el-option>
          </el-select>
          <el-button
            @click="searchEvt"
          >
            查询
          </el-button>
        </div>
        <div class="menu-right">
          <el-button
            @click="addNewList"
            type="primary"
            :disabled="!functions.add"
            class="the_btn fl-right"
          >
            新增
          </el-button>
        </div>
      </div>
    </div>
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
        header-align="center"
        align="center"
        width="100"
      >
      </el-table-column>
      <el-table-column
        label="项目名称"
        prop="projectName"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="版本号"
        prop="projectVersion"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="开始时间"
        prop="startTime"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        label="结束时间"
        prop="endTime"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        label="研发开始时间"
        prop="codeStartTime"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        label="研发结束时间"
        prop="codeEndTime"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        label="持续时间"
        prop="lastTime"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        label="操作"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" :disabled="!functions.modify" size="small" @click="modifyEvt(scope.$index,scope.row)">修改</el-button>
          <el-button type="text" :disabled="!functions.delet" size="small" @click.native.prevent="deleteEvt(scope.$index, getDataList)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增弹出层-->
    <newlist v-if="showDialog" :dialog-title="dialogTitle" :show-dialog='showDialog' labelWidth='120px'
             :params="params" v-on:newPagefn='newPagefn'
             v-on:addConfirm="addConfirm">
    </newlist>
  </div>
</template>

<script>
import mixin from '@/mixins/index'
import newlist from '@/components/newlist/index'
import { getFunctions } from 'utils/getFunctions'
export default {
  name: 'ProjecList',
  components: {
    newlist
  },
  data () {
    return {
      dialogTitle: '项目修改',
      loading: false,
      showDialog: false,
      modifyIndex: -1,
      modifyData: [],
      params: {
        forms: [
          {
            labelname: 'projectName',
            itemType: 'input',
            label: '项目名称',
            placeholder: '项目名称',
            modelValue: ''
          },
          {
            labelname: 'projectVersion',
            itemType: 'input',
            label: '项目版本',
            placeholder: '项目版本',
            modelValue: ''
          },
          {
            labelname: 'startTime',
            itemType: 'datetime',
            label: '开始时间',
            placeholder: '开始时间',
            modelValue: ''
          },
          {
            labelname: 'endTime',
            itemType: 'datetime',
            label: '结束时间',
            placeholder: '结束时间',
            modelValue: ''
          },
          {
            labelname: 'codeStartTime',
            itemType: 'datetime',
            label: '研发开始时间',
            placeholder: '开始时间',
            modelValue: ''
          },
          {
            labelname: 'codeEndTime',
            itemType: 'datetime',
            label: '研发结束时间',
            placeholder: '结束时间',
            modelValue: ''
          },
          {
            labelname: 'lastTime',
            itemType: 'input',
            label: '持续时间',
            placeholder: '持续时间',
            modelValue: ''
          }
        ]
      },
      getDataList: [],
      list: {},
      searchVersion: '',
      searchProject: '',
      selectOptions: [],
      versionOptions: [],
      projectOptions: [],
      deptOptions: [],
      functions: {}
    }
  },
  mixins: [mixin],
  methods: {
    getData () {
      this.getDataList = []
      let url = 'projectVersion/list'
      var param = '?'
      if (this.searchProject && this.searchProject !== '全部') {
        param += param === '?' ? 'projectName=' + this.searchProject : '&projectName=' + this.searchProject
      }
      if (this.searchVersion && this.searchVersion !== '不限') {
        param += param === '?' ? 'projectVersion=' + this.searchVersion : '&projectVersion=' + this.searchVersion
      }
      url += param === '?' ? '' : param
      let _this = this
      this.Api.httpGet(url).then(res => {
        var versiondata = res.data.list
        for (var i = 0, len = versiondata.length; i < len; i++) {
          versiondata[i].startTime = _this.Api.formateTime(versiondata[i].startTime)
          versiondata[i].endTime = _this.Api.formateTime(versiondata[i].endTime)
          versiondata[i].codeEndTime = _this.Api.formateTime(versiondata[i].codeEndTime)
          versiondata[i].codeStartTime = _this.Api.formateTime(versiondata[i].codeStartTime)
          _this.getDataList.push(versiondata[i])
        }
        _this.selectOption = versiondata
      }).catch(err => {
        console.log(err)
      })
    },
    modifyEvt (index, row) {
      this.newPagefn()
      this.modifyIndex = index
      this.modifyData = row
      this.params.forms.map(function (item, index, arr) {
        arr[index].modelValue = row[item.labelname]
      })
    },
    deleteEvt (index, rows) {
      let curIndex = index
      let rowData = rows
      this.confirmBox('此操作将永久删除该信息, 是否继续?', () => {
        this.deletConfirm(curIndex, rowData)
      })
    },
    deletConfirm (index, rows) {
      let url = 'projectVersion/delete'
      let params = {
        id: rows[index].id
      }
      this.Api.httpGet(url, params)
        .then(res => {
          if (res.data.code === 200) {
            this.resultInfo('删除成功', 'success')
            rows.splice(index, 1)
          } else {
            this.resultInfo('删除失败', 'warning')
          }
        }).catch(err => {
          this.resultInfo(err, 'warning')
        })
    },
    addConfirm () {
      let _this = this
      this.params.forms.map((item, index, arr) => {
        if (item.labelname === 'startTime' || item.labelname === 'endTime' || item.labelname === 'codeStartTime' || item.labelname === 'codeEndTime') {
          this.modifyData[item.labelname] = this.Api.formateTime(arr[index].modelValue)
        } else {
          this.modifyData[item.labelname] = arr[index].modelValue
        }
      })
      var url = ''
      if (this.modifyIndex >= 0) {
        url = 'projectVersion/save?id=' + this.modifyData.id + '&projectName=' + this.modifyData.projectName + '&projectVersion=' + this.modifyData.projectVersion + '&startTime=' + this.Api.getTimeCode(this.modifyData.startTime) + '&endTime=' + this.Api.getTimeCode(this.modifyData.endTime) + '&codeStartTime=' + this.Api.getTimeCode(this.modifyData.codeStartTime) + '&codeEndTime=' + this.Api.getTimeCode(this.modifyData.codeEndTime) + '&lastTime=' + this.modifyData.lastTime
      } else {
        url = 'projectVersion/save?projectName=' + this.modifyData.projectName + '&projectVersion=' + this.modifyData.projectVersion + '&startTime=' + this.Api.getTimeCode(this.modifyData.startTime) + '&endTime=' + this.Api.getTimeCode(this.modifyData.endTime) + '&codeStartTime=' + this.Api.getTimeCode(this.modifyData.codeStartTime) + '&codeEndTime=' + this.Api.getTimeCode(this.modifyData.codeEndTime) + '&lastTime=' + this.modifyData.lastTime
      }
      this.Api.httpPost(url).then(res => {
        this.loading = false
        if (_this.modifyIndex >= 0) {
          _this.$set(_this.getDataList, _this.modifyIndex, _this.modifyData)
        } else {
          _this.getDataList.unshift(_this.modifyData)
        }
        this.newPagefn()
      }).catch(err => {
        console.log(err)
      })
    },
    getVersionOptions () { // 获取项目版本
      let url = 'projectVersion/getProjectVersionList'
      let _this = this
      this.Api.httpGet(url).then(res => {
        var versiondata = res.data
        for (var prop in versiondata) {
          _this.projectOptions.push({'value': prop})
        }
        _this.projectOptions.unshift({'value': '全部'})
        _this.selectOptions = versiondata
        _this.searchProject = _this.projectOptions[0].value
        _this.searchVersion = '不限'
        _this.versionOptions = _this.selectOptions.toon
      }).catch(err => {
        console.log(err)
      })
    },
    changeSearchType (val) {
      if (val === '全部') {
        this.searchVersion = '不限'
        this.versionOptions = []
      } else {
        for (var prop in this.selectOptions) {
          if (prop === val) {
            this.versionOptions = this.selectOptions[prop]
            this.searchVersion = this.selectOptions[prop][0].projectVersion
          }
        }
      }
    },
    addNewList () {
      this.params.forms.map(function (item, index, arr) {
        arr[index].modelValue = ''
      })
      this.newPagefn()
    },
    searchEvt () {
      this.getData()
    },
    newPagefn () {
      if (this.showDialog) {
        this.showDialog = false
      } else {
        this.showDialog = true
      }
    }
  },
  created () {
    this.functions = getFunctions(this)
    this.getVersionOptions()
    this.getData()
  }
}
</script>
<style scoped>
  .searchBox {
    margin-bottom: 10px;
    float: left;
  }

  .el-table .cell {
    padding: 10px 0 !important;
  }

  .el-table td, .el-table th {
    padding: 12px 0 !important;
  }

  .linsap {
    margin: 8px 5px 0 5px;
  }
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
  .fl-right {
    float: right;
  }
</style>
