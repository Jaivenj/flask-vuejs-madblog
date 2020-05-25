<template>
  <div style=" padding-top:40px">
    <el-header>
      <H1>Register</H1>
    </el-header>
    <el-container class="container">
      <el-row :gutter="24">
        <el-col :span="8">
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-main justify="center">
              <el-form
                :model="registerForm"
                status-icon
                :rules="rules"
                ref="registerForm"
                label-width="100px"
                class="demo-registerForm"
              >
                <el-form-item label="Username" prop>
                  <el-input type="username" v-model="registerForm.username" autocomplete="off"></el-input>
                  <div v-show="registerForm.usernameError">{{ registerForm.usernameError }}</div>
                </el-form-item>
                <el-form-item label="EmailAddress" prop>
                  <el-input type="Email address" v-model="registerForm.email" autocomplete="off"></el-input>
                  <div
                    v-show="registerForm.emailError"
                    class="invalid-feedback"
                  >{{ registerForm.emailError }}</div>
                </el-form-item>
                <el-form-item label="Password" prop>
                  <el-input v-model="registerForm.password"></el-input>
                  <div
                    v-show="registerForm.passwordError"
                    class="invalid-feedback"
                  >{{ registerForm.passwordError }}</div>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit('registerForm')">提交</el-button>
                  <el-button @click="resetForm('registerForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </el-main>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple"></div>
        </el-col>
      </el-row>
      <el-footer>
        <p>Hello Guys ! (◕ᴗ◕✿)</p>
        <p>This is a test program for Javen</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Register', //this is the name of the component
  data () {
    return {
      registerForm: {
        username: '',
        email: '',
        password: '',
        submitted: false,  // 是否点击了 submit 按钮
        errors: 0,  // 表单是否在前端验证通过，0 表示没有错误，验证通过
        usernameError: null,
        emailError: null,
        passwordError: null
      }
    }
  },
  methods: {
    onSubmit (e) {
      this.registerForm.submitted = true  // 先更新状态
      this.registerForm.errors = 0
      if (!this.registerForm.username) {
        this.registerForm.errors++
        this.registerForm.usernameError = 'Username required.'
      } else {
        this.registerForm.usernameError = null
      }
      if (!this.registerForm.email) {
        this.registerForm.errors++
        this.registerForm.emailError = 'Email required.'
      } else if (!this.validEmail(this.registerForm.email)) {
        this.registerForm.errors++
        this.registerForm.emailError = 'Valid email required.'
      } else {
        this.registerForm.emailError = null
      }
      if (!this.registerForm.password) {
        this.registerForm.errors++
        this.registerForm.passwordError = 'Password required.'
      } else {
        this.registerForm.passwordError = null
      }
      if (this.registerForm.errors > 0) {
        // 表单验证没通过时，不继续往下执行，即不会通过 axios 调用后端API
        return false
      }
      const path = '/users'
      const payload = {
        username: this.registerForm.username,
        email: this.registerForm.email,
        password: this.registerForm.password
      }
      this.$axios.post(path, payload)
        .then((response) => {
          // handle success
          this.$toasted.success('Congratulations, you are now a registered user !', { icon: 'fingerprint' })
          this.$router.push('/login')
        })
        .catch((error) => {
          // handle error
          for (var field in error.response.data.message) {
            if (field == 'username') {
              this.registerForm.usernameError = error.response.data.message.username
            } else if (field == 'email') {
              this.registerForm.emailError = error.response.data.message.email
            } else if (field == 'password') {
              this.registerForm.passwordError = error.response.data.message.password
            }
          }
        })
    },
    validEmail: function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email)
    }
  }
}
</script>
<style>
.el-row {
  margin-bottom: 20px;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
