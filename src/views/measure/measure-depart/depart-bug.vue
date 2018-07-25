<template>
  <div>
    <div class="menu_new">
      <!--placeholder="版本号"-->
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
        <el-button
          @click="linkTo"
        >
          查看统计图
        </el-button>
      </div>
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
        prop="lineP"
        label="增加行"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="lineM"
        label="删除行"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="lineAll"
        label="总行数"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="bugCount"
        label="bug数"
        header-align="center"
        align="center"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="bugRateForLineP"
        label="新增行bug率（‰）"
        header-align="center"
        align="center"
        sortable
      >
        <template slot-scope="scope">
          {{scope.row.bugRateForLineP ? scope.row.bugRateForLineP : 0}}
        </template>
      </el-table-column>
      <el-table-column
        prop="bugRate"
        label="bug率（‰）"
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
      loading: true,
      pages: 1,
      total: 0,
      getDataList: [],
      vers: '3.8.3',
      searchVersion: '',
      queryUrl: 'bugrate/listBugRateForDep',
      verUrl: 'projectVersion/getProjectVersionList',
      versionOptions: [],
      searchProject: '',
      projectOptions: []
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
      this.queryUrl = 'bugrate/listBugRateForDep'
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
      this.$router.push({name: 'Bug统计图表'})
    }
  }
}
</script>
<style scoped>
  .el-table tr{
    padding:0 !important;
  }
  .el-table th{
    padding: 0 !important;
  }
</style>
