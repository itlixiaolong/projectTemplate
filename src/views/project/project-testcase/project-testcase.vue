<template>
  <div>
    <div class="project-testcase">
      <div class="search-wrapper">
        <el-select v-model="selectedPartment" placeholder="请选择部门" :disabled="roleId !== '1'">
          <el-option
            v-for="item in partmentsOptions"
            :value="item.depCode"
            :label="item.depName"
            :key="item.depCode"
          >
          </el-option>
        </el-select>
        <el-select v-model="selectedProject" placeholder="请选择项目" @change="handleChangeProject">
          <el-option
            v-for="item in projectOptions"
            :value="item.label"
            :key="item.label"
          >
          </el-option>
        </el-select>
        <el-select v-model="selectedVersion" placeholder="请选择版本">
          <el-option
            v-for="item in versionOptions"
            :value="item.label"
            :key="item.label"
          >
          </el-option>
        </el-select>
        <el-button
          @click="handleSerchContionalData"
        >
          查询
        </el-button>
      </div>
    </div>

    <el-table
      v-loading.body="loading"
      :data="dataList"
      border
      style="width: 100%;"
    >
      <el-table-column
        label="序号"
        prop="id"
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
        label="测试用例数"
        prop="testCase"
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
          <el-button type="text" :disabled="!functions.modify" size="small" @click="handlemodifyThis(scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagetotle"
        :page-size="pagesize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentPageChange"
        @prev-click="handlePrevPageChange"
        @next-click="handleNextPageChange"
      >
      </el-pagination>
    </div>
    <test-case-pop v-if="this.incomingData" :data="incomingData" ref="testCasePop" @backTestCasePopData="emitTestCaseFun"></test-case-pop>
  </div>
</template>

<script>
import { getProjectTestCaseData, getProjectTestCasePartments, getProjectTestCaseProjectData, putModifiedTestCaseData } from '../../../api/project/index'
import TestCasePop from './testcase-pop'
import { getCookie } from 'utils/cookie'
import { getFunctions } from 'utils/getFunctions'
export default {
  name: 'ProjectTestCase',
  components: {
    TestCasePop
  },
  data () {
    return {
      incomingData: {},
      partmentsOptions: [],
      projectOptions: [],
      versionOptions: [],
      dataList: [],
      selectedPartment: '',
      selectedProject: '',
      selectedVersion: '',
      currentPage: 1,
      projects: [],
      pagesize: 10,
      pagetotle: 0,
      loading: false,
      functions: {},
      roleId: ''
    }
  },
  created () {
    this.functions = getFunctions(this)
    this._getProjectTestCaseProjectData()
    this._getProjectTestCasePartments()
    this.roleId = JSON.parse(getCookie('userinfo')).roleId
    this.selectedPartment = JSON.parse(getCookie('userinfo')).depCode
  },
  methods: {
    handleChangeProject (selectedProject) {
      this.versionOptions = []
      for (let version of this.projects[selectedProject]) {
        this.versionOptions.push({
          label: version.projectVersion,
          value: version.projectVersion
        })
      }
      this.selectedVersion = this.versionOptions[0].label
    },
    emitTestCaseFun (data, depCode, id) {
      this._putModifiedTestCaseData(data, depCode, id)
    },
    handlemodifyThis (data) {
      this.incomingData = data
      setTimeout(() => {
        this.$refs.testCasePop.dialogVisible = true
      }, 20)
    },
    handleSizeChange (pageSize) {
      this.pagesize = pageSize
      this._getProjectTestCaseData()
    },
    handleCurrentPageChange (page) {
      this.currentPage = page
      this._getProjectTestCaseData()
    },
    handlePrevPageChange () {
      this._getProjectTestCaseData()
    },
    handleNextPageChange () {
      this._getProjectTestCaseData()
    },
    handleSerchContionalData () {
      this._getProjectTestCaseData()
    },
    _getProjectTestCaseProjectData () {
      getProjectTestCaseProjectData().then(res => {
        const _THIS = this
        const PROJECTS = res.data
        this.projects = res.data
        for (let project in PROJECTS) {
          _THIS.projectOptions.push({
            label: project,
            value: project
          })
        }
        _THIS.selectedProject = _THIS.projectOptions[0].label
        for (let version of PROJECTS[_THIS.selectedProject]) {
          _THIS.versionOptions.push({
            label: version.projectVersion,
            value: version.projectVersion
          })
        }
        _THIS.selectedVersion = _THIS.versionOptions[0].label
        _THIS._getProjectTestCaseData()
      }).catch(err => {
        console.log(err)
      })
    },
    _getProjectTestCaseData () {
      const PARAMS = {
        depCode: this.selectedPartment || '',
        version: this.selectedVersion || '',
        page: this.currentPage || '',
        pageSize: this.pagesize || ''
      }
      getProjectTestCaseData(PARAMS).then(res => {
        if (res.data.code === 200) {
          this.dataList = res.data.data
          this.pagetotle = res.data.paging.total
        }
      }).catch(err => {
        console.log(err)
      })
    },
    _getProjectTestCasePartments () {
      getProjectTestCasePartments().then(res => {
        if (res.data.code === 200) {
          this.partmentsOptions = res.data.data
          this.partmentsOptions.unshift({depName: '全部', depCode: ''})
        }
      }).catch(err => {
        console.log(err)
      })
    },
    _putModifiedTestCaseData (newTestcase, depName, id) {
      const PARAMS = {
        depName: depName,
        testCase: newTestcase
      }
      putModifiedTestCaseData(PARAMS, id).then(res => {
        if (res.data.code === 200) {
          this.$message.success('恭喜您,用例数修改成功!!!')
          this._computeDataList(newTestcase, depName)
        }
      }).catch(err => {
        this.$message.error('修改出错了!!!')
        console.log(err)
      })
    },
    _computeDataList (newTestcase, depName) {
      for (let item of this.dataList) {
        if (item.depName === depName) {
          item.testcase = newTestcase
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-wrapper{
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-start;
  .el-select{
    margin-right: 15px;
    &:last-child{
      margin-right:0px;
    }
  }
  }
.pagination-wrapper{
  display: flex;
  justify-content: flex-end;
  padding:20px 0;
}
</style>
