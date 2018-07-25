<template>
  <div>
    <!-- 部门统计表 -->
    <div class="menu_new">
      <div class="menu-left">
        <el-select class="gap-right" v-model="searchProject" placeholder="请选择项目" @change="changeSearchType">
          <el-option
            v-for="item in projectOptions"
            :key="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <el-select class="gap-right" v-model="searchVersion" placeholder="请选择版本号">
          <el-option
            v-for="item in versionOptions"
            :value="item.projectVersion"
            :key="item.projectVersion"
          >
          </el-option>
        </el-select>
        <el-button
          @click="searchEvt"
        >
          查询
        </el-button>
      </div>
    </div>
    <div class="table-text">
    </div>
    <div class="clearfix"></div>
    <el-table
      v-loading.body="loading"
      :data="getDataList"
      id="table-default"
      border
      style="width: 100%;margin-bottom: 15px"
      :default-sort = "{prop: 'bugRate', order: 'descending'}"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="version"
        label="版本号"
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
        prop="iosSpent"
        label="IOS实际（天）"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="iosEstimate"
        label="IOS预估（天）"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="androidSpent"
        label="android实际（天）"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="androidEstimate"
        label="android预估（天）"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="serviceSpent"
        label="service实际（天）"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="serviceEstimate"
        label="service预估（天）"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="webSpent"
        label="web实际（天）"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="webEstimate"
        label="web预估（天）"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="spent"
        label="总实际时间（天）"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="estimate"
        label="总预估时间（天）"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import mixin from '@/mixins/index'

export default {
  data () {
    return {
      loading: false, // 对接口时改成true
      pages: 1,
      total: 0,
      getDataList: [],
      searchVersion: '',
      queryUrl: 'jira/listJiraInfoForDep',
      verUrl: 'projectVersion/getProjectVersionList',
      versionOptions: [],
      searchProject: '',
      projectOptions: [],
      selectOptions: []
    }
  },
  created () {
    this.gets()
  },

  mixins: [mixin],
  methods: {
    changes (e) {
      this.$store.commit('hello', e)
    },
    handleCurrentChange (page) {
      this.pages = page
    },
    getData () {
      let str = '?'
      if (this.searchVersion) {
        str += str === '?' ? 'version=' + this.searchVersion : '&version=' + this.searchVersion
      }
      let url = this.queryUrl += str === '?' ? '' : str
      this.Api.httpGet(url)
        .then(res => {
          this.getDataList = res.data
          this.loading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    gets () { // 版本号
      let url = this.verUrl
      let _this = this
      this.Api.httpGet(url).then(res => {
        var versiondata = res.data
        for (var prop in versiondata) {
          _this.projectOptions.push({'value': prop})
        }
        this.selectOptions = versiondata
        // 获取第一个项目的版本信息
        function getFirstAtt (data) {
          for (var key in data) {
            return data[key]
          }
        }
        let firstAtt = getFirstAtt(this.selectOptions)
        this.versionOptions = firstAtt
        this.searchVersion = firstAtt[0].projectVersion
        _this.searchProject = _this.projectOptions[0].value
        this.getData()
      }).catch(err => {
        console.log(err)
      })
    },
    changeSearchType (val) {
      for (var prop in this.selectOptions) {
        if (prop === val) {
          this.versionOptions = this.selectOptions[prop]
          this.searchVersion = this.selectOptions[prop][0].projectVersion
        }
      }
    },
    searchEvt () {
      this.queryUrl = 'jira/listJiraInfoForDep'
      this.getData()
    },
    // 获取时间戳
    getTimeCode (val) {
      return this.Api.getTimeCode(val)
    },
    getDateTime (val) {
      let str = ''
      let times = new Date(Number(val))
      str += times.getFullYear() + '-'
      str += (times.getMonth() + 1) + '-'
      str += times.getDate()
      return str
    },
    // 跳转统计图
    linkTo () {
      this.$router.push({name: 'bugHistogram'})
    }
  }
}
</script>
<style scoped>
  .searchBox {
    margin-bottom: 10px;
    float: left
  }

</style>
