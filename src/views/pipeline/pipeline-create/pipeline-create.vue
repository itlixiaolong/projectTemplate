<template>
<div class="pipe-line">
  <el-steps  finish-status="success" process-status="process" align-center>
    <el-step title="开始" status="success"></el-step>
    <el-step v-for="(item,index) in nodes"  :icon="item.icon" :status="item.status" :key="index">
      <span @click="handleshowItsTab(item.nodeType,item.id)" @dblclick="handleEditNodeTitle(item.title,item.id,item.isEdit)" @selectstart="preventSelect" slot="title" class="slotTitle">
        {{item.title}}
        <i :class="item.closeIcon" v-if="item.isEdit" @click.stop="handleDeleteThisNode(item.id,item.isEdit)"></i>
      </span>
    </el-step>
    <el-step status="process" icon="el-icon-circle-plus">
      <span slot="icon" @click="handleAddNode">
        <i class="el-icon-circle-plus addIcon"></i>
      </span>
    </el-step>
    <el-step title="结束" status="success"></el-step>
  </el-steps>
  <div class="button-wrapper">
        <el-button type="primary" size="medium" @click="handleSubmit">提交</el-button>
    </div>
  <el-dialog title="" :visible.sync="dialogFormVisible">
    <el-form :model="form"  ref="ruleForm" label-width="100px" :rules="rules">
      <el-form-item label="节点名称" prop="nodeNameModel">
        <el-input :value="nodeName" v-model="form.nodeNameModel" placeholder="请输入节点名称"></el-input>
      </el-form-item>
      <el-form-item label="节点类型" prop="nodeType">
        <el-select v-model="form.nodeType" placeholder="请选择节点类型" style="width:100%;" @change="handleSelectedNodeType">
          <el-option
            v-for="item in options.nodeTypes"
            :key="item.nodeType"
            :label="item.nodeType"
            :value="item.nodeType">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitFormNodeData('ruleForm')">确 定</el-button>
  </div>
</el-dialog>
<div class="tab-content" v-show="tabName==='拉取代码'">
  <el-form :model="form"  ref="ruleForm" label-width="100px">
      <el-form-item label="GIT项目地址" prop="name">
        <el-input v-model="selectedBranch" style="width:80%;margin-right:20%;" disabled></el-input>
        <el-button size="middle" style="position:absolute;right:0;top:0px;" @click="handlleViewProjects">查看</el-button>
      </el-form-item>
      <el-form-item label="选择分支类型" prop="region" label-width="102px">
        <el-select v-model="branchType"  placeholder="请选择" style="width:100%;">
          <el-option
            v-for="item in options.branches"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
</div>
<div class="tab-content" v-show="tabName==='打包'&&selctedProjectType!=='java'&&selctedProjectType!=='h5'">
  <el-form :model="form"  ref="ruleForm" label-width="100px">
      <el-form-item label="编译类型" prop="region">
        <el-select v-model="compileType"  placeholder="请选择编译类型" style="width:100%;">
          <el-option
            v-for="item in compileTypes"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
</div>
<div class="tab-content" v-show="tabName==='制品上传'&&(selctedProjectType==='java'||selctedProjectType==='h5')">
  <el-form :model="form"  ref="ruleForm" label-width="100px">
      <el-form-item label="制品名称" prop="name">
        <el-input v-model="proName"></el-input>
      </el-form-item>
      <el-form-item label="基础镜像" prop="baseMirror">
        <el-select v-model="baseMirror"  placeholder="请选择基础镜像" style="width:100%;">
          <el-option
            v-for="item in baseMirrors"
            :key="item.baseIsoName"
            :label="item.baseIsoName"
            :value="item.baseIsoName">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
</div>
<div class="tab-content" v-show="tabName==='部署Ucloud'">
  <el-form :model="form"  ref="ruleForm" label-width="100px">
      <el-form-item label="服务器ip" prop="name">
        <el-input v-model="serverIp"></el-input>
      </el-form-item>
    </el-form>
</div>
  <create-pop ref="createPop" @backCreatePopData="emitCreatePopFun"></create-pop>
</div>

</template>

