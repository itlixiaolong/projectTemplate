<template>
  <!--角色管理-->
  <div class="menu_box">
    <!--搜索按钮-->
    <div class="menu_new">
        <div class="menu-left">
          <el-input
            v-model="roleName"
            :maxlength="20"
            class="search-one gap-right"
            placeholder="请输入角色名称"
            style="width: 160px"
          >
          </el-input>
          <el-button
            @click="searchEvt"
          >
            查询
          </el-button>
        </div>
        <div class="menu-right">
          <el-button
            @click="newPagefn"
            :disabled="!functions.add"
            type="primary">
            新增
          </el-button>
        </div>
    </div>
    <!--搜索按钮end-->
    <!--list列表-->
    <div class="menu_list">
      <div>
        <el-table
          ref="multipleTable"
          id="table-default"
          :data="getList"
          tooltip-effect="dark"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55"
            align="center"
           >
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="角色名称"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="roleCode"
            label="英文名称"
            header-align="center"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="permissions"
            label="权限"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" :disabled="!functions.authority" size="small" @click="power(scope.row.id)">权限</el-button>
            </template>
          </el-table-column>

          <el-table-column
            label="操作"
            header-align="center"
            align="center"
          >
            <template slot-scope="scope">
              <el-button type="text" :disabled="!functions.modify" size="small" @click="editor(scope.row)">编辑</el-button>
              <el-button type="text" :disabled="!functions.delet" size="small" @click="roleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <permission ref="rolePermission" v-if="isOk" :roleId="roleId" :functionsList="functionsList" :defaultCheckedKeys="defaultCheckedKeys" @backRolePermissionData="emitRolePermissionFun"></permission>
        <newAdd  ref="dialog" v-if="showNewlist" :setDialog ='showNewlist' v-on:showNewlist='newAdd'  :id="id" v-on:addlist='addlist'></newAdd>
        <editorPage ref="Updata" v-if="showEditor" :editflag="showEditor" v-on:editor="editor" :getOneList="getOneList" v-on:modifyFn='modifyFn'></editorPage>
      </div>
    </div>
    <!--list列表 end-->
    <!--分页start-->
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
    <!--分页end-->
  </div>
</template>

