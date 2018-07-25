<template>
  <el-dialog
    title="配置人员"
    @open="open"
    v-model="showValue"
    :visible.sync="showValue"
    :before-close="closeDialog"
    width="75%"
    size="large">
    <el-table
      v-loading.body="loading"
      :data="getUserList"
      id="table-default"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="empNo"
        label="员工工号"
        width="140"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="员工名称"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="jobDesc"
        label="员工岗位"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="skillType"
        label="技术方向"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-select
            style="width: 70%"
            v-model="form[scope.$index]"
            clearable
            class="search-one">
            <el-option
              v-for="item in way"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <el-button
            @click="saveEvt(form[scope.$index],scope.row.id)"
          >
            保存
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import mixin from '@/mixins/index'
export default {
  data () {
    return {
      showValue: false,
      loading: true,
      getUserList: [],
      form: [],
      way: ['java', 'ios', 'android', 'cpp']
    }
  },
  props: {
    value: {
      default: false,
      type: Boolean
    },
    rowCode: {
      default: '',
      type: String
    }
  },
  mixins: [mixin],
  methods: {
    open () {
      this.getData()
    },
    getData () {
      let url = 'users/listAllByDepcode?depCode=' + this.rowCode
      this.Api.httpGet(url)
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
      let params = {
        id: ids,
        skillType: type
      }
      this.Api.httpPost('users/updateUserInfo', params)
        .then(res => {
          if (!res.data) {
            this.resultInfo('保存成功', 'success')
            this.getData()
          } else {
            this.resultInfo('保存失败', 'warning')
          }
        })
        .catch(err => {
          // console.log(err)
          this.resultInfo(err, 'warning')
        })
    }
  },
  watch: {
    value (val) {
      this.showValue = val
    },
    showValue (val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style scoped>
</style>
