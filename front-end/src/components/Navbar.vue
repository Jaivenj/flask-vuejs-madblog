<template>
  <el-container>
    <el-header style="padding:0px">
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="1">
          <img src="../assets/logo.png" width="30" height="30" alt />
          <b>Madblog-博客</b>
        </el-menu-item>
        <el-menu-item index="2">
          <el-link :underline="false" href="/Home" type="primary">Home</el-link>
        </el-menu-item>

        <el-menu-item index="3" disabled>Explore</el-menu-item>

        <el-menu-item index="4" style="float:center">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-menu-item>

        <template v-if="sharedState.is_authenticated">
          <el-menu-item index="7" style="float:right">
            <el-link :underline="false" type="primary" v-on:click="handlerLogout">
              <el-button type="primary" style="float:right">退出</el-button>
            </el-link>
          </el-menu-item>
          <el-menu-item index="5" style="float:right">
            <router-link
              v-bind:to="{ name: 'Profile', params: { id: sharedState.user_id }}"
            >Profile</router-link>
          </el-menu-item>
          <el-menu-item index="6" style="float:right">Messages</el-menu-item>
        </template>

        <template v-else>
          <el-menu-item index="8" style="float:right">
            <el-link :underline="false" href="/Login" type="primary">
              <el-button type="primary">登录</el-button>
            </el-link>
          </el-menu-item>
        </template>
      </el-menu>
    </el-header>
  </el-container>
</template>

<script>
import store from "../store.js";

export default {
  name: "Navbar", //this is the name of the component
  data() {
    return {
      sharedState: store.state
    };
  },
  methods: {
    handlerLogout(e) {
      store.logoutAction();
      this.$router.push("/login");
    }
  }
};
</script>

<style>
a {
  text-decoration: none;
}

.router-link-active {
  text-decoration: none;
}
</style>