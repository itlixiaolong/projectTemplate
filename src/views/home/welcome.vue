<template>
  <div>
    <div class="rowTop">
      <div class="title"><span></span>任务统计</div>
      <el-row>
          <el-col :span="6"><div class="grid-content bg-purple">
            <div class="box">commit次数</div>
            <div class="gray">11</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">
            <div class="box">每天代码行</div>
            <div class="red">8</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div class="box">每迭代代码行</div>
            <div class="green">5</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple-light">
            <div class="box">bug数</div>
            <div class="gray">11</div>
          </div>
         </el-col>
      </el-row>
    </div>
      <!--table start-->
      <div class="table">
        <div class="title"><span></span>审批记录</div>
        <data-table
          width="100%"
          :tableInfor = "tableInfor"
          :tableData = "tableData"
          @selection-change = "SelectionChange"
        >
        </data-table>
      </div>
      <!--table end-->
  </div>
</template>

<script>
import DataTable from '@/components/datatable/index.vue'
export default {
  nane: 'welcome',
  components: {
    DataTable
  },
  data () {
    return {
      tableData: [
        {
          index: '2016-05-02',
          name: '王小虎',
          position: '工程师',
          role: '管理员',
          department: '开发部'
        }
      ],
      tableInfor: [
        {
          'type': 'selection'
        }, {
          'prop': 'index',
          'label': '序号'
        }, {
          'prop': 'name',
          'label': '姓名'
        }, {
          'prop': 'position',
          'label': '职位'
        }, {
          'prop': 'role',
          'label': '角色'
        }, {
          'prop': 'department',
          'label': '部门'
        }

      ]
    }
  },
  methods: {
    SelectionChange (val) {
    }
  }
}
</script>

<style scoped>
  .title{
    text-align: left;
    margin-bottom: 10px;
  }
  .title span{
    border:2px solid #232F49;
   margin-right: 8px;
    line-height: 18px;
  }
  .el-row{
    padding:20px 0;
  }

  .box{
    color:#aaaabd;
  }
  .gray,.red,.green{
    color: #888888;
    font-size: 22px;
    font-weight: bold;
    padding:8px 0;
  }
  .red{
    color:#ff5b57
  }
  .green{
    color: #22d7bb;
  }

</style>
