<template>
  <div>
    <el-dialog
      title="项目列表"
      :visible.sync="popVisible"
      width="60%"
      center>
      <div class="top">
        <div class="top-content">
          <el-select v-model="selectpartment" filterable placeholder="请选择部门" :disabled="roleId !== '1'">
            <el-option
              v-for="item in options.partments"
              :key="item.depCode"
              :label="item.depName"
              :value="item.depCode">
            </el-option>
          </el-select>
          <el-input v-model="cnName" placeholder="中文名称"></el-input>
          <el-input v-model="englishName" placeholder="英文名称"></el-input>
          <el-select v-model="selectLanguage" filterable placeholder="请选择语言栈">
            <el-option
              v-for="(item, index) in options.languages"
              :key="index"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-button  @click="handleSerchContionalData">查询</el-button>
        </div>
      </div>
      <div class="projectlist-warpper">
        <el-table
          v-loading.lock="loading"
          element-loading-text="拼命加载中..."
          :data="tableData3"
          tooltip-effect="dark"
          border
        >
          <el-table-column
            align="right"
            width="50"
          >
            <template slot-scope="scope">
              <el-radio
                v-model="radioVal"
                :label="scope.row.id"
                @change="handleChange(scope.row)"
              >
                &nbsp;
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            label="序号"
            align="center"
            prop="id"
            width="80"
          >
            <template slot-scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="组名/英文名"
            align="center"
          >
            <template slot-scope="scope">{{ `${scope.row.namespace}/${scope.row.projectName}` }}</template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="项目名"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.cnName }}</template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="GitUrl"
            align="center"
            show-overflow-tooltip>
            <template slot-scope="scope">{{ scope.row.sshUrlToRepo }}</template>
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
        </el-table>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="popVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitSlectedProject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCodeManageList, getCodeManagePartments, getCodeManageProjectLanguages } from '../../../api/code/index'
import { getCookie } from '../../../utils/cookie'
export default {
  name: 'CreatePop',
  data () {
    return {
      popVisible: false,
      loading: true,
      radioVal: '',
      selectpartment: '',
      selectLanguage: '',
      englishName: '',
      cnName: '',
      options: {
        partments: [],
        languages: []
      },
      selectedProject: '',
      tableData3: [],
      pagetotle: 0,
      pagesize: 10,
      currentPage: 1,
      roleId: ''
    }
  },
  created () {
    this._getCodeManagePartments()
    this._getCodeManageProjectLanguages()
    this._getUserpartment()
    this._getCodeManageList()
  },
  methods: {
    handleChange (selectedRow) {
      this.selectedProject = selectedRow
    },
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
    handleSubmitSlectedProject () {
      if (!this.selectedProject) {
        this.$message.warning('请选择一个项目！！！')
        return
      }
      this.$emit('backCreatePopData', this.selectedProject)
      this.popVisible = false
    },
    _getUserpartment () {
      const partment = JSON.parse(getCookie('userinfo')).depCode
      this.roleId = JSON.parse(getCookie('userinfo')).roleId
      this.selectpartment = partment
    },
    _getCodeManagePartments () {
      getCodeManagePartments()
        .then((res) => {
          this.options.partments = res.data.data
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
    _getCodeManageList () {
      const PARAMS = {
        depCode: this.selectpartment || '',
        cnName: this.cnName || '',
        projectName: this.englishName || '',
        projectType: this.selectLanguage || '',
        page: this.currentPage || '',
        pageSize: this.pagesize || '',
        status: 2
      }
      getCodeManageList(PARAMS)
        .then((res) => {
          this.tableData3 = res.data.data
          this.pagetotle = res.data.paging.total
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message.error(error.data.data)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.top {
  margin: 0 0 10px;
  display: flex;
  justify-content: space-between;
  .top-content {
    width: 70%;
    display: flex;
    justify-content: space-between;
    .el-input{
      display: inline-block;
      width:120px;
      margin-right:15px;
    }
    .el-select{
      margin-right:15px;
    }
  }
}
.pagination-wrapper{
  padding:20px 0;
  display: flex;
  justify-content: flex-end;
}
.el-radio.radioBtn .el-radio__label{
  display: none;
  background-color: red;
}
.el-radio{
 position:relative;
 right:-7px;
  color:#fff;
}
</style>
