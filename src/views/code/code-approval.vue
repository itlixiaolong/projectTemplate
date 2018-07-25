<template>
  <div>
    <div class="menu_new">
      <div class="menu-left" v-if="editFlag">
        <el-select class="gap-right" v-model="searchDept"  value-key="depCode" placeholder="请选择部门" :disabled="roleId !== '1'">
          <el-option
            v-for="(item,index) in deptOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-input
          v-model="projectName"
          :maxlength="20"
          class="search-one gap-right"
          placeholder="英文名称"
          style="width: 160px"
        >
        </el-input>
        <el-input
          v-model="cnName"
          :maxlength="20"
          class="search-one gap-right"
          placeholder="项目名称"
          style="width: 160px"
        >
        </el-input>
        <el-select class="gap-right" v-model="searchVersion" placeholder="请选择语言栈">
          <el-option
            v-for="item in versionOptions"
            :key="item.id"
            :value="item.value"
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
      v-if="getDataList"
      ref="multipleTable"
      element-loading-text="拼命加载中..."
      :data="getDataList"
      border
      style="width: 100%;"
    >
      <el-table-column
        label="序号"
        type="index"
        :index="indexMethod"
        header-align="center"
        align="center"
        width="60"
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
        label="中文名称"
        prop="cnName"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="项目描述"
        prop="description"
        header-align="center"
        align="left"
        width="300"
      >
      </el-table-column>
      <el-table-column
        label="申请时间"
        prop="createdAt"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          <span v-fomatTime="scope.row.createdAt"></span>
        </template>
      </el-table-column>
      <el-table-column
        label="语言栈"
        prop="projectType"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="所属部门"
        prop="depName"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <span
            v-for="(item,index) in scope.row.projectDepartments"
            :key="index"
            class="parment"
          >
            {{item.depName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="modifyEvt(scope.$index,scope.row)" class="arrroval_btn">审批</el-button>
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
    <newlist v-if="showDialog" dialog-title="审批详情" :showDialog='showDialog' dialogWidth='50%' labelWidth='90px' :params="params" v-on:newPagefn='newPagefn'
              @remoteMethod ='remoteMethodz' @dataChange ='dataChanger'>
      <template slot="insertpart"><el-input placeholder="请输入项目组名" v-model.trim="projectGroup" style="width: 200px;margin-left: 10px"></el-input></template>
      <template slot ="footer">
        <el-button type="primary" @click="ApprovedFn">审批通过</el-button>
        <el-button type="primary" @click="ReverttoeditFn">打回修改</el-button>
      </template>
    </newlist>
  </div>
</template>

<script>
import mixin from '@/mixins/index'
import newlist from '../../components/newlist/index'
import { formateTime, getTimeCode } from '../../utils/date'
import { getCookie } from 'utils/cookie'
import {getCodeApproval, getCodetack, getCodeShell, getCodeproject, getCodedepartment, getMaster, getCodedeby} from '../../api/code/index'
export default {
  name: 'CodeApproval',
  components: {
    newlist
  },
  data () {
    return {
      roleId: '',
      userInfo: {},
      showDialog: false,
      modifyIndex: -1,
      modifyData: {},
      projectName: '',
      cnName: '',
      masterList: [],
      selectMaster: [],
      projectGroup: '',
      params: {
        forms: [
          {
            labelname: 'projectName',
            itemType: 'input',
            label: '项目名称 :',
            modelValue: ''
          },
          {
            labelname: 'cnName',
            itemType: 'input',
            label: '中文名称 :',
            modelValue: ''
          },
          {
            labelname: 'projectType',
            itemType: 'select',
            label: '技术栈 :',
            modelValue: '',
            options: []
          },
          {
            labelname: 'namespace',
            itemType: 'select',
            label: '项目组名 :',
            modelValue: '',
            options: [],
            slotFlag: true
          },
          {
            labelname: 'projectDepartments',
            itemType: 'select',
            label: '申请部门 :',
            modelValue: [],
            options: [],
            multipleState: true,
            valueSpetial: 'depName'
          },
          {
            labelname: 'projectUsers',
            itemType: 'select',
            label: 'Master :',
            modelValue: [],
            filteState: true,
            remoteState: true,
            multipleState: true,
            reserveState: true,
            options: [],
            valueSpetial: 'emplId'
          },
          {
            labelname: 'description',
            itemType: 'textarea',
            label: '项目描述 :',
            modelValue: ''
          },
          {
            labelname: 'comment',
            itemType: 'input',
            label: '备注 :',
            modelValue: ''
          },
          {
            labelname: 'approveComment',
            itemType: 'textarea',
            label: '审批备注 :',
            modelValue: ''
          }
        ]
      },
      getDataList: [],
      loading: true,
      pageindex: 1,
      pagesize: 20,
      pagetotle: 100,
      searchDept: '',
      searchVersion: '', // 获取技术栈
      versionOptions: [], // 技术栈列表
      deptOptions: [], // 部门列表
      editFlag: true,
      codeshell: [],
      project: [], // 获取弹层项目组名
      department: [], // 获取弹层申请部门
      firstEnter: true
    }
  },
  mixins: [mixin],
  created () {
    this.userInfo = JSON.parse(getCookie('userinfo'))
    this.roleId = this.userInfo.roleId
    this.searchDept = {
      depCode: this.userInfo.depCode,
      depName: this.userInfo.depName
    }
    this.getData()
    this.getDeptOptions()
  },
  methods: {
    indexMethod (index) {
      return (this.pageindex - 1) * this.pagesize + index
    },
    getData (val) { // 获取数据列表
      let params = {
        depCode: this.searchDept.depCode === 0 ? '' : this.searchDept.depCode,
        cnName: this.cnName,
        projectName: this.projectName,
        projectType: this.searchVersion === '全部' ? '' : this.searchVersion,
        page: this.pageindex,
        pageSize: this.pageSize
      }
      getCodeApproval(params).then((res) => {
        this.getDataList = res.data.data
        this.pagetotle = res.data.paging.totalPages
        this.pagesize = res.data.paging.pageSize
        this.pageindex = res.data.paging.page
        this.loading = false
      }).catch(err => {
        console.log(err)
      })
      this.getVersionOptions()
    },
    listItem (label, value) {
      var obj = {}
      obj.label = label
      obj.value = value
      return obj
    },
    getVersionOptions () { // 获取技术栈
      this.versionOptions = []
      getCodetack().then((res) => {
        let data = res.data.data
        for (var i = 0; i < data.length; i++) {
          this.versionOptions.push(this.listItem(data[i], data[i]))
        }
        this.versionOptions.unshift(this.listItem('0', '全部'))
      }).catch(err => {
        console.log(err)
      })
    },

    getDeptOptions () { // 获取部门
      getCodedepartment().then((res) => {
        let deptdata = res.data.data
        for (var i = 0; i < deptdata.length; i++) {
          this.deptOptions.push(this.listItem(deptdata[i].depName, {depCode: deptdata[i].depCode, depName: deptdata[i].depName}))
        }
        this.deptOptions.unshift(this.listItem('全部', '0'))
      }).catch(err => {
        console.log(err)
      })
    },
    dataChanger (val) {
      let flag = this.versionOptions.find(function (item, index, arr) {
        return val === item.label
      })
      console.log(flag)
      if (flag) {
        this._getCodeproject(val) // 调用获取项目组名
      }
    },
    remoteMethodz (query) { // master用户查询
      this.loading = true
      // 获取用户信息
      let masterParam = {
        name: query
      }
      this._getMaster(masterParam)
    },
    searchEvt () { // 查询
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
    // 获取项目组名
    _getCodeproject (skillParam) {
      let par = {
        skillType: skillParam
      }
      getCodeproject(par).then((res) => {
        let data = res.data.data
        for (var i = 0; i < data.length; i++) {
          this.project.push(this.listItem(data[i], data[i]))
        }
      }).catch(err => {
        console.log(err)
      })
    },
    _getMaster (query) {
      getMaster(query).then((res) => { // master用户接口
        this.masterList = []
        let data = res.data.data
        for (var i = 0; i < data.length; i++) {
          this.masterList.push(this.listItem(data[i].name + '；' + data[i].mail, {emplId: data[i].emplId, emplMail: data[i].mail, emplName: data[i].name}))
        }
        if (query.name) {
          setTimeout(() => {
            this.loading = false
            this.params.forms.map((item, index, arr) => {
              if (item.labelname === 'projectUsers') {
                item.options = this.masterList.filter(filItem => {
                  return filItem.label.indexOf(query.name) > -1
                })
              }
            })
          }, 200)
        } else {
          setTimeout(() => {
            this.params.forms.map((item, index, arr) => {
              if (item.labelname === 'projectUsers') {
                item.options = this.masterList
              }
            })
          }, 200)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    modifyEvt (index, rowitem) {
      if (this.firstEnter) {
        this.versionOptions.shift()
        this.deptOptions.shift()
      }
      this.firstEnter = false
      getCodeShell(rowitem.id).then((res) => { // 审批列表
        let codeshell = res.data.data
        this.modifyIndex = index + 1
        this.modifyData = codeshell
        this._getCodeproject(codeshell.projectType) // 调用获取项目组名
        let masterParam = {
          deptId: this.userInfo.depCode
        }
        this._getMaster(masterParam) // 调用获取master初始值
        this.params.forms.map((item, index, arr) => {
          if (item.options) {
            item.options = []
          }
          if (item.labelname === 'projectType') {
            item.modelValue = codeshell.projectType
            item.options = this.versionOptions
          } else if (item.labelname === 'projectUsers') {
            item.modelValue = []
            for (let i = 0; i < codeshell.projectUsers.length; i++) {
              if (codeshell.projectUsers.length > 0) {
                item.modelValue.push(codeshell.projectUsers[i])
              }
            }
          } else if (item.labelname === 'projectDepartments') {
            item.modelValue = []
            for (let i = 0; i < codeshell.projectDepartments.length; i++) {
              item.modelValue.push(codeshell.projectDepartments[i])
            }
            item.options = this.deptOptions
          } else if (item.labelname === 'createdAt') {
            item.modelValue = ''
            item.modelValue = formateTime(codeshell.createdAt)
            item.options = this.project
          } else if (item.labelname === 'namespace') {
            item.modelValue = ''
            item.modelValue += codeshell.namespace
            item.options = this.project
          } else {
            item.modelValue = codeshell[item.labelname] ? codeshell[item.labelname] : item.modelValue
          }
        })

        this.newPagefn()
      }).catch(err => {
        console.log(err)
      })
    },
    newPagefn () { // 弹层
      if (this.showDialog) {
        this.showDialog = false
      } else {
        this.showDialog = true
      }
    },
    ApprovedFn () { // 审批通过
      this.validateState('success')
    },
    ReverttoeditFn () { // 打回修改
      this.validateState('fail')
    },
    validateState (val) {
      var _this = this
      this.params.forms.map((item, index, arr) => {
        _this.modifyData[item.labelname] = item.modelValue
      })
      for (let item in this.modifyData) {
        let id = this.modifyData.id
        if (item === 'namespace') {
          let English = new RegExp('^[A-Za-z0-9]+$')
          if (_this.projectGroup && val === 'success') {
            if (English.test(this.projectGroup)) {
              this.modifyData[item] = this.projectGroup
            } else {
              this.resultInfo('组名请填写英文', 'warning')
              return
            }
          }
        }
        if (item === 'projectDepartments' || item === 'projectUsers') {
          if (this.modifyData[item].length > 0) {
            this.modifyData[item].map((sing, index, arr) => {
              sing.projectId = id
            })
          } else {
            if (val === 'success') {
              let msg = ''
              item === 'projectUsers' ? msg = '请选择master' : msg = '请选择部门'
              this.resultInfo(msg, 'warning')
              return
            }
          }
        }
        if (item === 'createdAt') {
          this.modifyData[item] = getTimeCode(this.modifyData[item])
        }
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0)'
      })
      getCodedeby(this.modifyData.id, val, this.modifyData).then((res) => {
        loading.close()
        this.newPagefn()
        this.getData()
        if (val === 'success') {
          this.resultInfo('审批成功', 'success')
        }
        if (val === 'fail') {
          this.resultInfo('已打回，快去修改吧', 'warning')
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped>
  .menu-list{
    margin-bottom: 10px;
  }
  .parment{
    padding: 2px 5px
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
  @media screen and (max-width: 1400px) {
    .menu-list .btn-box.fl-right{
      float: left;
      margin-top: 10px;
    }
  }
</style>
