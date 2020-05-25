<template>
  <div>
    <!-- 嵌套的子路由出口 -->

    <el-container style="padding-top:30px">
      <el-aside width="300px">
        <i v-if="user._links.avatar">
          <el-avatar shape="square" :size="250" :src="user._links.avatar" class="U_Border"></el-avatar>
        </i>
        <i v-if="$route.params.id == sharedState.user_id">
          <el-button type="primary" round plain style="width:250px" icon="el-icon-s-tools">
            <router-link v-bind:to="{ name: 'SettingProfile' }">Settings</router-link>
          </el-button>
        </i>
        <i v-if="$route.params.id == sharedState.user_id">
          <el-button type="danger" round plain style="width:250px" icon="el-icon-download">Export posts</el-button>
        </i>
        <i v-if="$route.params.id == sharedState.user_id">
          <el-button type="warning" round plain style="width:250px" icon="el-icon-error"
            v-on:click="onDeleteUser($route.params.id)">Delete Account</el-button>
        </i>
        <i v-if="!user.is_following && $route.params.id != sharedState.user_id">
          <el-button type="success" round plain style="width:250px" icon="el-icon-user-solid"
            v-on:click="onFollowUser($route.params.id)">Follow</el-button>
        </i>
        <i v-if="user.is_following && $route.params.id != sharedState.user_id">
          <el-button type="danger" round plain style="width:250px" icon="el-icon-user-solid"
            v-on:click="onUnfollowUser($route.params.id)">UnFollow</el-button>
        </i>
      </el-aside>
      <el-container>
        <el-header>
          <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" active-text-color="#ffd04b"
            @select="handleSelect">
            <el-menu-item index="Overview">
              Overview
              <el-badge class="item" type="warning">*</el-badge>
            </el-menu-item>

            <el-menu-item index="Followers">
              Followers
              <el-badge :value="user.followers_count" class="item" type="primary"></el-badge>
            </el-menu-item>
            <el-menu-item index="Following">
              Following
              <el-badge :value="user.followeds_count" class="item" type="danger"></el-badge>
            </el-menu-item>
            <el-menu-item index="UserPostsList">
              Posts
              <el-badge :value="user.posts_count" class="item" type="success"></el-badge>
            </el-menu-item>
          </el-menu>
        </el-header>
        <el-main style="padding:10px">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    <div v-if="sharedState.is_authenticated && $route.params.id == sharedState.user_id">
      <div class="C_followers">
        <h4 style="padding-left:20px" class="el-icon-s-custom">Publish New Post</h4>
      
      </div>

      <el-card class="box-card" v-if="sharedState.is_authenticated && $route.params.id == sharedState.user_id">
        <div slot="header" class="clearfix">
          <span style="float:left">Post here</span>
          <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
        </div>
        <div class="text item">
          <span>
            <el-input placeholder="标题" style="padding-bottom:10px" v-model="postForm.title"></el-input>
          </span>
          <span>
            <el-input placeholder="摘要" style="padding-bottom:10px" v-model="postForm.summary"></el-input>
          </span>
          <quill-editor v-model="postForm.body" ref="C_myQuillEditor" style="height:150px;padding-bottom:50px">
          </quill-editor>
        </div>
        <div style="float:left;padding:20px">
          <el-button>Cancle</el-button>
          <el-button @click="onSubmitAdd">Sumbit</el-button>
        </div>
      </el-card>
    </div>

    <!-- Tab Nav -->
  </div>
</template>

<script>
  import store from "../store";
  import {
    quillEditor
  } from "vue-quill-editor"; //调用编辑器
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "quill/dist/quill.bubble.css";
  export default {
    name: "User",
    components: {
      quillEditor
    },
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
    computed: {},
    methods: {
      getUser(id) {
        const path = `/users/${id}`;
        this.$axios
          .get(path)
          .then(response => {
            // handle success
            this.user = response.data;
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
        this.$router.push({
          name: keyPath
        });
        this.activeIndex = keyPath[0];
        console.log(" this.activeIndex :>> ", this.activeIndex);
      },
      onSubmitAdd(e) {
        this.postForm.errors = 0 // 重置
        if (!this.postForm.title) {
          this.postForm.errors++
          this.postForm.titleError = 'Title is required.'
        } else {
          this.postForm.titleError = null
        }
        if (!this.postForm.body) {
          this.postForm.errors++
          this.postForm.bodyError = 'Body is required.'

        }
        if (this.postForm.errors > 0) {
          // 表单验证没通过时，不继续往下执行，即不会通过 axios 调用后端API
          return false
        }
        const path = '/posts'
        const payload = {
          title: this.postForm.title,
          summary: this.postForm.summary,
          body: this.postForm.body
        }
        this.$axios.post(path, payload)
          .then((response) => {
            // handle success
            this.$toasted.success('Successed add a new post.', {
              icon: 'fingerprint'
            })
            this.postForm.title = '',
              this.postForm.summary = '',
              this.postForm.body = ''
            // 必须加个动态参数，不然路由没变化的话，UserPostsList 组件不会刷新重新加载博客列表
            this.$router.push({
              name: 'UserPostsList',
              query: {
                id: response.data.id
              }
            })
            this.activeIndex = "UserPostsList";
          })
          .catch((error) => {
            // handle error
            console.log(error.response.data)
          })
      },
      Check_Url() {
        var url = (window.location.href).split('#')[1].split('/')[3] || (window.location.href).split('#')[1].split('=')[
          1];
        console.log('url :', url);
        if (url) {
          switch (url) {
            case "Overview":
              this.activeIndex = "Overview"
              console.log("switch Overview 成功");
              break;
            case "followers":
              this.activeIndex = "Followers"
              console.log("switch Followers 成功");
              break;
            case "following":
              this.activeIndex = "Following"
              console.log("switch Following 成功");
              break;
            case "followeds-posts":
              this.activeIndex = "UserPostsList"
              console.log("switch UserPostsList 成功");
              break;
            default:
              break;
          }
        }
      }
    },
    created() {
      const user_id = this.$route.params.id;
      this.getUser(user_id);
      this.handleSelect();
      this.Check_Url();

    },
    beforeRouteUpdate(to, from, next) {
      next();
      this.getUser(to.params.id);
      this.Check_Url();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.Check_Url();
      })
    }
  };

</script>

<style scoped>
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

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: 100%;
    height: 100%;
    margin: 0 auto;
  }

  .C_followers {
    margin: 40px 0px 20px 0px;
    width: 100%;
    background-color: #eee;
    font-size: 1rem;
    line-height: 25px;
    color: rgb(124, 120, 120);
  }

</style>
