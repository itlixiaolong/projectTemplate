<template>
  <div>
    <div class="menu_new">
      <div class="menu-left" v-if="editFlag">
        <el-select class="gap-right" v-model="searchDept" placeholder="请选择部门" :disabled="roleId !== '1'">
          <el-option
            v-for="(item,index) in deptOptions"
            :key="index"
            :label="item.depName"
            :value="item.depCode"
          >
          </el-option>
        </el-select>
        <el-select class="gap-right" v-model="searchProject" placeholder="请选择项目" @change="changeSearchType">
          <el-option
            v-for="item in projectOptions"
            :key="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select class="gap-right" v-model="searchVersion" placeholder="请选择项目版本">
          <el-option
            v-for="item in versionOptions"
            :key="item.projectVersion"
            :value="item.projectVersion"
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
        <el-input
          v-if="!editFlag"
          v-model="editEfficient"
          placeholder="投入百分比"
          style="width: 160px"
          class="gap-right"
        >
        </el-input>
        <el-button class="gap-right" :disabled="editFlag && !functions.bulkModify" type="primary" @click="bulkEdit">{{editText}}</el-button>
        <el-upload
          class="el-inline"
          :action="uploadUrl"
          :on-change="uploadStart"
          :show-file-list="false"
          :on-success="uploadSuccess"

        >
          <el-button type="primary" :disabled="!functions.uploadData">点击上传</el-button>
        </el-upload>
        <el-button class="" :disabled="!functions.exportDate" type="primary" v-on:click="downLoad">下载excel</el-button>
      </div>
    </div>
    <el-table
      v-loading.body="loading"
      ref="multipleTable"
      element-loading-text="拼命加载中..."
      :data="getDataList"
      border
      style="width: 100%;"
      @selection-change="tableColSelect">
      <el-table-column
        type="selection">
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        :index="indexMethod"
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
        label="员工姓名"
        prop="userName"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="员工编号"
        prop="userNo"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="项目编码"
        prop="projectVersionId"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="投入百分比 %"
        prop="efficient"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{scope.row.efficient*100}}
          <span>%</span>
        </template>

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
        :current-page="pageindex"
        @size-change="sizeChange"
        @current-change="indexChange"
      >
      </el-pagination>
    </div>
    <!--新增弹出层-->
    <newlist v-if="showDialog" dialog-title="修改投入度" :showDialog='showDialog' dialogWidth='30%' labelWidth='90px' :params="params" v-on:newPagefn='newPagefn'
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
      showDialog: false,
      modifyIndex: -1,
      modifyData: {},
      params: {
        forms: [
          {
            labelname: 'depName',
            itemType: 'text',
            label: '项目名称',
            placeholder: '请选择',
            modelValue: ''
          },
          {
            labelname: 'depCode',
            itemType: 'text',
            label: '部门编码',
            placeholder: '请选择',
            modelValue: ''
          },
          {
            labelname: 'userName',
            itemType: 'text',
            label: '员工姓名',
            placeholder: '请填写员工姓名',
            modelValue: ''
          },
          {
            labelname: 'userNo',
            itemType: 'text',
            label: '员工编号',
            placeholder: '请填写员工编号',
            modelValue: ''
          },
          {
            labelname: 'projectVersionId',
            itemType: 'select',
            label: '项目编码',
            placeholder: '请填写项目编码',
            modelValue: '',
            options: []
          },
          {
            labelname: 'efficient',
            itemType: 'input',
            label: '投入百分比',
            placeholder: '请填写投入百分比',
            modelValue: ''
          }
        ]

      },
      getDataList: [],
      loading: false,
      uploadUrl: '/userEfficient/upload/aa',
      pageindex: 1,
      pagesize: 20,
      pagetotle: 100,
      searchDept: '',
      searchVersion: '',
      searchProject: '',
      selectOptions: [],
      versionOptions: [],
      projectOptions: [],
      deptOptions: [],
      editText: '批量修改',
      editFlag: true,
      editEfficient: '',
      SelecttableCol: [],
      functions: {},
      roleId: ''
    }
  },
  mixins: [mixin],
  created () {
    this.functions = getFunctions(this)
    this.getVersionOptions()
    this.getDeptOptions()
    this.roleId = JSON.parse(getCookie('userinfo')).roleId
    this.searchDept = JSON.parse(getCookie('userinfo')).depCode
  },
  methods: {
    indexMethod (index) {
      return (this.pageindex - 1) * this.pagesize + index
    },
    getData () {
      this.loading = true
      // 加载原始数据
      this.getDataList = []
      var url = 'userEfficient/list'
      var param = '?'
      if (this.searchDept && this.searchDept !== '全部') {
        param += param === '?' ? 'depCode=' + this.searchDept : '&depCode=' + this.searchDept
      }
      if (this.searchVersion) {
        param += param === '?' ? 'projectVersionId=' + this.searchVersion : '&projectVersionId=' + this.searchVersion
      }
      if (this.pageindex) {
        param += param === '?' ? 'page=' + this.pageindex : '&page=' + this.pageindex
      }
      if (this.pagesize) {
        param += param === '?' ? 'rows=' + this.pagesize : '&rows=' + this.pagesize
      }
      url += param === '?' ? '' : param
      this.Api.httpPost(url).then(res => {
        if (res.status === 200) {
          this.loading = false
          if (this.pageindex === 1) {
            let summary = res.data.summary
            this.pagesize = summary.rows

            this.pagetotle = summary.countNum
          }
          let list = res.data.list
          for (let i in list) {
            list[i].efficient = list[i].efficient
          }
          this.getDataList = list
        }
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
        this.getData()
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
    // 分页相关方法
    indexChange (val) {
      this.pageindex = val
      this.getData()
    },
    sizeChange (val) {
      this.pagesize = val
      this.getData()
    },
    uploadStart (file) {
      this.loading = true
    },
    // 表格上传
    uploadSuccess (res, file, fileList) {
      if (res.code === 200) {
        this.getData()
      }
    },
    // 表格修改相关
    tableColSelect (val) {
      if (val.length > 0) {
        this.editFlag = false
      } else {
        this.editFlag = true
      }
      this.SelecttableCol = val
    },
    bulkEdit () {
      if (this.SelecttableCol.length === 0) {
        this.resultInfo('请选择要修改的部门', 'warning')
        return
      }
      if (!this.editEfficient) {
        this.resultInfo('请输入修改数据', 'warning')
        return
      }
      this.editFlag = true
      this.resultInfo('修改成功', 'success')
      let listParam = []
      for (var i = 0, len = this.SelecttableCol.length; i < len; i++) {
        listParam.push({'efficient': (this.editEfficient / 100).toFixed(2), 'id': this.SelecttableCol[i].id})
      }
      let url = 'userEfficient/batchUpdate'
      let param = {
        'list': listParam
      }
      this.Api.httpPost(url, param).then(res => {
        for (var i = 0, len = this.SelecttableCol.length; i < len; i++) {
          this.getDataList[i].efficient = (this.editEfficient / 100).toFixed(2)
        }
        this.editEfficient = ''
        this.$refs.multipleTable.clearSelection()
      }).catch(err => {
        console.log(err)
      })
    },
    modifyEvt (index, row) {
      this.newPagefn()
      this.modifyIndex = index
      this.modifyData = row
      let _this = this
      this.params.forms.map(function (item, index, arr) {
        switch (item.labelname) {
          case 'id':
            arr[index].modelValue = row.id
            break
          case 'depName':
            arr[index].modelValue = row.depName
            break
          case 'depCode':
            arr[index].modelValue = row.depCode
            break
          case 'userName':
            arr[index].modelValue = row.userName
            break
          case 'userNo':
            arr[index].modelValue = row.userNo
            break
          case 'projectVersionId':
            arr[index].options = []
            arr[index].modelValue = row.projectVersionId
            for (var i = 0, soption = _this.selectOptions.toon, len = _this.selectOptions.toon.length; i < len; i++) {
              arr[index].options.push(_this.listItem(soption[i].projectVersion, soption[i].id))
            }
            break
          case 'efficient':
            arr[index].modelValue = row.efficient * 100
            break
          case '':
            item.endTime = row.endTime
            break
        }
      })
    },
    addConfirm () {
      var params = this.params.forms
      var url = 'userEfficient/' + this.modifyData.id + '?depName=' + this.modifyData.depName + '&depCode=' + this.modifyData.depCode + '&userName=' + this.modifyData.userName + '&userNo=' + this.modifyData.userNo + '&projectVersionId=' + params[4].modelValue + '&efficient=' + (params[5].modelValue / 100)
      this.modifyData.projectVersionId = params[4].modelValue
      this.modifyData.efficient = (params[5].modelValue / 100).toFixed(2)
      var _this = this
      this.Api.httpPost(url).then(res => {
        if (res.status === 200) {
          _this.$set(this.getDataList, _this.modifyIndex, _this.modifyData)
          _this.newPagefn()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    newPagefn () {
      if (this.showDialog) {
        this.showDialog = false
      } else {
        this.showDialog = true
      }
    },
    downLoad () {
      window.location.href = this.basicUrl + '/userEfficient/download'
    }
  }

}
</script>
<style scoped>
  .menu-list{
    margin-bottom: 10px;
  }
  .searchBox {

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

  .el-loading-spinner{
    top: 20%;
  }
  .fl-right {
    float: right;
  }
  .btn-box{

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
    margin-right:10px;
  }
  @media screen and (max-width: 1400px) {
    .menu-list .btn-box.fl-right{
      float: left;
      margin-top: 10px;
    }
  }
</style>
