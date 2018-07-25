<template>
  <div>
    <el-dialog v-model='showValue' title="修改密码" :close="closeDialog"  :visible.sync="showValue" :close-on-click-modal='closemodal'>
      <el-form :model="dataForm" :rules="rules" ref="rulesForm" label-position="right" :label-width="formLabelWidth">
        <el-form-item label="旧密码：" prop="oldPassword">
          <el-col :span="22">
            <el-input
              v-model="dataForm.oldPassword"
              auto-complete="off"
              :maxlength="20"
              placeholder="输入旧密码"
              type="password"
            >
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="新密码：" prop="password">
          <el-col :span="22">
            <el-input
              v-model="dataForm.password"
              auto-complete="off"
              :maxlength="20"
              placeholder="输入新密码，新密码需6到20位且必须包含字母、数字"
              type="password"
            >
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="passwordRe">
          <el-col :span="22">
            <el-input
              v-model="dataForm.passwordRe"
              auto-complete="off"
              :minLength="6"
              :maxlength="20"
              placeholder="确认新密码"
              type="password"
            >
            </el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button
          @click="changePwd"
          type="primary"
        >
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import mixMethods from '@/mixins/index'
export default {
  props: ['pwdShow'],
  data () {
    // let validatePass = (rule, value, callback) => {
    //     if (value === '') {
    //       callback(new Error('请输入新密码'))
    //     } else {
    //       let reg = /^(?=.*[a-z])(?=.*\d)[\S]{6,20}$/
    //       if(!reg.test(value)){
    //         callback(new Error('密码必须包含字母、数字'))
    //       }else{
    //         if (this.dataForm.passwordRe !== '') {
    //           this.$refs.rulesForm.validateField('passwordRe')
    //         }
    //         callback()
    //       }
    //     }
    //   },
    //   validatePassRe = (rule, value, callback) => {
    //     if (value !== this.dataForm.password) {
    //       callback(new Error('两次输入新密码不一致!'))
    //     } else {
    //       callback()
    //     }
    //   }
    return {
      closemodal: false,
      formLabelWidth: '140px',
      showValue: true, // 修改为false
      toon: this.Api.getCurrentProduct(),
      dataForm: {
        oldPassword: '',
        password: '',
        passwordRe: ''
      },
      created () {
      },
      rules: {
      //   oldPassword: [
      //     {required: true, message: '请输入旧密码', trigger: 'blur'}
      //   ],
      //   password: [
      //     {required: true, message: '请输入新密码', trigger: 'blur'},
      //     {min: 6, max: 20, message: '密码长度需在6到20位', trigger: 'blur' },
      //     {validator: validatePass, trigger: 'blur' }
      //   ],
      //   passwordRe: [
      //     {required: true, message: '请再次输入新密码', trigger: 'blur'},
      //     {validator: validatePassRe, trigger: 'blur' }
      //   ],
      }
    }
  },
  // mixins: [mixMethods],
  // props: {
  //   value: {
  //     default: false,
  //     type: Boolean
  //   },
  // },
  methods: {
    closeDialog () {
    // console.log('closeDialog')
    // changePwd()
    // this.$refs['rulesForm'].resetFields()
    // this.showValue = false
    },
    changePwd () {
      this.$emit('changePwd')
    },
    checkSure () {
      this.props.changePwd()
      // this.$refs['rulesForm'].validate((valid) => {
      //   if (valid) {
      //     let key = CryptoJS.enc.Utf8.parse("toonocm20171219x"), oldVal = '', newVal = ''
      //     // token = new Date().getTime()
      //     // 验证旧密码
      //     let testUrl = `/Api/${this.toon}/role/checkUserInfo?password=${oldVal}&mobile=${this.Api.getStorageItem('X-Tocm-Mobile')}`
      //     this.Api.httpGet(testUrl)
      //       .then(res => {
      //         if (res.data.hasOwnProperty('meta') && res.data.meta.code !== 0) {
      //           this.messageInfo(res.data.meta.message, 'warning')
      //         } else {
      //           if (res.data.status === false) {
      //             this.messageInfo('旧密码输入错误', 'warning')
      //           } else {
      //             // 提交新密码
      //             let changeUrl = `/Api/${this.toon}/role/updateUserPwd`,
      //             params = {
      //               password: newVal,
      //               uid: this.Api.getStorageItem('X-Tocm-ID')
      //             }
      //             this.Api.httpPost(changeUrl, params)
      //               .then(response => {
      //                 if (response.data.meta.code !== 0) {
      //                   this.messageInfo(response.data.meta.message, 'warning')
      //                 } else {
      //                   this.$alert('修改成功！请重新登录！', '', {
      //                     confirmButtonText: '确定',
      //                     type: 'success',
      //                     showCancelButton: false,
      //                     callback: action => {
      //                       this.$emit('reset-sure')
      //                       this.closeDialog()
      //                     }
      //                   })
      //                 }
      //               })
      //               .catch(error => {
      //                 this.messageInfo(error, 'warning')
      //               })
      //           }
      //         }
      //       })
      //       .catch(err => {
      //         console.log(err)
      //         this.messageInfo(err, 'warning')
      //       })
      //   } else {
      //     console.log('error submit!!')
      //     return false
      //   }
      // })
    }
  },
  watch: {
    pwdShow (val) {
      this.showValue = val
    },
    showValue (val) {
      this.$emit('changePwd')
    }
  }
}
</script>
<style scoped>
</style>
