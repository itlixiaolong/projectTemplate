<template>
  <el-dialog
    title="编辑"
    @open="open"
    v-model="showValue"
    :visible.sync="showValue"
    :before-close="closeDialog"
    width="75%"
    size="large">
    <div style="padding-bottom: 15px; color:#000;">
      部门名称：{{rowData.name}}
    </div>
    <div class="flexBox">
      <div style="width:45%;">
        <!--全部项目-->
        <h3 style="text-align: center;">全部项目</h3>
        <div style="width: 100%;margin-bottom: 10px;">
          <el-input
            v-model="searchIpt"
            placeholder="输入项目名"
            style="width: 75%"
          >
          </el-input>
          <el-button
            @click="searchEvt"
          >
            搜索
          </el-button>
        </div>
        <el-table
          style="width:100%;"
          ref="multipleTable"
          v-loading="loadingL"
          :data="businessData"
          :show-header="false"
          height="442"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            prop="pathWithNamespace"
            align="center"
            label="全部项目">
          </el-table-column>
        </el-table>
      </div>
      <div class="centerBox">
        <div>
          <el-button class="tree-btn" :disabled="isAdd" @click="addItem">添加 <i
            class="el-icon-arrow-right"></i></el-button>
          <br><br>
          <el-button class="tree-btn" :disabled="isDelete" @click="deleteItem">移除 <i
            class="el-icon-arrow-left "></i>
          </el-button>
        </div>
      </div>
      <div style="width:40%;">
        <h3 style="text-align: center; margin-bottom: 60px;">已选项目</h3>
        <el-table
          style="width:100%;"
          :show-header="false"
          v-loading="loadingR"
          height="442"
          :data="selectData"
          @selection-change="handleSelectionChange2">
          <el-table-column
            type="selection">
          </el-table-column>
          <el-table-column
            prop="pathWithNamespace"
            align="center"
            label="已选项目">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import mixin from '@/mixins/index'
export default {
  data () {
    return {
      businessData: [],
      selectData: [],
      multipleSelection: [],
      selectedItem: [],
      loadingL: true,
      loadingR: true,
      showValue: false,
      searchIpt: '',
      queryUrl: '/project/projects'
    }
  },
  props: {
    value: {
      default: false,
      type: Boolean
    },
    rowData: {
      type: Object,
      required: true
    }
  },
  mixins: [mixin],
  computed: {
    isAdd () {
      if (this.multipleSelection.length <= 0) {
        return true
      } else {
        return false
      }
    },
    isDelete () {
      if (this.selectData.length > 0) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    open () {
      this.getAllBusiness()
      this.selectedBusiness()
    },
    getAllBusiness () {
      let url = this.queryUrl
      this.Api.httpGet(url)
        .then(res => {
          this.businessData = res.data.data
          this.$nextTick(() => {
            this.toggleSelection()
          })
          this.loadingL = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    searchEvt () {
      this.queryUrl = '/project/projects'
      if (this.searchIpt) {
        this.queryUrl += '?projectName=' + this.searchIpt
        this.getAllBusiness()
      }
    },
    selectedBusiness () {
      let params = this.rowData.code
      this.Api.httpGet('project/from/department?depCode=' + params, '')
        .then(res => {
          this.selectData = res.data.data
          this.$nextTick(() => {
            this.toggleSelection()
          })
          this.loadingR = false
        })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handleSelectionChange2 (val) {
      this.selectedItem = val
    },
    addItem () {
      this.multipleSelection.map(val => {
        let status = 1
        this.selectData.map(label => {
          if (label.projectCode === val.projectCode) {
            status = 2
          }
        })
        if (status === 1) {
          this.selectData.push(val)
        }
      })
    },
    deleteItem () {
      this.selectedItem.map(val => {
        this.selectData.map((label, index) => {
          if (label.projectCode === val.projectCode) {
            this.selectData.splice(index, 1)
            return false
          }
        })
      })
      this.toggleSelection()
    },
    toggleSelection () {
      let rows = []
      // if (this.tableData2.length === 0) return;
      this.selectData.map((val) => {
        this.businessData.map((item) => {
          if (item.projectCode === val.projectCode) {
            rows.push(item)
          }
        })
      })
      this.$refs.multipleTable.clearSelection()
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row, true)
      })
    },
    submitForm () {
      this.saveBusiness()
    },
    saveBusiness () {
      let params = []
      this.selectData.map(item => {
        params.push({projectId: item.id, depCode: this.rowData.code})
      })
      this.Api.httpPost('project/' + this.rowData.code + '/projects', params)
        .then(res => {
          if (res.data.code === 200) {
            this.resultInfo('保存成功', 'success')
            this.closeDialog()
            this.refresh()
          } else {
            this.resultInfo('保存失败', 'warning')
          }
        })
    },
    closeDialog () {
      this.showValue = false
      this.businessData = []
      this.selectData = []
      this.multipleSelection = []
      this.selectedItem = []
      this.searchIpt = ''
    },
    refresh () {
      this.$emit('refreshHandle')
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
  .flexBox {
    display: -webkit-flex;
    display: flex;
  }

  .centerBox {
    padding: 0 15px;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
  }

  .search_box {
    width: 100%;
    min-width: 288px;
    margin-bottom: 10px;
  }

  .search_ipt {
    width: 50%;
    margin: 0 5px 5px 0;
  }
</style>
