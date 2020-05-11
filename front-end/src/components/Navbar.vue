<template>
  <el-container>
    <el-header>
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="1">
           <img src="../assets/logo.png" width="30" height="30" alt="">  
            <b>Madblog-博客</b> </el-menu-item>
        <el-menu-item index="2">
          <a href="https://www.ele.me" target="_blank" >Home</a>
        </el-menu-item>
        <el-menu-item index="3" disabled>Explore</el-menu-item>

        <el-submenu index="4">
          <template slot="title">
          <el-link :underline="false" href="/Login"  icon="el-icon-edit" type="primary" >Login</el-link>
            </template>
          <el-menu-item index="4-1">Profile</el-menu-item>
          <el-menu-item index="4-2">Messages</el-menu-item>
        </el-submenu>
  

      </el-menu>
    </el-header>
  </el-container>
</template>

<script>
export default {};
</script>

<style>
</style>