<template>
  <div class="create_box">
    <div class="create_page">
      <ul>
        <li>
          <p>项目名称 :</p>
          <p>{{viewName.projectName}}</p>
        </li>
        <li>
          <p>中文名称 :</p>
          <p>{{viewName.cnName}}</p>
        </li>
      </ul>
    </div>
    <div class="create_page">
      <ul>
      <li>
        <p>项目组名 :</p>
        <p>{{viewName.namespace}}</p>
      </li>
      <li>
        <p>技术栈 :</p>
        <p>{{viewName.projectType}}</p>
      </li>
      </ul>
    </div>
    <div class="create_page">
      <ul>
    <li>
      <p>申请部门 :</p>
      <el-tooltip class="item" effect="dark" :content="viewdata" placement="top"  :disabled="viewfal">
        <p class="proj_ments"><span v-for="(item ,index) in viewName.projectDepartments" :key="index">{{item.depName + ' '}}</span></p>
      </el-tooltip>
    </li>
    <li>
      <p>Master :</p>
      <el-tooltip class="item" effect="dark" :content="viewMasterdata" placement="top"  :disabled="masflag">
        <p class="proj_ments"><span v-for="(item ,index) in viewName.projectUsers" :key="index">{{item.emplName + ' '}}</span></p>
      </el-tooltip>
    </li>
    </ul>
  </div>
    <div class="create_textarea">
      <p>描述项目 :</p>
      <p>{{viewName.description}}</p>
    </div>
    <div class="create_textarea">
      <p>备 注 :</p>
      <p>{{viewName.comment}}</p>
    </div>
    <div class="create_textarea">
      <p>审批备注 :</p>
      <p>{{viewName.approveComment}}</p>
    </div>
  </div>
</template>
<script>
import mixin from '@/mixins/index'
import { getCodeShell } from '../../api/code/index'
export default {
  name: 'CodeCreate',
  data  () {
    return {
      viewName: {
        cnName: '', // 项目名称
        projectName: '', // 英文
        projectType: '', // 技术栈
        description: '', // 项目描述
        namespace: '', // 申请项目组
        depName: '', // 申请部门
        comment: '', // 备注
        approveComment: '', // 审批备注
        projectUsers: '' // Master
      },
      viewdata: '',
      viewMasterdata: '',
      viewfal: true,
      masflag: true,
      viewId: ''
    }
  },
  created () {
    this.getData()
  },
  mixins: [mixin],
  methods: {
    getData () {
      this.viewId = this.$route.params.id
      getCodeShell(this.viewId).then((res) => {
        this.viewName = res.data.data
        let views = this.viewName.projectDepartments
        if (views.length >= 5) { // 判断tooltip是否显示
          this.viewfal = false
        }
        for (let i = 0; i < views.length; i++) { // 申请部门
          this.viewdata += views[i].depName + ' '
        }

        let viewMaster = this.viewName.projectUsers
        if (viewMaster.length >= 8) { // 判断tooltip是否显示
          this.masflag = false
        }
        for (let j = 0; j < viewMaster.length; j++) { // Master数据
          this.viewMasterdata += viewMaster[j].emplName + ' '
        }
      }).catch(err => {
        this.resultInfo(err, 'warning')
      })
    }
  }
}
</script>

<style scoped lang="less">
  .create_box{
    width: 100%;
  }
  .create_box p:nth-child(1){
    width: 80px;
    font-weight: bold;
    text-align: right;
    min-width: 90px;
    margin-right: 26px;
    display: inline-block;
  }
  .create_page{
    width: 100%;
  }
  .create_page ul{
    width: 100%;
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .create_page ul li {
    width: 50%;
    display: flex;
    justify-content: start;
    align-items: center;
  }
  .create_page ul li p:nth-child(2){
    margin-left: 10px;
  }
  .create_textarea{
    margin-bottom: 25px;
    display: flex;
    align-items: baseline;
    margin-left: 35px;
    p:nth-child(2){
      margin-left: 10px;
    }
  }
  .create_textarea p:nth-child(2){
    flex: 1;
    word-break: break-all;
    word-wrap:break-word;
    text-align: left;
  }
  .proj_ments{
    width: 500px;
    text-overflow:ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    display: inline-block;
    text-align: left;
  }
  .proj_ments span{
    flex-direction: column;
    word-break: break-all;
    word-wrap:break-word;
    text-align: left;
  }
</style>
