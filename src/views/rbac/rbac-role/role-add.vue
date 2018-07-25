<template>
  <el-dialog
    title="添加"
    v-model="showValue"
    :close="closeDialog"
    :visible.sync="showValue">
    <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="新添角色" prop="roleName">
        <el-input v-model="ruleForm.roleName" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="英文名称" prop="roleCode">
        <el-input v-model="ruleForm.roleCode" placeholder="请输入角色英文名称"></el-input>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <el-button type="primary" v-on:click="submitForm('')">添加</el-button>
        <el-button @click="resetForm()">重置</el-button>
      </el-form-item>
    </el-form>
    <permission v-if="secondDialog" :getDialog ='secondDialog' v-on:secondDialog='permission'  :id="id"></permission>
  </el-dialog>
</template>

<script>
import permission from './role-permission'
export default {
  data () {
    return {
      secondDialog: false,
      getDialog: false, // 新建弹层
      showValue: true,
      id: 0,
      ruleForm: {
        roleName: '',
        roleCode: '',
        instructions: '',
        permissions: ''
      }
    }
  },
  props: [
    'setDialog'
  ],
  components: {
    permission
  },
  methods: {
    closeDialog () {
      this.showValue = false
    },
    // 权限
    addQxian () {
      if (this.secondDialog) {
        this.secondDialog = false
      } else {
        this.secondDialog = true
      }
    },
    permission () {
      if (this.permission) {
        this.permission = false
      } else {
        this.permission = true
      }
    },
    submitForm () {
      this.$emit('addlist', this.ruleForm)
      this.closeDialog()
    },
    resetForm () {
      this.ruleForm.roleName = ''
      this.ruleForm.instructions = ''
      this.ruleForm.permissions = ''
      this.ruleForm.roleCode = ''
    }
  },
  watch: {
    getDialog (val) {
      this.secondDialog = val
    }
  }
}
</script>

<style scoped>
  .el-select{
    width: 100%;
  }
.el-form-item{
  text-align: center;
}
</style>
