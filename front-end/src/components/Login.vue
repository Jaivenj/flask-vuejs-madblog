<template>
  <div style=" padding-top:40px">
    <el-container>
      <el-header>
        <alert v-if="sharedState.is_new" v-bind:variant="info" v-bind:message="alertMessage"></alert>
        <h1>Sign In</h1>
      </el-header>
      <el-main>
        <el-row :gutter="24">
          <el-col :span="8">
            <div class="grid-content bg-purple"></div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form
                :model="loginForm"
                status-icon
                ref="loginForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="username" prop="pass">
                  <el-input
                    type="username"
                    v-model="loginForm.username"
                    autocomplete="off"
                    placeholder="Please input username"
                    v-bind:class="{'is-invalid': loginForm.usernameError}"
                  ></el-input>
                  <div
                    v-show="loginForm.usernameError"
                    class="invalid-feedback"
                  >{{ loginForm.usernameError }}</div>
                </el-form-item>
                <el-form-item label="password" prop="pass">
                  <el-input
                    type="password"
                    v-model="loginForm.password"
                    autocomplete="off"
                    placeholder="Please input password"
                    v-bind:class="{'is-invalid': loginForm.usernameError}"
                  ></el-input>
                  <div
                    v-show="loginForm.passwordError"
                    class="invalid-feedback"
                  >{{ loginForm.passwordError }}</div>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">登录</el-button>
                  <router-link to="/register" tag="span">
                    <el-button>注册</el-button>
                  </router-link>
                  <p>
                    Forgot Your Password?
                    <a href="#">Click to Reset It</a>
                  </p>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple"></div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <p>Hello Guys ! (◕ᴗ◕✿)</p>
        <p>This is a test program for Javen</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import store from '../store.js'
export default {
  name: 'Login',  //this is the name of the component
  data () {
    return {
      sharedState: store.state,
      loginForm: {
        username: '',
        password: '',
        submitted: false,  // 是否点击了 submit 按钮
        errors: 0,  // 表单是否在前端验证通过，0 表示没有错误，验证通过
        usernameError: null,
        passwordError: null
      }
    }
  },
  methods: {
    onSubmit (e) {
      this.loginForm.submitted = true  // 先更新状态
      this.loginForm.errors = 0
      if (!this.loginForm.username) {
        this.loginForm.errors++
        this.loginForm.usernameError = 'Username required.'
      } else {
        this.loginForm.usernameError = null
      }
      if (!this.loginForm.password) {
        this.loginForm.errors++
        this.loginForm.passwordError = 'Password required.'
      } else {
        this.loginForm.passwordError = null
      }
      if (this.loginForm.errors > 0) {
        // 表单验证没通过时，不继续往下执行，即不会通过 axios 调用后端API
        return false
      }
      const path = '/tokens'
      // axios 实现Basic Auth需要在config中设置 auth 这个属性即可
      this.$axios.post(path, {}, {
        auth: {
          'username': this.loginForm.username,
          'password': this.loginForm.password
        }
      }).then((response) => {
          // handle success
          window.localStorage.setItem('madblog-token', response.data.token)
          store.loginAction()
          const name = JSON.parse(atob(response.data.token.split('.')[1])).name
          this.$toasted.success(`Welcome ${name}!`, { icon: 'fingerprint' })
          if (typeof this.$route.query.redirect == 'undefined') {
            this.$router.push('/')
          } else {
            this.$router.push(this.$route.query.redirect)
          }
        })
        .catch((error) => {
          // handle error
          if (error.response.status == 401) {
            this.loginForm.usernameError = 'Invalid username or password.'
            this.loginForm.passwordError = 'Invalid username or password.'
          } else {
            console.log(error.response)
          }
        })
    }
  }
}
</script>

<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>