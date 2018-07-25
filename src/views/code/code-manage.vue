<template>
<div class="code-manage">
  <div class="top">
    <div class="top-left">
      <el-select v-model="selectpartment" placeholder="请选择部门" :disabled="roleId !== '1'">
        <el-option
          v-for="item in options.partments"
          :key="item.depCode"
          :label="item.depName"
          :value="item.depCode">
        </el-option>
      </el-select>
      <el-input v-model="cnName" placeholder="项目名称"></el-input>
      <el-input v-model="englishName" placeholder="英文名称"></el-input>
      <el-select v-model="selectLanguage" filterable placeholder="请选择语言栈">
        <el-option
          v-for="(item, index) in options.languages"
          :key="index"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      <el-select v-model="selectAppStatus" filterable placeholder="请选择审批状态">
        <el-option
          v-for="item in options.appstatus"
          :key="item.code"
          :label="item.description"
          :value="item.code">
        </el-option>
      </el-select>
      <el-button  @click="handleSerchContionalData">查询</el-button>
    </div>
    <div class="top-right">
      <el-button @click="handleApplyFor" type="primary" :disabled="!functions.apply">申请</el-button>
      <el-button @click="handleChangePartment"  type="primary" :disabled="!functions.change">变更部门</el-button>
      <el-button @click="handleSynchroGitLab" type="primary" :disabled="!functions.updateData">同步GitLab</el-button>
    </div>
  </div>
  <div class="bottom">
    <el-table
      v-loading.body="loading"
      element-loading-text="拼命加载中..."
      ref="multipleTable"
      :data="tableData3"
      tooltip-effect="dark"
      border
      @selection-change="handleSelectionChange"
      >
      <el-table-column
        type="selection"
        align="center"
        >
      </el-table-column>
      <el-table-column
        label="序号"
        type="index"
        :index="indexMethod"
        align="center"
        width="80"
        >
      </el-table-column>
      <el-table-column
        prop="name"
        label="组名/英文名"
        align="center"
        show-overflow-tooltip
       >
        <template slot-scope="scope">{{ `${scope.row.namespace}/${scope.row.projectName}` }}</template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="项目名称"
        align="center"
        width="130"
        show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.cnName }}</template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="GitUrl"
        align="center"
        class-name="copyBtnParent"
        show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.sshUrlToRepo }}<el-button size="small" class="copyBtn" @click="handleBtnCopy(scope.row.sshUrlToRepo)">拷贝</el-button></template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="创建时间"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope"><span v-fomatTime="scope.row.createdAt"></span></template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="语言栈"
        align="center"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.projectType }}</template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="所属部门"
        align="center"
        show-overflow-tooltip>
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
        prop="address"
        label="操作"
        align="center"
        width="230"
      >
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="jump2GitLab(scope.row.webUrl)" :disabled="!functions.gitlab">GitLab</el-button>
        <el-button type="text" size="small" @click="handleEditThis(scope.row)" v-show="scope.row.status === 3">编辑</el-button>
        <el-button type="text" size="small" @click="handleViewThis(scope.row.id)">查看</el-button>
        <el-button type="text" size="small"  @click="jump2pipeLineManagerPage(scope.row.projectName)" :disabled="!functions.piplineManage">流水线管理</el-button>
      </template>
      </el-table-column>
      ]5sdq
    </el-table>
  </div>
  <div class="transfer-wrapper" v-show="isShowTransferPop">
    <transfer v-if="incomingPartments.length" :incomingData='incomingPartments' :incomingDefault='multipleSelection' ref="transfer" :propsOption="propsOption" @backTransferData="emitTransferFun"></transfer>
  </div>
   <div class="codeView-wrapper" v-show="selectProject">
    <code-edit v-if="selectProject" :selectProject="selectProject"  :partments="options.partments" :languages="options.languages" ref="codeEdit" @backCodeEditData="emitCodeEditFun"></code-edit>
  </div>
  <div class="pagination-wrapper">
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagetotle"
      :page-size="pagesize"
      :current-page.sync="currentPage"
      @size-change="handlesSizeChange"
      @current-change="handleCurrentPageChange"
      @prev-click="handlePrevPageChange"
      @next-click="handleNextPageChange"
    >
    </el-pagination>
  </div>
