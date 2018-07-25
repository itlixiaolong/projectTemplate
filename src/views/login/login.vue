<template>
  <div class="loginMax">
    <div class="loginpic">
      <div class="login_div">
        <div class="lo_text">
          <div class="log_title"><p>效能管理平台</p></div>
          <div class="log_from">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
              <div v-if="errorTips" class="error－tips">
                {{errorMessage}}
              </div>
                <el-form-item prop="username">
                <el-input
                  type="text"
                  placeholder='请输入工号'
                  v-model="ruleForm.username"
                  auto-complete="off"
                >
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  placeholder='请输入密码'
                  v-model="ruleForm.password"
                  auto-complete="off"
                >
                </el-input>
              </el-form-item>
              <el-checkbox v-model="checked" size="mini">记住用户</el-checkbox>
              <el-form-item>
                <el-button
                  type="primary"
                  @click="submitForm('ruleForm')"
                >
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="log_pic"><img src="../../assets/login.png" alt=""></div>
      </div>
    </div>
  </div>
</template>

<script>
import { postLoginData, getloginUserMenu, getUserFunctions } from 'api/login/index'
import { setCookie, getCookie } from 'utils/cookie'
import { setSessionStorage } from 'utils/storage'
export default {
  data () {
    return {
      roleId: '',
      checked: true,
      errorTips: false,
      userName: '',
      errorMessage: '',
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{ required: true, message: '请输入您的工号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 6, message: '请输入正确的密码', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.userName = getCookie('username')
    if (this.userName !== '') {
      this.$router.push({path: '/home'})
    } else {
      this.$router.push({path: '/login'})
    }
    let _this = this
    window.addEventListener('keydown', function (e) {
      if (e.keyCode === 13) {
        _this.submitForm('ruleForm')
      }
    })
  },
  methods: {
    submitForm (val) { // 登录按钮
      this.$refs[val].validate((valid) => {
        if (valid) {
          const PARAMS = {
            'username': this.ruleForm.username,
            'password': this.ruleForm.password
          }
          this._postLoginData(PARAMS)
        } else {
          this.errorTips = false
          return false
        }
      })
    },
    _postLoginData (params) {
      postLoginData(params)
        .then((res) => {
          if (res.data.code === 200) {
            setSessionStorage('token', res.headers.authorization)
            setCookie('userinfo', JSON.stringify(res.data.data), 1)
            this.roleId = res.data.data.roleId
            const PARAMS = {
              roleId: this.roleId
            }
            this._getloginUserMenu(PARAMS)
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            this.errorTips = true
            this.errorMessage = '用户名和密码不正确，请重新输入'
          }
        })
    },
    _getloginUserMenu (params) {
      getloginUserMenu(params).then((res) => {
        if (res.data.code === 200) {
          setSessionStorage('menu', JSON.stringify(res.data.data))
          this._getUserFunctions(params)
        }
      }).catch((error) => {
        this.$message.error(error.response.data.message)
      })
    },
    _getUserFunctions (params) {
      getUserFunctions(params).then((res) => {
        if (res.data.code === 200) {
          setSessionStorage('functions', JSON.stringify(res.data.data))
          this.$router.push({path: '/home'})
        }
      }).catch((error) => {
        this.$message.error(error.response.data.message)
      })
    }

  }
}
</script>
<style scoped>
#Scan_code_span{
  margin-left:10px;
  border:1px solid #ccc;
  border-radius: 5px;
  width: 40%;
  height: 37px;
  margin-top: 1px;
  background: #ffffff;
}
.loginMax{
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: #ccd3e0;
}
.loginpic {
  width: 70%;
  height: 50%;
  min-width: 970px;
  min-height: 540px;
  position: relative;
}
.login_div{
  width: 1061px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 40%;
  top:25%;
  margin-left: -15%;
}
.el-checkbox{
  display: flex;
  justify-content: flex-start;
}
  /*登录信息*/
.lo_text{
  width: 413px;
  height: 541px;
  background: #E8F1FC;
  box-shadow: 0 12px 22px 0 rgba(26,112,192,0.17);
  border-radius: 25px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  margin-left: 8px;
}
.el-form-item__label{
  text-align: left !important;
}
.demo-ruleForm{
 width: 300px;
}
.log_from{
  display: flex;
  justify-content: flex-start;
}
/* form.el-form.demo-ruleForm{
  width: 90% !important;
} */
/*label*/
.el-form-item__label{
  text-align: left !important;
  line-height: 50px !important;
  padding: 0 16px 0 0 !important;
}
.log_from{
  display: flex;
  justify-content: center;
}
.log_title{
  margin: 35px auto;
  font-family: PingFangSC-Semibold;
  font-size: 28px;
  color: #505D7B;
  letter-spacing: -2.12px;
}
  /*登录按钮*/
.el-button--primary{
  width: 252px;
}
.el-button.el-button--primary{margin-top: 30px;}
.el-form-item__content{
  margin-left: 60px!important;
}
.el-button--primary{
 color:#ffffff;
  background-color: #409EFF;
}
  /*图片*/
.log_pic{
  width: 787px;
  height: 430px;
  border-radius:10px;
  position: absolute;
  right: 50px;
}
.log_pic img{
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
  /*保持登录*/
.el-checkbox.is-checked{
  margin-right: 60px !important;
}
.error－tips{
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
  padding: 4px 0;
  text-align: left;
}
</style>
