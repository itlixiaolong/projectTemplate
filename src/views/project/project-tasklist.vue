<template>
  <div>
    <div class="menu_new">
      <div class="menu-left">
        <el-select class="gap-right" v-model="searchDept" placeholder="请选择部门" :disabled="roleId !== '1'">
          <el-option
            v-for="(item,index) in deptOptions"
            :key="index"
            :label="item.depName"
            :value="item.depName"
          >
          </el-option>
        </el-select>
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
    </div>
    <el-table
      v-loading.body="loading"
      :data="getDataList"
      border
      style="width: 100%;"
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
        label="部门名称"
        prop="depName"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="部门编码"
        prop="depCode"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="项目版本"
        prop="version"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="新增"
        prop="estimateAdd"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="变更"
        prop="estimateChange"
        header-align="center"
        align="center"
      >
      </el-table-column>

      <el-table-column
        label="删除"
        prop="estimateDel"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" :disabled="!functions.modify" size="small" @click="modifyEvt(scope.$index,scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-box clearfix">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagetotle"
        :page-size="pagesize"
        @size-change="sizeChange"
        @current-change="indexChange"
      >
      </el-pagination>
    </div>
    <!--新增弹出层-->
    <newlist v-if="showDialog" dialog-title="需求变更" :showDialog='showDialog' dialogWidth='30%' labelWidth='90px' :params="params" v-on:newPagefn='newPagefn'
             v-on:addConfirm="addConfirm">

    </newlist>

  </div>
</template>
<script>
import mixin from '@/mixins/index'
import newlist from '@/components/newlist/index'
import { getCookie } from 'utils/cookie'
import { getCodedepartment } from '@/api/code/index'
import { getFunctions } from 'utils/getFunctions'
export default {
  components: {
    newlist
  },
  data () {
    return {
      loading: false,
      showDialog: false,
      modifyIndex: -1,
      modifyData: {},
      params: {
        labelWidth: '80',
        forms: [
          {
            labelname: 'depName',
            itemType: 'text',
            label: '部门名称',
            placeholder: '部门名称',
            modelValue: ''
          },
          {
            labelname: 'depCode',
            itemType: 'text',
            label: '部门编码',
            placeholder: '部门编码',
            modelValue: ''
          },
          {
            labelname: 'version',
            itemType: 'text',
            label: '项目版本',
            placeholder: '版本号',
            modelValue: ''
          },
          {
            labelname: 'estimateChange',
            itemType: 'input',
            label: '变更时间',
            placeholder: '变更时间',
            modelValue: ''
          }
        ]

      },
      getDataList: [],
      list: {},
      pageindex: 1,
      pagesize: 20,
      pagetotle: 100,
      pagination: false,
      searchDept: '',
      searchVersion: '',
      searchProject: '',
      selectOptions: [],
      versionOptions: [],
      projectOptions: [],
      deptOptions: [],
      functions: {},
      roleId: ''
    }
  },
  mixins: [mixin],
  created () {
    this.functions = getFunctions(this)
    this.getData()
    this.getVersionOptions()
    this.getDeptOptions()
    this.roleId = JSON.parse(getCookie('userinfo')).roleId
    // this.searchDept = JSON.parse(getCookie('userinfo')).depCode
  },
  methods: {
    getData () {
      var url = 'departSpentDetails/'
      var param = '?'
      if (this.searchDept && this.searchDept !== '全部') {
        param += param === '?' ? 'depName=' + this.searchDept : '&depName=' + this.searchDept
      }
      if (this.searchVersion) {
        param += param === '?' ? 'version=' + this.searchVersion : '&version=' + this.searchVersion
      }
      if (this.pageindex) {
        param += param === '?' ? 'page=' + this.pageindex : '&page=' + this.pageindex
      }
      if (this.pagesize) {
        param += param === '?' ? 'rows=' + this.pagesize : '&rows=' + this.pagesize
      }
      url += param === '?' ? '' : param
      this.Api.httpGet(url).then(res => {
        if (this.pageindex === 1) {
          let summary = res.data.summary
          this.pagesize = summary.rows
          this.pagetotle = summary.countNum
        }
        let list = res.data.list
        for (let i in list) {
          list[i].startTime = this.Api.formateTime(list[i].startTime)
          list[i].endTime = this.Api.formateTime(list[i].endTime)
        }
        this.getDataList = res.data.list
        this.loading = false
      }).catch(err => {
        console.log(err)
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
        _this.selectOptions = versiondata
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
        _this.getData()
      }).catch(err => {
        console.log(err)
      })
    },
    getDeptOptions () { // 获取部门
      getCodedepartment()
        .then(res => {
          this.deptOptions = res.data.data
          this.deptOptions.unshift({depName: '全部', depCode: ''})
        })
        .catch(err => {
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
    searchEvt () {
      this.pageindex = 1
      this.getData()
    },
    modifyEvt (index, row) {
      var formValue = this.params.forms
      this.modifyData = row
      formValue.map(function (item, index, array) {
        if (item.labelname === 'depName') {
          item.modelValue = row.depName
        } else if (item.labelname === 'depCode') {
          item.modelValue = row.depCode
        } else if (item.labelname === 'version') {
          item.modelValue = row.version
        } else if (item.labelname === 'estimateChange') {
          item.modelValue = row.estimateChange
        }
      })
      this.params.forms = formValue
      this.newPagefn()
    },
    addConfirm () {
      var _this = this
      this.params.forms.map(function (item, index, array) {
        if (item.labelname === 'estimateChange') {
          _this.modifyData.estimateChange = item.modelValue
        }
      })
      var url = 'departSpentDetails/'
      var param = {
        'estimateChange': this.modifyData.estimateChange,
        'id': this.modifyData.id
      }
      this.Api.httpPut(url, param)
        .then(res => {
          this.list = res.data
          this.loading = false

          this.$set(this.getDataList, this.modifyIndex, this.modifyData)
          this.newPagefn()
        })
        .catch(err => {
          console.log(err)
        })
    },

    addNewList () {
      this.newPagefn()
    },
    // 分页相关方法
    indexChange (val) {
      this.pageindex = val
      this.getData()
    },
    sizeChange (val) {
      this.pagesize = val
      this.getData()
    },
    newPagefn () {
      if (this.showDialog) {
        this.showDialog = false
      } else {
        this.showDialog = true
      }
    }
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

  .fl-right {
    float: right;
  }
  .pagination-box{
    padding: 20px 0;
    background: #fff;
  }
  .pagination-box .el-pagination{
    float: right;
  }
  .el-inline {
    display: inline-block;
    margin-right: 12px;
  }
</style>
