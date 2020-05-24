<template>
  <div class="P_body">
    <div style=" padding-bottom:40px">
      <font style="font-weight:500;font-size:40px;">Change Your Password</font>
    </div>
    <el-form :model="changePasswordForm" status-icon ref="registerForm" label-width="100px" class="demo-registerForm">
      <el-form-item label="OldPassword" prop>
        <el-input type="username" v-model="changePasswordForm.oldPassword" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="NewPassword" prop>
        <el-input type="Email address" v-model="changePasswordForm.newPassword" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item style="float:left">
        <el-button type="primary" @click="onSubmit('changePasswordForm')">Update Password</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import store from "../store.js";

  export default {
    name: "Account", //this is the name of the component
    data() {
      return {
        sharedState: store.state,
        changePasswordForm: {
          oldPassword: "",
          newPassword: "",
          errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
          oldPasswordError: null,
          newPasswordError: null
        },
      };
    },
    methods: {
      onSubmit(e) {
        this.changePasswordForm.errors = 0 // 重置
        if (!this.changePasswordForm.oldPassword) {
          this.changePasswordForm.errors++
          this.changePasswordForm.oldPasswordError = 'Old Password required.'
        } else {
          this.changePasswordForm.oldPasswordError = null
        }
        if (!this.changePasswordForm.newPassword) {
          this.changePasswordForm.errors++
          this.changePasswordForm.newPasswordError = 'New Password required.'
        } else {
          this.changePasswordForm.newPasswordError = null
        }
        if (this.changePasswordForm.errors > 0) {
          // 如果旧密码或新密码为空时，不继续往下执行，即不会通过 axios 调用后端API
          return false
        } else if (this.changePasswordForm.newPassword == this.changePasswordForm.oldPassword) {
          // 旧密码与新密码不为空，但值相等，也不允许
          this.changePasswordForm.oldPasswordError = 'The new password can not be equal to the old password.'
          this.changePasswordForm.newPasswordError = 'The new password can not be equal to the old password.'
          return false
        }
        const path = `/update-password`
        const payload = {
          old_password: this.changePasswordForm.oldPassword,
          new_password: this.changePasswordForm.newPassword
        }
        this.$axios.post(path, payload)
          .then((response) => {
            // handle success
            this.$toasted.success(response.data.message, {
              icon: 'fingerprint'
            })
            this.$router.push('/login')
          })
          .catch((error) => {
            // handle error
            console.log(error.response.data)
            this.$toasted.error(error.response.data.message, {
              icon: 'fingerprint'
            })
          })
      }
    }
  }

</script>

<style scoped>
  .P_body {
    text-align: center;
    font-weight: 400;
    font-size: 1rem;
    font-family: Open Sans, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #555;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizelegibility;
  }

</style>
