<template>
  <div class="test-case-pop">
    <el-dialog title="用例数变更" :visible.sync="dialogVisible" center width="30%">
    <el-form :model="form" label-width="80px">
      <el-form-item label="部门名称">
        <el-input  type="text" v-model="form.depName" disabled></el-input>
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input  type="text" v-model="form.depCode" disabled></el-input>
      </el-form-item>
      <el-form-item label="项目版本">
      <el-input  type="text" v-model="form.version" disabled></el-input>
      </el-form-item>
      <el-form-item label="用例数">
      <el-input type="number" v-model="form.testCase" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'testCasePop',
  props: {
    data: {
      type: Object,
      default () {
        return {}
      },
      requuired: true
    }
  },
  computed: {
    form () {
      return this.data
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    handleConfirm () {
      this.$emit('backTestCasePopData', this.form.testCase, this.form.depName, this.form.id)
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped>

</style>