</div>
</template>
<script>
import CodeEdit from './code-edit'
import { getCodeManageList, getCodeManagePartments, getCodeManageAppstatus, getCodeManageProjectLanguages, getCodeManageGitLabData, postCodeMannageDepartments } from '../../api/code/index'
import { getCookie } from 'utils/cookie'
import { getFunctions } from 'utils/getFunctions'
import Transfer from '../../components/transfer/transfer'
import mixin from '../../mixins/index'
export default {
  name: 'CodeManage',
  components: {
    Transfer,
    CodeEdit
  },
  mixins: [mixin],
  data () {
    return {
      loading: true,
      tableData3: [],
      options: {
        partments: [],
        appstatus: [],
        languages: [],
        projectGroups: []
      },
      englishName: '',
      cnName: '',
      selectpartment: '',
      selectLanguage: '',
      selectAppStatus: '',
      selectProject: '',
      copyBtnParent: 'copycopyBtnParentSty',
      isShowTransferPop: true,
      partMentNameArr: [],
      multipleSelection: [],
      titleText: ['公司部门', '已分配部门'],
      isDelete: false,
      deleteItemId: '',
      isJumpGitHub: false,
      selectDepart: [],
      selectDepartID: [],
      isPipeLineManage: false,
      propsOption: {
        key: 'depCode',
        label: 'depName'
      },
      pagetotle: 0,
      pagesize: 10,
      currentPage: 1,
      functions: '',
      roleId: '',
      incomingPartments: []
    }
  },
  created () {
    this._getCodeManagePartments()
    this._getCodeManageProjectLanguages()
    this._getCodeManageAppstatus()
    this._getUserpartment()
    this._getCodeManageList()
    this.functions = getFunctions(this)
    this.roleId = JSON.parse(getCookie('userinfo')).roleId
  },
  methods: {
    handlesSizeChange (pageSize) {
      this.pagesize = pageSize
      this._getCodeManageList()
    },
    handleCurrentPageChange (page) {
      this.currentPage = page
      this._getCodeManageList()
    },
    handlePrevPageChange () {
      this._getCodeManageList()
    },
    handleNextPageChange () {
      this._getCodeManageList()
    },
    handleSerchContionalData () {
      this._getCodeManageList()
    },
    handleSynchroGitLab () {
      this.loading = true
      this._getCodeManageGitLabData()
    },
    handleApplyFor () {
      this.$router.push({
        path: `/code-create`
      })
    },
    indexMethod (index) {
      return (this.currentPage - 1) * this.pagesize + index
    },
    // 穿梭框组件触发的回调
    emitTransferFun (targetDataObj, ids) {
      this._postCodeMannageDepartments(targetDataObj, ids)
    },
    // 项目编辑组件触发的回调
    emitCodeEditFun (data) {
      this._getCodeManageList()
    },
    // 点击复制gitlab地址
    handleBtnCopy (sshUrlToRepo) {
      let inputBox = document.createElement('input')
      inputBox.value = sshUrlToRepo
      document.body.appendChild(inputBox)
      inputBox.select()
      document.execCommand('Copy')
      inputBox.style.display = 'none'
      this.resultInfo('拷贝成功', 'success')
    },
    // 点击跳转gitlab
    jump2GitLab (url) {
      if (!url) {
        this.$message.warning('该项目还未审批通过,请耐心等待!!!')
      } else {
        window.open(url)
      }
    },
    // 点击进行当条数据的编辑
    handleEditThis (project) {
      this.selectProject = project
      setTimeout(() => {
        this.$refs.codeEdit.dialogVisible = true
      }, 20)
    },
    // 点击跳转项目查看页面
    handleViewThis (id) {
      this.$router.push({
        path: `/code-viewpage/${id}`
      })
    },
    // 点击跳转到流水线管理页面
    jump2pipeLineManagerPage (projectName) {
      this.$router.push({
        path: `/pipeline-list/${projectName}`
      })
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.selectDepart = val
    },
    // 点击变更部门操作
    handleChangePartment () {
      this.selectDepartID = []
      if (!this.selectDepart || this.selectDepart.length === 0) {
        this.messageInfo('请先选择一个项目!', 'warning')
        return
      } else if (this.selectDepart && this.selectDepart.length > 1) {
        let isAllEqual = this._isAllEqual(this.selectDepart)
        if (!isAllEqual) {
          this.messageInfo('请先去掉不是同一部门的项目!', 'warning')
          return
        }
      }
      for (var i = 0; i < this.selectDepart.length; i++) {
        this.selectDepartID.push(this.selectDepart[i].id)
      }

      this.multipleSelection = this.selectDepart[0].projectDepartments
      this.isShowTransferPop = true
      this.$refs.transfer.dialogVisible = true
    },
    // 获取当前页面项目列表
    _getCodeManageList () {
      const param = {
        depCode: this.selectpartment || '',
        cnName: this.cnName || '',
        projectName: this.englishName || '',
        projectType: this.selectLanguage || '',
        status: this.selectAppStatus || '',
        page: this.currentPage || '',
        pageSize: this.pagesize || ''
      }
      const _this = this
      getCodeManageList(param).then((res) => {
        _this.tableData3 = res.data.data
        _this.pagetotle = res.data.paging.total
        _this.loading = false
      })
        .catch(function (error) {
          _this.loading = false
          console.log(this)
          console.log(error)
        })
    },
    _getCodeManagePartments () {
      getCodeManagePartments()
        .then((res) => {
          this.options.partments = res.data.data
          this.incomingPartments = [...res.data.data]
          this.options.partments.unshift({depName: '全部', depCode: ''})
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    _getCodeManageAppstatus () {
      getCodeManageAppstatus()
        .then((res) => {
          this.options.appstatus = res.data.data
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    _getCodeManageProjectLanguages () {
      getCodeManageProjectLanguages()
        .then((res) => {
          this.options.languages = res.data.data
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    _getCodeManageGitLabData () {
      getCodeManageGitLabData()
        .then((res) => {
          if (res.data.code === 200) {
            this.$message.success('gitlab数据同步成功')
            this.loading = false
          }
        })
        .catch((error) => {
          this.$message.error('gitlab数据同步失败')
          this.loading = false
          console.log(error)
        })
    },
    _postCodeMannageDepartments (targetDataObj, ids) {
      const params = this._formatParams(targetDataObj, this.selectDepartID)
      postCodeMannageDepartments(params)
        .then((res) => {
          if (res.data.code === 200) {
            this.$message.success('恭喜您,变更部门成功!!!')
            this._computedTableData3(targetDataObj, this.selectDepartID)
            this.$refs.transfer.dialogVisible = false
          }
        })
        .catch((error) => {
          this.$message.error('变更部门失败了!!!')
          console.log(error)
        })
    },
    _getUserpartment () {
      const partment = JSON.parse(getCookie('userinfo')).depCode
      this.selectpartment = partment
    },
    // 判断数组是否完全相等
    _isAllEqual (arr) {
      const array = arr
      if (array.length > 0) {
        return !array.some(function (value, index) {
          return value.projectDepartments.sort().toString() !== array[0].projectDepartments.sort().toString()
        })
      } else {
        return true
      }
    },
    _computedTableData3 (partmentsObj, ids) {
      const _this = this
      ids.forEach((id) => {
        _this.tableData3.forEach((item) => {
          if (item.id === id) {
            item.projectDepartments = partmentsObj
          }
        })
      })
    },
    _formatParams (targetDataObj, ids) {
      const params = []

      for (let item of ids) {
        const parementsArr = []
        for (let ele of targetDataObj) {
          const decode = ele.depCode
          ele = {}
          ele.projectId = item
          ele.depCode = decode
          parementsArr.push(ele)
        }
        params.push({
          id: item,
          projectDepartments: parementsArr
        })
      }
      console.log(params)
      return params
    }
  }
}
</script>
<style lang="less" scoped>
.top{
  margin: 0 0 10px;
  display: flex;
  justify-content: space-between;
  .top-left{
    width:62%;
    display: flex;
    justify-content: space-between;
  }
  .top-right{
    /*min-width:27%;*/
    display: flex;
    justify-content: flex-start;
  }
  .bottom{
    .copycopyBtnParentSty{
      position:relative !important;
      .copyBtn{
        position:absolute;
        background-color: red;
      }
    }
  }

}

.parment{
    padding: 2px 5px
  }
.copyBtn{
  position:absolute;
  padding: 2px 4px;
  bottom: 4px;
  right: 4px;
 }
.el-input{
  display: inline-block;
  width:120px;
  margin-right:15px;
}
.el-select{
  margin-right:15px;
}
.pagination-wrapper{
  padding:20px 0;
  display: flex;
  justify-content: flex-end;
}

</style>
<style lang="less">
  .el-table td.copyBtnParent .cell{
    padding-right: 46px !important;
    position: relative;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .code-manage {
    .el-table .cell{
      white-space: nowrap;
    }
  }
</style>
