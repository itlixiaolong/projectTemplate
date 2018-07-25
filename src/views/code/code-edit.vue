<template>
  <el-dialog title="项目信息" :visible.sync="dialogVisible">
    <el-form :model="projectData" :rules="rules"  ref="ruleForm" label-width="100px" class="demo-ruleForm"
      >
      <el-form-item label="申请部门" prop="partment">
        <el-select v-model="projectData.partment" placeholder="部门名称" width="97%">
          <el-option
            v-for="item in partments"
            :key="item.value"
            :label="item.depName"
            :value="item.depCode"
          >
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="技术栈" prop="projectType">
          <el-select v-model="projectData.projectType"  placeholder="请选择语言栈">
            <el-option
              v-for="item in languages"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <div class="cre_name">
          <el-form-item label="项目名称" prop="cnName">
            <el-input v-model="projectData.projectName"></el-input>
          </el-form-item>
          <el-form-item label="中文名称" prop="projectName">
            <el-input v-model="projectData.cnName"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="项目描述" prop="description">
          <el-input type="textarea" v-model="projectData.description"></el-input>
        </el-form-item>
        <el-form-item label="管理项目组" prop="projectGroup">
          <el-select v-model="projectData.namespace" placeholder="项目组名称">
            <el-option
              v-for="item in projectGroups"
              :label="item"
              :value="item"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="projectNote">
          <el-input v-model="projectData.approveComment" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
  </el-dialog>
</template>
<script>
import { getCodeManageProjectGroups, putSubmitEditData } from '../../api/code/index'
export default {
  name: 'CodeEdit',
  props: {
    selectProject: {
      type: Object,
      default () {
        return {}
      }
    },
    partments: {
      type: Array,
      default () {
        return []
      }
    },
    languages: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data  () {
    return {
      projectData: {
        projectDepartments: [],
        namespace: '',
        projectNote: '',
        pathWithNamespace: '',
        projectDesc: '',
        cnName: '',
        description: '',
        approveComment: '',
        projectType: '',
        partment: '',
        comment: '',
        createdAt: '',
        defaultBranch: '',
        id: '',
        lastActivityAt: '',
        page: '',
        pageSize: '',
        projectCode: '',
        projectName: '',
        projectUsers: '',
        sshUrlToRepo: '',
        start: '',
        status: '',
        webUrl: ''
      },
      projectGroups: [],
      dialogVisible: false,
      rules: { // 校验
        partment: [
          {required: true, message: '请选择申请部门', trigger: 'change'}
        ],
        cnName: [
          {required: true, message: '请输入项目名称', trigger: 'blur'}
        ],
        projectName: [
          {required: true, message: '请输入英文项目名称', trigger: 'blur'}
        ],
        projectType: [
          {required: true, message: '请选择一个技术类型', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请填写项目介绍', trigger: 'blur'}
        ],
        projectGroup: [
          {required: false, message: '请选择一个项目组', trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this._getCodeManageProjectGroups()
    Object.assign(this.projectData, this.selectProject)
    this.projectData.partment = this.projectData.projectDepartments[0] ? this.projectData.projectDepartments[0].depCode : ''
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this._handleSubmitEditData()
        } else {
          this.$message.warning('项目信息修改失败,请检查输入信息是否有误!!!')
          return false
        }
      })
    },
    resetForm (formName) { // 重置
      this.$refs[formName].resetFields()
    },
    _clearProjectDtata () {
      this.projectData = {
        projectDepartments: [],
        namespace: '',
        projectNote: '',
        pathWithNamespace: '',
        projectDesc: '',
        cnName: '',
        description: '',
        approveComment: '',
        projectType: '',
        partment: '',
        comment: '',
        createdAt: '',
        defaultBranch: '',
        id: '',
        lastActivityAt: '',
        page: '',
        pageSize: '',
        projectCode: '',
        projectName: '',
        projectUsers: '',
        sshUrlToRepo: '',
        start: '',
        status: '',
        webUrl: ''
      }
    },
    _getCodeManageProjectGroups () {
      const _this = this
      const params = {
        skillType: this.selectProject.projectType || ''
      }
      getCodeManageProjectGroups(params).then((res) => {
        _this.projectGroups = res.data.data
      })
    },
    _handleSubmitEditData () {
      const ID = this.projectData.id
      const params = this.projectData
      putSubmitEditData(ID, params).then((res) => {
        if (res.data.code === 200) {
          this.$message.success('项目信息修改成功!!!')
          this.$emit('backCodeEditData', this.projectData)
          this.dialogVisible = false
        }
      })
        .catch((res) => {
          this.$messsage.error('提交修改信息失败,请稍后重试!!!')
        })
    }
  },
  watch: {
    selectProject () {
      this._clearProjectDtata()
      Object.assign(this.projectData, this.selectProject)
      this.projectData.partment = this.projectData.projectDepartments[0] ? this.projectData.projectDepartments[0].depCode : ''
    }
  }
}
</script>

<style scoped>
  .create_box{
    width: 100%;
    margin-top: 35px;
  }
  .el-select{
    width: 99%;
  }
  .el-checkbox-group{
    float: left;
    margin-left: 13px;
  }
  .cre_name{
    width: 100%;
    display: flex;
  }
  .cre_name .el-form-item{
    width: 41%;
  }
  .el-form-item{
    margin-bottom: 35px;
  }
</style>
