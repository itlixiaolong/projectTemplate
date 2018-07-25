<template>
 <div class="change_box">

  <div class="change_submit">
   <h5 class="change_title">代码注释Log列表 ：</h5>
   <el-table
           :data="tableData"
           border
           style="width: 100%;"
           align="center"
           height="450"
   >
    <el-table-column
            prop="comment"
            label="提交信息"
            width="800">
    </el-table-column>
    <el-table-column
            prop="user"
            label="提交人"
    >
    </el-table-column>
    <el-table-column
            prop="time"
            width="240"
            label="提交日期"
            >
      <template slot-scope="scope"><span v-fomatTime="scope.row.time"></span></template>
    </el-table-column>
   </el-table>
  </div>

  <div class="change_file">
   <h5 class="change_title">代码变更文件列表 ：</h5>
   <el-table
           :data="fileListData"
           border
           style="width: 100%;"
           height="450"
           align="center"
   >
    <el-table-column
            prop="path"
            label="文件名"
           >
    </el-table-column>
    <el-table-column
            prop="insertions"
            label="增加行"
            width="100"
    >
    </el-table-column>
    <el-table-column
            prop="deletions"
            label="删除行"
            width="100"
    >
    </el-table-column>
   </el-table>
  </div>

  </div>
</template>

<script>
import {getpipeChangeLog} from '@/api/pipeLine'
export default {
  name: 'pipeline-changelog',
  data () {
    return {
      tableData: [], // 提交日志
      fileListData: [],
      information: '', // 提交信息
      submitter: '', // 提交人
      date: '', // 提交时间
      filename: '', // 文件名
      addrows: '', // 增加行
      deleline: '' // 删除行
    }
  },
  created () {
    this.getData(this.$route.params.id)
  },
  methods: {
    getData (ids) {
      let params = {
        id: ids
      }
      getpipeChangeLog(params).then((res) => {
        if (res.status === 200) {
          this.tableData = res.data.data.commitLogs
          this.fileListData = res.data.data.fileModifications
        }
      })
    }
  }
}
</script>

<style scoped>
.change_box{
   width: 100%;
}
 .change_title{
   display: flex;
  justify-content: flex-start;
 }
 .change_submit{
  margin-top: 30px;
 }
.change_submit .el-table{overflow-y: auto;}

.change_file{
 margin-top: 60px;
 margin-bottom: 20px;
}
.change_file .el-table{overflow-y: auto;}

</style>
