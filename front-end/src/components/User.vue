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
          <el-button
            type="danger"
            round
            plain
            style="width:250px"
            icon="el-icon-download"
          >Export posts</el-button>
        </i>
        <i v-if="$route.params.id == sharedState.user_id">
          <el-button
            type="warning"
            round
            plain
            style="width:250px"
            icon="el-icon-error"
            v-on:click="onDeleteUser($route.params.id)"
          >Delete Account</el-button>
        </i>
        <i v-if="!user.is_following && $route.params.id != sharedState.user_id">
          <el-button
            type="success"
            round
            plain
            style="width:250px"
            icon="el-icon-user-solid"
            v-on:click="onFollowUser($route.params.id)"
          >Follow</el-button>
        </i>
        <i v-if="user.is_following && $route.params.id != sharedState.user_id">
          <el-button
            type="danger"
            round
            plain
            style="width:250px"
            icon="el-icon-user-solid"
            v-on:click="onUnfollowUser($route.params.id)"
          >UnFollow</el-button>
        </i>
      </el-aside>
      <el-container>
        <el-header>
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            active-text-color="#ffd04b"
            @select="handleSelect"
          >
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
              <el-badge :value="user.followeds_count" class="item" type="danger" ></el-badge>
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

    <div>
      <div class="C_followers">
        <h4 style="padding-left:20px" class="el-icon-s-custom">Publish New Post</h4>
        <div style="float:right;padding-right:30px;padding-top:15px">
          <el-dropdown trigger="click" >
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>每页 1 个</el-dropdown-item>
              <el-dropdown-item>每页 5 个</el-dropdown-item>
              <el-dropdown-item>每页 10 个</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="float:left">Comments</span>
          <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
        </div>
        <div class="text item">
          <span>
            <el-input placeholder="标题" style="padding-bottom:10px"></el-input>
          </span>
          <span>
            <el-input placeholder="摘要" style="padding-bottom:10px"></el-input>
          </span>
          <quill-editor
            ref="C_myQuillEditor"
            style="height:150px;padding-bottom:50px"
            @focus="onEditorFocus($event)"
          ></quill-editor>
        </div>
        <div style="float:left;padding:20px">
          <el-button>Cancle</el-button>
          <el-button>Sumbit</el-button>
        </div>
      </el-card>
    </div>

    <!-- Tab Nav -->
  </div>
</template>

<script>
import store from "../store";
import { quillEditor } from "vue-quill-editor"; //调用编辑器
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

      this.$router.push({
        name: keyPath
      });
      this.activeIndex = keyPath[0];
      console.log(" this.activeIndex :>> ", this.activeIndex);
    }
  },
  created() {
    const user_id = this.$route.params.id;
    this.getUser(user_id);
    this.handleSelect();
    console.log("this.activeIndex :", this.activeIndex);
  },
  beforeRouteUpdate(to, from, next) {
    next();
    this.getUser(to.params.id);
    this.activeIndex = "Overview";
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
  height: 50px;
  width: 100%;
  background-color: #eee;
  font-size: 1rem;
  line-height: 25px;
  color: rgb(124, 120, 120);
}
</style>
