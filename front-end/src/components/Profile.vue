<template>
  <div class="P_body">
    <div style=" padding-bottom:40px">
    <font style="font-weight:500;font-size:40px">Public profile</font>
    </div>
    <el-form :model="profileForm" status-icon ref="registerForm" label-width="100px" class="demo-registerForm">
      <el-form-item label="Username" prop>
        <el-input type="username" v-model="profileForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="EmailAddress" prop>
        <el-input type="Email address" v-model="profileForm.email" autocomplete="off"></el-input>
     
      </el-form-item>
      <el-form-item label="Location" prop>
        <el-input v-model="profileForm.location"></el-input>
      </el-form-item>

      <el-form-item label="About me" prop>
        <el-input v-model="profileForm.about_me" type="textarea" :autosize="{ minRows: 2, maxRows: 4}"></el-input>

      </el-form-item>

      <el-form-item style="float:left">
        <el-button type="primary" @click="onSubmit('profileForm')">Submit</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import store from "../store.js";

  export default {
    name: "Profile", //this is the name of the component
    data() {
      return {
        sharedState: store.state,
        profileForm: {
          username: '',
          location: '',
          email: "",
          about_me: ''
        },
      };
    },
    methods: {
      getUser(id) {
        const path = `/users/${id}`;
        this.$axios
          .get(path)
          .then(response => {
            this.profileForm.username = response.data.username
            this.profileForm.location = response.data.location
            this.profileForm.about_me = response.data.about_me
            this.profileForm.email = response.data.email

            console.log('this.profileForm.username :', response);
          })
          .catch(error => {
            // eslint-disable-next-line
            console.error(error);
          });
      },
      onSubmit(e) {
        const user_id = this.sharedState.user_id
        const path = `/users/${user_id}`
        const payload = {
          username: this.profileForm.username,
          email: this.profileForm.email,
          location: this.profileForm.location,
          about_me: this.profileForm.about_me
        }
        this.$axios.put(path, payload)
          .then((response) => {
            // handle success
            this.$toasted.success('Congratulations, you are updating !', {
              icon: 'fingerprint'
            })
            this.$router.push({
              path: `/user/${user_id}/overview`
            })
          })
          .catch((error) => {
            // handle error
            console.log(error.response.data)
          })
      },
    },
    created() {
      const user_id = this.sharedState.user_id;
      this.getUser(user_id);
    },
    // 当 id 变化后重新加载数据
  };

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
