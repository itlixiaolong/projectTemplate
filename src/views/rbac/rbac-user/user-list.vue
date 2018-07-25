<template>
  <div>
    <!--用户管理上部分start-->
    <div class="menu_new">
      <div class="menu-left">
        <el-select class="gap-right" v-model="searchDept"  value-key="depCode" placeholder="请选择部门" :disabled="roleId !== '1'">
          <el-option
            v-for="(item,index) in deptOptions"
            :key="index"
            :label="item.depName"
            :value="item.depCode"
          >
          </el-option>
        </el-select>
        <el-input v-model="emplId"
                  placeholder="请输入工号"
                  class="search-one gap-right"
                  maxlength="20"
                  style="width: 203px;">

        </el-input>
        <el-input v-model="name"
                  placeholder="请输入姓名"
                  class="search-one gap-right"
                  maxlength="20"
                  style="width: 203px;">
        </el-input>
        <el-button
                @click="searchEvt"
        >
          查询
        </el-button>
      </div>
      <div class="menu-right">
        <el-button
          :disable="!functions.updateData"
          @click="synData"
          type="primary">
          同步数据
        </el-button>
      </div>
    </div>

    <!--用户管理上部分end-->
    <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%;
            margin-top: 12px"
            border
            center
            @selection-change="handleSelectionChange">
      <el-table-column
              type="selection"
              align="center">
      </el-table-column>
      <el-table-column
              label="序号"
              type="index"
              header-align="center"
              align="center"
              width="60"
      >
      </el-table-column>
      <el-table-column
              prop="emplId"
              label="工号"
              align="center"
      >
      </el-table-column>
      <el-table-column
              prop="name"
              label="姓名"
              align="center">
      </el-table-column>
      <el-table-column
              prop="mail"
              label="邮箱"
              align="center"
              width="300"
      >
      </el-table-column>
      <el-table-column
              prop="jobDesc"
              label="岗位"
              align="center">
      </el-table-column>
      <el-table-column
              prop="depName"
              label="部门"
              align="center">
      </el-table-column>
      <el-table-column
              prop="operation"
              label="操作"
              align="center"
              show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" :disable="!functions.roleAllot" size="small"  @click="power(scope.row)">分配角色</el-button>
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
    <div v-show="isShowTransferPop">
      <transfer
        ref="transfer"
        v-if="roleDate.length>0"
        :incomingData="roleDate"
        :incomingDefault='hasRole'
        :propsOption="propsOption"
        :selectOne="selectOne"
        @backTransferData="emitTransferFun"
      ></transfer>
    </div>
  </div>
</template>

<script>

import mixin from '@/mixins'
import DataTable from '@/components/datatable/index'
import Transfer from '@/components/transfer/transfer'
import { getMaster, geCharacterData, setroleData } from 'api/rbac/index'
import {getCodedepartment} from '@/api/code/index'
import { getSessionStorage } from 'utils/storage'
import { getCookie } from 'utils/cookie'
export default {
  components: {
    DataTable,
    Transfer // 分配角色
  },
  mixin: [mixin],
  data () {
    return {
      showPower: false, // 分配角色
      isShowTransferPop: true,
      emplId: '',
      name: '',
      searchDept: '', // 选择部门
      work_value: '',
      newgeilist: [],
      deptOptions: [],
      prop: [], //
      tableData: [],
      pageindex: 1,
      pagesize: 20,
      pagetotle: 47,
      total: 463,
      multipleSelection: [],
      page: {},
      selectOne: true,
      roleDate: [],
      hasRole: [],
      selectUserId: '',
      titleText: ['公司部门', '已分配部门'],
      propsOption: {
        key: 'roleCode',
        label: 'roleName'
      },
      functions: {},
      roleId: ''
    }
  },
  created () {
    this.functions = JSON.parse(getSessionStorage('functions'))['/']['/rbac']['/user-list']
    this.roleId = JSON.parse(getCookie('userinfo')).roleId
    this.searchDept = JSON.parse(getCookie('userinfo')).depCode
    this.getData()
    this.getRoleDate()
    this.getDeptOptions()
  },
  methods: {
    getData () {
      let params = {
        page: this.pageindex,
        pageSize: this.pagesize,
        emplId: this.emplId,
        name: this.name,
        deptId: this.searchDept
      }
      getMaster(params).then((res) => { // master用户接口
        this.tableData = []
        let data = res.data.data
        this.page = res.data.paging
        this.tableData = data
        this.pagetotle = this.page.total
      }).catch(err => {
        console.log(err)
      })
    },
    getRoleDate () { // 角色列表
      geCharacterData().then((res) => {
        this.roleDate = res.data.data
      }).catch((err) => {
        console.log(err)
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
      this.multipleSelection = val
    },
    searchEvt () {
      this.pageindex = 1
      this.getData()
    },
    // 分配角色
    power (item) {
      this.hasRole = []
      this.$refs.transfer.dialogVisible = true
      this.selectUserId = item.emplId
      this.hasRole.push(
        this.roleDate.find((role) => {
          return role.id === item.roleId
        })
      )
    },
    // 分配角色
    emitTransferFun (targetDataObj, ids) {
      if (targetDataObj.length > 0) {
        let params = {
          emplId: this.selectUserId,
          roleId: targetDataObj[0].id
        }
        setroleData(params).then(res => {
          this.getData()
          this.$message({
            type: 'success',
            message: '分配成功'
          })
          this.$refs.transfer.dialogVisible = false
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.$message({
          type: 'warning',
          message: '用户至少拥有一个角色'
        })
      }
    },
    // 同步数据
    synData () {
      this.$confirm('数据会和PS同步，确定是否需要', '注意').then(() => {
        this.$message({
          type: 'success',
          message: '同步成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    getDeptOptions () { // 获取部门
      getCodedepartment().then((res) => {
        this.deptOptions = res.data.data
        this.deptOptions.unshift({depName: '全部', depCode: ''})
      }).catch(err => {
        console.log(err)
      })
    },
    // 分页相关方法
    indexChange (val) {
      this.pageindex = val
      this.getData()
    },
    sizeChange (val) {
      this.pagesize = val
      this.getData()
    }
  }
}
</script>

<style scoped>
  .input{
    display: inline-block;
  }
  .pagination-box{
    float: right;
    margin-top: 20px;
  }
</style>
