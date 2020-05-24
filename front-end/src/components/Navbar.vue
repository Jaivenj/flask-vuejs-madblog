<template>
  <el-container>
    <el-header style="padding:0px">
      <el-menu class="el-menu-demo" mode="horizontal" background-color="#545c64" text-color="#fff"
        active-text-color="#ffd04b">
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

        <el-menu-item v-if="sharedState.is_authenticated" style="float:right;width:150px">

          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              <el-row :gutter="40">
                <el-col :span="2">
                  <el-avatar @click.native="$emit('change-Item')" shape="circle" :size="30"
                    :src="sharedState.user_avatar" class="Member_Border"></el-avatar>
                </el-col>
                <el-col :span="2" style="color:#fff">{{sharedState.user_name}}</el-col>
                <el-col :span="2"> <i class="el-icon-arrow-down el-icon--right" style="color:#fff"></i></el-col>
              </el-row>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link v-bind:to="{ path: `/user/${sharedState.user_id}` }" class="dropdown-item" tag="li">
                  Your profile
                </router-link>
              </el-dropdown-item>

              <el-dropdown-item>Your resource</el-dropdown-item>

              <el-dropdown-item>
                <router-link v-bind:to="{ name: 'SettingProfile' }" class="dropdown-item" tag="li">Settings</router-link>
              </el-dropdown-item>

              <el-dropdown-item> <div v-on:click="handlerLogout" href="#" >Sign out</div></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>


        </el-menu-item>

        <el-menu-item v-else style="float:right">
          <el-link :underline="false" href="/Login" type="primary" icon="el-icon-thumb">
            Sign in 
          </el-link>
        </el-menu-item>

        <!-- <template v-if="sharedState.is_authenticated">
          <el-menu-item index="7" style="float:right">
            <el-link :underline="false" type="primary" v-on:click="handlerLogout">
              <el-button type="primary" style="float:right">退出</el-button>
            </el-link>
          </el-menu-item>
          <el-menu-item index="5" style="float:right">
            <router-link v-bind:to="{ name: 'User', params: { id: sharedState.user_id }}">Profile</router-link>
          </el-menu-item>
          <el-menu-item index="6" style="float:right">Messages</el-menu-item>
        </template>

        <template v-else>
          <el-menu-item index="8" style="float:right">
            <el-link :underline="false" href="/Login" type="primary">
              <el-button type="primary">登录</el-button>
            </el-link>
          </el-menu-item>
        </template> -->
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
        this.$router.push("/login").catch(err => {
          err;
        });
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
