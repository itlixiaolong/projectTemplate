<template>
  <div style="margin: 10px;">
    <el-table
      v-loading.body="loading"
      :data="getDataList"
      id="table-default"
      border
      style="width: 100%">
      <el-table-column
        prop="depCode"
        label="部门编号"
        width="160"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        prop="depName"
        label="部门名称"
        header-align="center"
        align="center"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="160"
        header-align="center"
        align="center"
      >
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleEvt(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="personEvt(scope.row)">配置人员</el-button>
        </template>
      </el-table-column>
    </el-table>
    <edit-dialog
      v-model="showDialog"
      :row-data="groupData"
      @refreshHandle="refreshFn"
    >
    </edit-dialog>
    <person-dialog
      v-model="setDialog"
      :row-code="codeData"
    >
    </person-dialog>
  </div>
</template>
<script>
import mixin from '@/mixins/index'
import editDialog from './edit'
import personDialog from './set'
export default {
  data () {
    return {
      loading: true,
      showDialog: false,
      setDialog: false,
      groupData: {
        id: '',
        name: ''
      },
      codeData: '',
      getDataList: []
    }
  },
  components: {
    editDialog,
    personDialog
  },
  mixins: [mixin],
  created () {
    this.getData()
  },
  methods: {
    getData () {
      let url = 'department/ListAllDepartment'
      this.Api.httpGet(url)
        .then(res => {
          this.getDataList = res.data
          this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    },

    handleEvt (val) {
      this.groupData = {
        code: val.depCode,
        name: val.depName
      }
      this.showDialog = true
    },
    personEvt (val) {
      this.codeData = val.depCode
      this.setDialog = true
    },
    refreshFn () {
      this.getData()
    }
  }
}
</script>
<style>

</style>