<script>
import mixin from '@/mixins/index'
import editorPage from './role-editor'
import newAdd from './role-add'
import permission from './role-permission'
import { getUserRightsTreeData } from 'api/userrights/index'
import { getUserRoleFunctionsData } from 'api/rbac/index'
import { geCharacterData, getCreateData, getUpdateData, getdeleteData } from '../../../api/rbac/index'
import { getFunctions } from 'utils/getFunctions'
export default {
  components: {
    newAdd, // 添加
    editorPage, // 编辑
    permission // 权限
  },
  computed: {
    isOk () {
      if (this.functionsList && this.defaultCheckedKeys) {
        return true
      } else {
        return false
      }
    }
  },
  data () {
    return {
      functionsList: '',
      defaultCheckedKeys: '',
      roleName: '',
      roleCode: '',
      roleId: 0,
      showNewlist: false,
      setDialog: false, // 新建弹层
      showEditor: false, // 编辑弹层
      showPower: false, // 查看权限
      editflag: false,
      id: 0,
      getList: [],
      newgeilist: [],
      pageObj: {},
      getOneList: {},
      codeData: '',
      pageindex: 1,
      pagesize: 20, // 每页20条
      pagetotle: 0, // 共100条
      multipleSelection: [],
      getAdded: [],
      getUPdata: [],
      updata: {},
      delearr: [],
      functions: {}
    }
  },
  mixins: [mixin],
  created () {
    this.functions = getFunctions(this)
    this.getData()
  },
  methods: {
    emitRolePermissionFun () {
      this.functionsList = ''
      this.defaultCheckedKeys = ''
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
    // 搜索
    searchEvt () {
      this.pageindex = 1
      this.getData()
    },
    // 新增
    newPagefn (index) {
      this.id = index
      if (this.showNewlist) {
        this.showNewlist = false
      } else {
        this.showNewlist = true
        this.newgeilist = this.getList.slice(index, index + 1)
      }
    },
    editor (index) { // 编辑
      this.id = index
      this.updata = index
      this.getOneList = index
      if (this.showEditor) {
        this.showEditor = false
      } else {
        this.showEditor = true
      }
    },
    // 新增
    newAdd () {
      if (this.newAdd) {
        this.newAdd = false
      } else {
        this.newAdd = true
      }
    },
    modifyFn () { // 确认修改
      let pars = {
        id: this.updata.id,
        roleCode: this.$refs.Updata.ruleForm.roleCode,
        roleName: this.$refs.Updata.ruleForm.roleName
      }
      getUpdateData(pars).then((res) => {
        if (res.data.code === 200) {
          this.getUPdata = res.data.data
          this.getData()
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        } else {
          this.$message({
            type: 'info',
            message: '修改失败!'
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    addlist () { // 确认添加
      let params = {
        roleCode: this.$refs.dialog.ruleForm.roleCode,
        roleName: this.$refs.dialog.ruleForm.roleName
      }
      getCreateData(params).then((res) => {
        if (res.data.code === 200) {
          this.getAdded = res.data.data
          this.getData()
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
        } else {
          this.$message({
            type: 'info',
            message: '添加失败!'
          })
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 查看权限
    power (roleId) {
      this.roleId = roleId
      this._getUserRightsTreeData()
      this._getUserRoleFunctionsData()
    },
    // 删除
    roleDelete (deId) {
      this.$confirm('此操作将永久删除该文件, 您确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        getdeleteData(deId.id).then((res) => {
          this.delearr = res.data.data
          this.getData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getData () { // 角色列表
      let params = {
        roleName: this.roleName
      }
      geCharacterData(params).then((res) => {
        this.getList = res.data.data
        this.pagetotle = res.data.paging.total
      }).catch((err) => {
        console.log(err)
      })
    },
    indexChange (val) { // 翻页
      this.pageindex = val
      this.getData()
    },
    sizeChange (val) { // 翻页
      this.pagesize = val
      this.getData()
    },
    refreshFn () {
      this.getData()
    },
    _getUserRightsTreeData () {
      const PARAMS = {
        roleId: this.roleId
      }
      getUserRightsTreeData(PARAMS)
        .then((res) => {
          if (res.data.code === 200) {
            this.functionsList = res.data.data
            this._createdFormatDataToTree(this.functionsList[0].children)
          }
        })
        .catch((error) => {
          this.$message.error(error.response.data.message)
        })
    },
    _getUserRoleFunctionsData () {
      const PARAMS = {
        roleId: this.roleId
      }
      getUserRoleFunctionsData(PARAMS)
        .then((res) => {
          if (res.data.code === 200) {
            this.defaultCheckedKeys = res.data.data
          }
        })
        .catch((error) => {
          this.$message.error(error.response.data.message)
        })
    },
    _createdFormatDataToTree (item) {
      if (item.length > 0) {
        item.forEach(ele => {
          if (!ele.children.length) {
            ele.children = ele.functions
            ele.children.forEach((item) => {
              item.functions = []
            })
          } else {
            this._createdFormatDataToTree(ele.children)
          }
        })
      } else {
        item.children = item.functions
      }
    }
  }
}
</script>

<style scoped>
.menu_box{
    width: 100%;
    height: 100%;
    padding: 0 10px 0 10px;
    box-sizing: border-box;

}
.title{
    display: inline-block;
}
.add{
    font-size: 16px;
}

.menu_new .menu_btn{
    border: none;
    background-color: #409EFF;
    color:#ffffff;
    height: 40px;
}
/*分页*/
.pagination-box{
    padding: 20px 0;
    background: #fff;
}
.pagination-box .el-pagination{
    float: right;
}
</style>
