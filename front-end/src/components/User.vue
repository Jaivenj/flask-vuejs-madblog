<template>
  <div>
    <!-- 嵌套的子路由出口 -->

    <el-container style="padding-top:50px">
      <el-aside width="300px">
        <i>
          <el-avatar shape="square" :size="250" :src="user._links.avatar" class="U_Border"></el-avatar>
        </i>
        <i v-if="$route.params.id == sharedState.user_id">
          <el-button type="primary" round plain style="width:250px" icon="el-icon-s-tools">Settings</el-button>
        </i>
        <i>
          <el-button type="danger" round plain style="width:250px" icon="el-icon-download">Export posts</el-button>
        </i>
        <i v-if="$route.params.id == sharedState.user_id">
          <el-button type="warning" round plain style="width:250px" icon="el-icon-error">Delete Account</el-button>
        </i>
        <i v-if="!user.is_following && $route.params.id != sharedState.user_id">
          <el-button type="danger" round plain style="width:250px" icon="el-icon-user-solid">Follow</el-button>
        </i>
        <i v-if="user.is_following && $route.params.id != sharedState.user_id">
          <el-button type="success" round plain style="width:250px" icon="el-icon-user-solid">UnFollow</el-button>
        </i>
      </el-aside>
      <el-container>
        <el-header>
          <el-menu  default-active="activeIndex" class="el-menu-demo" mode="horizontal"
            active-text-color="#ffd04b" @select="handleSelect">
            <el-menu-item index="Overview">Overview</el-menu-item>

            <el-menu-item index="Followers">
              Followers
              <el-badge :value="12" class="item" type="primary"></el-badge>
            </el-menu-item>
            <el-menu-item index="Following">
              Following
              <el-badge :value="12" class="item"></el-badge>
            </el-menu-item>
            <el-menu-item index="Posts">
              Posts
              <el-badge :value="12" class="item" type="warning"></el-badge>
            </el-menu-item>
            <el-menu-item index="UserPostsList">
              FollowingPosts
              <el-badge :value="12" class="item" type="success"></el-badge>
            </el-menu-item>
          </el-menu>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    <!-- Tab Nav -->
  </div>
</template>

<script>
  import store from '../store'

  export default {
    name: "User",
    data() {
      return {
        sharedState: store.state,
        activeIndex: "Overview",
        user: {
          email: "",
          id: "",
          last_seen: "",
          location: "",
          member_since: "",
          name: "",
          username: "",
          _links: {
            avatar: ""
          }
        },
        postForm: {
          title: "",
          summary: "",
          body: "",
          errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
          titleError: null,
          bodyError: null
        }
      };
    },
    methods: {
      getUser(id) {
        const path = `/users/${id}`;
        this.$axios
          .get(path)
          .then(response => {
            // handle success
            this.user = response.data;
            console.log("response.data :>> ", response.data);
          })
          .catch(error => {
            // handle error
            console.error(error);
          });
      },
      onFollowUser(id) {
        const path = `/follow/${id}`;
        this.$axios
          .get(path)
          .then(response => {
            // handle success
            this.getUser(id);
          })
          .catch(error => {
            // handle error
            console.error(error);
          });
      },
      onUnfollowUser(id) {
        const path = `/unfollow/${id}`;
        this.$axios
          .get(path)
          .then(response => {
            // handle success
            this.getUser(id);
          })
          .catch(error => {
            // handle error
            console.error(error);
          });
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
        this.activeIndex = keyPath;
        this.$router.push({
          name: this.activeIndex
        });
      }
    },
    created() {
      const user_id = this.$route.params.id;
      this.getUser(user_id);
      this.handleSelect()
      console.log('this.activeIndex :', this.activeIndex);
    }
  };

</script>

<style>
  .el-aside {
    color: #333;
    text-align: center;
    line-height: 50px;
  }

  .U_Border {
    border-radius: 0px;
    border-style: solid;
    border-color: #eee;
    padding: 2px;
  }

</style>
