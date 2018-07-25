<template>
  <div class="create_box">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
      >
    <el-form-item label="申请部门" prop="depart">
      <el-select v-model="ruleForm.depart" placeholder="部门名称" width="100%" :disabled="roleId !== '1'">

        <el-option
           v-for="item in partments"
           :key="item.depCode"
           :label="item.depName"
           :value="item.depCode"
        >
        </el-option>

      </el-select>
    </el-form-item>
    <el-form-item label="技术栈" prop="projectType">
      <el-radio-group
        v-model="ruleForm.projectType"
      >
        <el-radio
           v-for="(language, index) in languages"
           :label="language"
           :key="index"
        >
        </el-radio>

      </el-radio-group>
    </el-form-item>
    <div class="cre_name">
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="ruleForm.projectName" placeholder="项目名称"></el-input>
      </el-form-item>
      <el-form-item label="中文名称" prop="cnName">
        <el-input v-model="ruleForm.cnName" placeholder="中文名称"></el-input>
      </el-form-item>
    </div>
    <el-form-item label="项目描述" prop="description">
      <el-input type="textarea" v-model="ruleForm.description" placeholder="项目描述" ></el-input>
    </el-form-item>
    <el-form-item label="项目所属组" prop="namespace">
      <el-select v-model="ruleForm.namespace" placeholder="所属组名" @focus="handleDropDownList">
        <el-option
          v-for="item in projectGroups"
          :label="item"
          :value="item"
          :key="item"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="备注" prop="comment">
       <el-input v-model="ruleForm.comment" placeholder="备注信息"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmitForm('ruleForm')">立即创建</el-button>
      <el-button @click="handleResetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>
<script>
import { getCodeManageProjectGroups, getCodeManagePartments, getCodeManageProjectLanguages, postCodeCreateFormData } from 'api/code/index'
import { getCookie } from 'utils/cookie'
import { regx1, regx2 } from 'utils/regex'
export default {
  name: 'CodeCreate',
  data  () {
    var projectFn = (rule, value, callback) => { // 验证英文名称
      let English = new RegExp(regx1)
      let Engli = new RegExp(regx2)
      if (value === '') {
        callback(new Error('请输入英文名称！'))
        return
      } else if (!English.test(value)) {
        callback(new Error('请输入正确的项目名称'))
        return
      } else if (Engli.test(value)) {
        callback(new Error('不能包含空格'))
        return
      }
      callback()
    }
    return {
      roleId: '',
      userInfo: {},
      languages: [], // 单选框
      partments: [],
      projectGroups: [],
      getDataList: [],
      ruleForm: {
        cnName: '', // 项目名称
        projectType: '', // 技术栈
        description: '', // 项目描述
        projectName: '', // 项目名称
        namespace: '', // 申请项目组
        projectDepartments: [], // 申请部门
        comment: '', // 备注
        depart: ''
      },
      rules: { // 校验
        depart: [
          {required: true, message: '请选择申请部门', trigger: 'change'}
        ],
        cnName: [
          {required: true, message: '请输入中文名称', trigger: 'blur'}
        ],
        projectName: [
          {required: true, validator: projectFn, trigger: 'blur'}
        ],
        projectType: [
          {required: true, message: '请至少选择一个技术类型', trigger: 'change'}
        ],
        description: [
          {required: true, message: '请填写项目介绍', trigger: 'blur'}
        ],
        namespace: [
          {required: true, message: '请选择项目组', trigger: 'change'}
        ]
      }
    }
  },
  created () {
    this.userInfo = JSON.parse(getCookie('userinfo'))
    this.roleId = this.userInfo.roleId
    this.ruleForm.depart = this.userInfo.depCode
    this._getCodeManagePartments()
    this._getCodeManageProjectLanguages()
  },
  methods: {
    handleDropDownList () {
      if (!this.ruleForm.projectType) {
        this.$message({
          showClose: true,
          message: '请先选择技术栈!!!',
          type: 'warning'
        })
      }
    },
    handleSubmitForm (formName) { // 立即构建
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.projectUsers = [
            {
              'emplId': this.userInfo.emplId
            }
          ]
          this.ruleForm.projectDepartments.push({depCode: this.ruleForm.depart})
          delete this.ruleForm.depart
          this._postCodeCreateFormData(this.ruleForm)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleResetForm (formName) { // 重置
      this.$refs[formName].resetFields()
    },
    _getCodeManageProjectGroups () {
      const params = {
        skillType: this.ruleForm.projectType || ''
      }
      getCodeManageProjectGroups(params).then((res) => { // 管理项目组
        if (res.data.code === 200) {
          this.projectGroups = res.data.data
        }
      })
        .catch((error) => {
          console.log(error)
        })
    },
    _getCodeManagePartments () { // 部门
      getCodeManagePartments().then((res) => {
        if (res.data.code === 200) {
          this.partments = res.data.data
        }
      })
        .catch((error) => {
          console.log(error)
        })
    },
    _getCodeManageProjectLanguages () { // 技术栈
      getCodeManageProjectLanguages().then((res) => {
        if (res.data.code === 200) {
          this.languages = res.data.data
        }
      })
        .catch((error) => {
          console.log(error)
        })
    },
    _postCodeCreateFormData (params) {
      postCodeCreateFormData(params).then((res) => {
        if (res.data.code === 200) {
          this.$message.success('恭喜您,项目创建成功!!!')
          setTimeout(() => {
            this.$router.push({
              path: '/code-manage'
            })
          }, 100)
        }
      })
        .catch((error) => {
          this.$message.error('项目创建失败了!!!')
          console.log(error)
        })
    }
  },
  watch: {
    'ruleForm.projectType' () {
      this._getCodeManageProjectGroups()
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
    width: 100%;
  }
  .el-radio-group{
    float: left;
    margin-left: 13px;
    margin-top: 11px;
  }
  .cre_name{
    width: 100%;
    display: flex;
  }
  .cre_name .el-form-item{
    width: 40%;
  }
  .el-form-item{
    margin-bottom: 35px;
  }
</style>
