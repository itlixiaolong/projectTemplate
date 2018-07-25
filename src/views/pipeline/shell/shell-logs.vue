<template>
  <div class="dialog_box">
    <el-dialog
            :title="dialogTitle"
            :close="closeDialog"
            :visible.sync="showValue"
            :width="dialogWidth"
            center
            class="title-left"
    >
        <iframe :src="pushUrl" frameborder="0" scrolling="auto" width="100%" height="450px"></iframe>
    </el-dialog>
  </div>
</template>
<script>
export default{
  props: {
    showDialog: {
      type: Boolean
    },
    dialogWidth: String,
    labelWidth: String,
    dialogTitle: String,
    dialogHeight: String,
    pushUrl: String,
    params: {
      forms: {
        type: Array,
        required: true
      }
    },
    getDataurl: []
  },
  data () {
    return {
      showValue: true

    }
  },
  created () {
  },
  methods: {
    closeDialog () {
      this.showValue = false
    },
    newListVisible () {
      this.showValue = false
    }
  },
  watch: {
    showDialog (val) {
      this.showValue = val
    },
    showValue (val) {
      this.$emit('newPagefn', val)
    }
  },
  computed: {
    itemStyle () {
      const {itemWidth} = this
      if (itemWidth) {
        return `width: ${itemWidth}px;`
      }
      return ''
    }
  }
}
</script>
<style lang="less" scoped>
  .title-left .el-dialog__header {
    text-align: left;
  }
</style>
