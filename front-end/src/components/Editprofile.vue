<template>
  <div class="con">
      <h1>Edit Your Profile</h1>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="Real Name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="Locaticon">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="About_me">
        <el-input type="textarea" v-model="form.desc"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import store from "../store.js";

export default {
  name: "EditProfile", //this is the name of the component
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      sharedState: store.state,
      profileForm: {
        name: "",
        location: "",
        about_me: "",
        submitted: false // 是否点击了 submit 按钮
      }
    };
  },
  methods: {
    getUser(id) {
      const path = `/users/${id}`;
      this.$axios
        .get(path)
        .then(response => {
          this.profileForm.name = response.data.name;
          this.profileForm.location = response.data.location;
          this.profileForm.about_me = response.data.about_me;
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    onSubmit(e) {
      const user_id = this.sharedState.user_id;
      const path = `/users/${user_id}`;
      const payload = {
        name: this.profileForm.name,
        location: this.profileForm.location,
        about_me: this.profileForm.about_me
      };
      this.$axios
        .put(path, payload)
        .then(response => {
          // handle success
          this.$toasted.success("Successed modify your profile.", {
            icon: "fingerprint"
          });
          this.$router.push({
            name: "Profile",
            params: { id: user_id }
          });
        })
        .catch(error => {
          // handle error
          console.log(error.response.data);
        });
    }
  },
  created() {
    const user_id = this.sharedState.user_id;
    this.getUser(user_id);
  }
};
</script>
<style >
.con {
  padding: 50px;
  height: 50%;
  width: 30%;
  text-align: center;
  margin: 0 auto;
}
</style>