<script type="text/ecmascript-6">
import CreatePop from './create-pop'
import { mapGetters } from 'vuex'
import {getpipeCreateNodesOptionData, postNewPipeCreateData, putUpdatePipeCreateData, getPipelineCreateNodeDetails, getPipelineCreateBaseMirros} from '../../../api/pipeLine/index'
export default {
  name: 'PipelineCreate',
  components: {
    CreatePop
  },
  computed: {
    ...mapGetters([
      'getFlag'
    ])
  },
  data () {
    return {
      dialogFormVisible: false,
      backSelectedProject: '',
      nodeId: 1,
      tabName: '拉取代码',
      nodeName: '',
      modifiedNodeName: '',
      selectedBranch: '',
      selctedProjectType: '',
      branchType: 'develop',
      compileType: '',
      compileTypes: '',
      proName: '',
      baseMirror: '',
      baseMirrors: [],
      serverIp: '',
      hasProNode: false,
      hasExistNode: false,
      jobName: '',
      nodeDetails: '',
      nodes: [
        {
          id: 1,
          title: '获得代码',
          ref: '',
          nodeType: '拉取代码',
          status: 'success',
          closeIcon: ''
        },
        {
          id: 1,
          title: '打包',
          ref: '',
          nodeType: '打包',
          status: 'success',
          closeIcon: ''
        }
      ],
      form: {
        nodeNameModel: '',
        nodeType: ''
      },
      rules: {
        nodeNameModel: [
          { required: true, message: '请输入节点名称', trigger: 'blur' }
        ],
        nodeType: [
          { required: true, message: '请选择节点类型', trigger: 'change' }
        ]
      },
      options: {
        branches: [
          {
            value: 'develop',
            label: 'develop'
          }, {
            value: 'master',
            label: 'master'
          }, {
            value: 'releas',
            label: 'release'
          }
        ]
      }
    }
  },
  created () {
    this._getpipeCreateNodesOptionData()
    this._judgePageJumpOrigin()
  },
  methods: {
    // 选择gitlab项目emit回的数据
    emitCreatePopFun (data) {
      this.backSelectedProject = data
      if (data) {
        this.selctedProjectType = data.projectType // 拿到项目类型
        this.selectedBranch = data.sshUrlToRepo
        this._getPipelineCreateBaseMirros()
        this._fillCompileTypes(this.selctedProjectType)
      }
    },
    // 点击查看按钮的操作
    handlleViewProjects () {
      this.$refs.createPop.radioVal = ''
      this.$refs.createPop.popVisible = true
    },
    // form节点类型改变时的事件
    handleSelectedNodeType (val) {
      this.hasExistNode = false
      this.nodes.forEach((node) => {
        if (node.nodeType === val) {
          this.hasExistNode = true
          this.$message.warning('您选择的节点类型已经存在,请重新选择!!!')
          return true
        }
      })
    },
    // 新增节点
    handleAddNode () {
      this.dialogFormVisible = true
    },
    // 弹窗提交增加节点
    submitFormNodeData (formName) {
      if (this.hasExistNode) {
        this.$message.warning('您选择的节点类型已经存在,请重新选择!!!')
        return
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.nodes.push({
            id: ++this.nodeId,
            title: this.form.nodeNameModel,
            status: 'success',
            nodeType: this.form.nodeType,
            isEdit: true,
            closeIcon: 'el-icon-circle-close-outline'
          })
          this.tabName = this.form.nodeType
          this.form.nodeType = ''
          this.nodeName = this.form.nodeNameModel
          this.form.nodeNameModel = ''
          this.dialogFormVisible = false
        } else {
          this.$message.warning('请检查要创建的节点信息是否正确!!!')
        }
      })
    },
    // 删除节点操作
    handleDeleteThisNode (nodeId, isEdit) {
      if (!isEdit) {
        this.$message.warning('对不起,该节点不支持修改!!!')
        return
      }
      const newarr = []
      this.nodes.forEach((item, index) => {
        if (item.id !== nodeId) {
          newarr.push(item)
        }
      })
      this.nodes = newarr
      this.tabName = ''
    },
    // 双击编辑节点名称操作
    handleEditNodeTitle (nodeTitle, nodeId, isEdit, nodeType) {
      if (!isEdit) {
        this.$message.warning('对不起,该节点不支持修改!!!')
        return
      }
      this.$prompt('请输入新的节点名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: nodeTitle
      }).then(({ value }) => {
        if (value) {
          this._replaceNodeName(nodeId, value, nodeType)
        } else {
          this.$message({
            type: 'warning',
            message: '您输入的节点名称为空!'
          })
        }
      }).catch(() => {
      })
    },
    // 点击节点展示对应tab操作
    handleshowItsTab (nodeType) {
      this.tabName = nodeType
    },
    // 提交新建的节点数据和要更新的节点数据
    handleSubmit () {
      if (this.jobName === 'default') {
        this._postNewPipeCreateData()
      } else {
        this._putUpdatePipeCreateData()
      }
    },
    // 解决双击选中文字的问题
    preventSelect () {
      return false
    },
    // 获取制品上传节点的基础镜像数据
    _getPipelineCreateBaseMirros () {
      getPipelineCreateBaseMirros(this.selctedProjectType)
        .then((res) => {
          if (res.data.code === 200) {
            this.baseMirrors = res.data.data
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 获取要修改的流水线节点信息
    _getPipelineCreateNodeDetails () {
      getPipelineCreateNodeDetails(this.jobName)
        .then((res) => {
          if (res.data.code === 200) {
            this.nodeDetails = res.data.data
            this.selctedProjectType = res.data.data.projectType // 传入项目类型,方便在打包和制品上传节点控制对应的显示
            this.selectedBranch = this.nodeDetails.codeNode.gitAddress
            this.branchType = this.nodeDetails.codeNode.gitBranch
            this.compileType = this.nodeDetails.packageNode.packageType
            this.proName = this.nodeDetails.productNode.productName
            this.baseMirror = this.nodeDetails.productNode.baseIso
            if (this.nodeDetails.deployNode) {
              this.serverIp = this.nodeDetails.deployNode.serverIp
            }
            this._createNodesBaseOnData(this.nodeDetails)
            this._fillCompileTypes(this.selctedProjectType)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 调取页面tab中的配置数据
    _getpipeCreateNodesOptionData () {
      getpipeCreateNodesOptionData()
        .then((res) => {
          this.options.nodeTypes = res.data.data
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // 发送新建的流水线节点的数据
    _postNewPipeCreateData () {
      const depCode = JSON.parse(this.Api.getCookie('userinfo')).depCode
      if (!this.selectedBranch) {
        this.$message.warning('请输入Git项目地址!!!')
        return
      }
      if (!depCode) {
        this.$message.warning('请先登录!!!')
        return
      }
      const PARAMS = {
        'depCode': depCode,
        'skillType': this.backSelectedProject.projectType,
        'projectCode': this.backSelectedProject.projectCode,
        'pathWithNameSpace': this.backSelectedProject.pathWithNamespace,
        'codeNode': {
          'nodeName': '拉取代码',
          'gitAddress': this.selectedBranch,
          'gitBranch': this.branchType
        },
        'packageNode': {
          'nodeName': '打包',
          'packageType': this.compileType
        }
      }
      this.nodes.forEach((item) => {
        if (item.nodeType === '制品上传') {
          this.hasProNode = true
        }
        if (item.nodeType === '部署Ucloud') {
          PARAMS.deployNode = {
            'nodeName': '部署',
            'serverIp': this.serverIp,
            'domain': '',
            'subDomain': ''
          }
        }
      })
      if (this.hasProNode === false) {
        this.$message.warning('您至少还需要创建一个制品上传的节点')
        return
      }
      PARAMS.productNode = {
        'nodeName': '制品上传',
        'productName': this.proName,
        'baseIso': this.baseMirror
      }
      postNewPipeCreateData(PARAMS)
        .then((res) => {
          if (res.data.code === 200) {
            this.$message.success('恭喜您,流水线创建成功!!!')
            setTimeout(() => {
              this.$router.push({
                path: '/pipeline-list/default'
              })
            }, 100)
          }
        })
        .catch((error) => {
          this.$message.error(`流水线创建出错了,错误原因:${error.response.data.message}`)
        })
    },
    // 发送更新的流水线节点数据
    _putUpdatePipeCreateData () {
      const PARAMS = {
        'codeNode': {
          'nodeName': '拉取代码',
          'gitAddress': this.selectedBranch,
          'gitBranch': this.branchType
        },
        'packageNode': {
          'nodeName': '打包',
          'packageType': this.compileType
        },
        'productNode': {
          'nodeName': this.nodes[2].title ? this.nodes[2].title : '',
          'productName': this.proName,
          'baseIso': this.baseMirror
        }
      }
      this.nodes.forEach((item) => {
        if (item.nodeType === '制品上传') {
          this.hasProNode = true
        }
        if (item.nodeType === '部署Ucloud') {
          PARAMS.deployNode = {
            'nodeName': this.nodes[3].title,
            'serverIp': this.serverIp,
            'domain': '',
            'subDomain': ''
          }
        }
      })
      putUpdatePipeCreateData(this.jobName, PARAMS)
        .then((res) => {
          if (res.data.code === 200) {
            this.$message.success('恭喜您,流水线更新成功!!!')
            setTimeout(() => {
              this.$router.push({
                path: '/pipeline-list/default'
              })
            }, 100)
          }
        })
        .catch((error) => {
          this.$message.error(`流水线更新出错了,错误原因:${error.response.data.message}`)
        })
    },

    // 弹框确定后修改对应节点名称
    _replaceNodeName (nodeId, newNodeName) {
      this.nodes.forEach((item) => {
        if (item.id === nodeId) {
          item.title = newNodeName
        }
      })
    },
    // 判断进入页面的方式
    _judgePageJumpOrigin () {
      const params = this.$route.params.jobName || ''
      this.jobName = params
      if (params !== 'default') {
        this._getPipelineCreateNodeDetails()
      }
    },
    // 根据请求到的节点详细数据信息生产step对应node数据
    _createNodesBaseOnData (data) {
      this.nodes = []
      const INCOMINGDATA = data
      for (let key in INCOMINGDATA) {
        if (key === 'codeNode') {
          this.nodes.push({
            id: ++this.nodeId,
            title: INCOMINGDATA[key].nodeName,
            nodeType: '拉取代码',
            status: 'success',
            isEdit: INCOMINGDATA[key].editFlag,
            closeIcon: INCOMINGDATA[key].editFlag ? 'el-icon-circle-close-outline' : ''
          })
        } else if (key === 'packageNode') {
          this.nodes.push({
            id: ++this.nodeId,
            title: INCOMINGDATA[key].nodeName,
            nodeType: '打包',
            status: 'success',
            isEdit: INCOMINGDATA[key].editFlag,
            closeIcon: INCOMINGDATA[key].editFlag ? 'el-icon-circle-close-outline' : ''
          })
        } else if (key === 'productNode') {
          this.nodes.push({
            id: ++this.nodeId,
            title: INCOMINGDATA[key].nodeName,
            nodeType: '制品上传',
            status: 'success',
            isEdit: INCOMINGDATA[key].editFlag,
            closeIcon: INCOMINGDATA[key].editFlag ? 'el-icon-circle-close-outline' : ''
          })
        } else if (key === 'deployNode') {
          this.nodes.push({
            id: ++this.nodeId,
            title: INCOMINGDATA[key].nodeName,
            nodeType: '部署Ucloud',
            status: 'success',
            isEdit: INCOMINGDATA[key].editFlag,
            closeIcon: INCOMINGDATA[key].editFlag ? 'el-icon-circle-close-outline' : ''
          })
        }
      }
    },
    // 打包节点下对应的编译类型数据
    _fillCompileTypes (projectType) {
      if (projectType === 'android') {
        this.compileTypes = ['merge', 'arr']
      } else if (projectType === 'ios') {
        this.compileTypes = ['merge', 'pod']
      }
    }
  },
  watch: {
    getFlag (a, b) {
      if (a && !b) {
        this._judgePageJumpOrigin()
        this.nodes = []
        this.nodes = [
          {
            id: 1,
            title: '获得代码',
            ref: '',
            nodeType: '拉取代码',
            status: 'success',
            closeIcon: ''
          },
          {
            id: 1,
            title: '打包',
            ref: '',
            nodeType: '打包',
            status: 'success',
            closeIcon: ''
          }
        ]
        this.nodeDetails = ''
        this.selctedProjectType = ''
        this.selectedBranch = ''
        this.branchType = ''
        this.compileType = ''
        this.proName = ''
        this.baseMirror = ''
        this.serverIp = ''
      }
    },
    'dialogFormVisible' () {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>

<style scoped lang="less">
.pipe-line{
  width:90%;
  margin:0 auto;
  .slotTitle{
    display: inline-block;
    padding-top:20px;
    position: relative;
    top:-20px;
    z-index:2;
    user-select:none;
    font-weight: 400;
    .el-icon-circle-close-outline{
      position:absolute;
      right:-20px;
      top:16px;
      padding:4px;
      color: red;
    }
    /*&:hover .el-icon-circle-close-outline{*/
      /*display: block;*/
    /*}*/

  }
  .el-icon-circle-plus.addIcon{
    font-size:25px;
  }
  .tab-content{
    width:60%;
    margin:0 auto;
    margin-top:80px;
  }
}
</style>
