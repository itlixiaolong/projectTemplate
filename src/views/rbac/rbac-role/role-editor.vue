<template>
    <el-dialog
    title="编辑"
    v-model="showValue"
    :visible.sync="showValue"
  >
  <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm1">
    <el-form-item label="角色名称" prop="roleName">
      <el-input v-model="ruleForm.roleName" placeholder="请输入角色名称"></el-input>
    </el-form-item>
    <el-form-item label="英文名称" prop="roleCode">
      <el-input v-model="ruleForm.roleCode" placeholder="请输入角色英文名称"></el-input>
    </el-form-item>
  </el-form>
  <el-form>
    <el-form-item >
      <el-button type="primary" @click="confirm('ruleForm')">确认修改</el-button>
      <el-button @click="cancel('ruleForm')">取消</el-button>
    </el-form-item>
  </el-form>
  </el-dialog>
</template>
<script>
import mixin from '@/mixins/index'
export default {
  props: ['editflag', 'id', 'getOneList'],
  data () {
    return {
      showValue: true,
      loading: false,
      form: [],
      ruleForm: {
        roleName: '',
        roleCode: '',
        instructions: '',
        permissions: ''
      },
      values: '',
      way: [1, 2, 3, 5, 6, 7, 8, 9]
    }
  },
  mixins: [mixin],
  created () {
    this.ruleForm = this.getOneList
  },
  methods: {
    selectfn (selection, row) {
      console.log(row)
    },
    open () {
      this.getData()
    },
    // 权限
    addQxian () {
      if (this.secondDialog) {
        this.secondDialog = false
      } else {
        this.secondDialog = true
      }
    },
    confirm (ruleForm) { // 确认按钮
      this.$emit('modifyFn', this.ruleForm)
      this.showValue = false
    },
    cancel (ruleForm) { // 取消按钮
      this.showValue = false
    },
    getData () {
      let url = 'base/menu/save=' + this.rowCode
      this.Api.httpPost(url)
        .then(res => {
          this.getUserList = res.data
          this.form = []
          this.getUserList.map(item => {
            this.form.push(item.skillType)
          })
          this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    closeDialog () {
      this.showValue = false
      this.form = []
    },
    saveEvt (type, ids) {
      var newArr = this.newgeilist.slice()
      let params = {
        id: 1, // 如没有id，后台添加新数据，有id则为update功能
        menuName: newArr[0].menuName,
        parent: this.values
      }
      this.Api.httpPost('base/menu/save', params)
        .then(res => {
          if (!res.data) {
            this.resultInfo('保存成功', 'success')
            this.getData()
          } else {
            this.resultInfo('保存失败', 'warning')
          }
        })
        .catch(err => {
          this.resultInfo(err, 'warning')
        })
    }
  },
  watch: {
    editflag (val) {
      this.showValue = val
    },
    showValue (val) {
      this.$emit('edit', val)
    }
  }
}
</script>
<style scoped>
.el-form-item{
    text-align: center;
  }
.el-dialog{
    width: 88% !important;
  }
.el-button{
  margin-top: 15px;
}
.el-select{
  width: 100%;
}
.el-form-item .el-form-item__content{
  margin-left: 37px !important;
}
</style>
