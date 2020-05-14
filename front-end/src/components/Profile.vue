<template>
  <div class="container">
    <el-container>
      <el-header class="border">
        <H1>个人信息</H1>
      </el-header>
      <el-container class="border">
        <el-aside width="250px">
          <div class="block">
            <el-avatar
              shape="circle"
              :size="200"
              :fit="fit"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            ></el-avatar>
          </div>
          <router-link
            v-if="$route.params.id == sharedState.user_id"
            v-bind:to="{ name: 'EditProfile' }"
          >
            <el-button icon="el-icon-edit" type="primary" round>Edit Profile</el-button>
          </router-link>
        </el-aside>
        <el-main>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户管理" name="first">
              <H1>
                <font size="5">{{user.username}}</font>
              </H1>
              <el-row :gutter="20">
                <el-col :span="3.5">
                  <div class="el-icon-news">Member since :</div>
                </el-col>
                <el-col :span="6">
                  <div>{{ $moment(user.member_since).format('LLL') }}</div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="3.5">
                  <div class="el-icon-view">Last seen :</div>
                </el-col>
                <el-col :span="6">
                  <div>{{ $moment(user.last_seen).fromNow() }}</div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="3.5">
                  <div class="el-icon-message">Verified User</div>
                </el-col>
                <el-col :span="3">
                  <a v-bind:href="'mailto:' + user.email">{{ user.email }}</a>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="3.5">
                  <div class="el-icon-location-outline" v-if="user.location">Location:</div>
                </el-col>
                <el-col :span="6">
                  <div>{{user.location}}</div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="3.5" v-for="tag in tags" :key="tag.name">
                  <el-tag closable :type="tag.type">{{tag.name}}</el-tag>
                </el-col>
              </el-row>
              <el-divider>
                <i class="el-icon-postcard"></i>
              </el-divider>
              <div class="text item">
                <p>生命犹如一片绿叶，随着时间的流逝，慢慢变的枯黄，但他的叶脉还是那么清晰可见。</p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
            <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
            <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import store from "../store.js";

export default {
  name: "Profile", //this is the name of the component
  data() {
    return {
      tags: [
        { name: "标签一", type: "" },
        { name: "标签二", type: "success" },
        { name: "标签三", type: "info" },
        { name: "标签四", type: "warning" },
        { name: "标签五", type: "danger" }
      ],
      sharedState: store.state,
      activeName: "first",
      user: {
        username: "",
        email: "",
        name: "",
        location: "",
        about_me: "",
        member_since: "",
        last_seen: "",
        _links: {
          self: "",
          avatar: ""
        }
      }
    };
  },
  methods: {
    getUser(id) {
      const path = `/users/${id}`;
      this.$axios
        .get(path)
        .then(response => {
          this.user = response.data;
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error(error);
        });
    }
  },
  created() {
    const user_id = this.$route.params.id;
    this.getUser(user_id);
  },
  // 当 id 变化后重新加载数据
  beforeRouteUpdate(to, from, next) {
    this.getUser(to.params.id);
    next();
  }
};
</script>

<style>
.el-header {
  color: #333;
  text-align: center;
  line-height: 0px;
}

.el-aside {
  color: #333;
  text-align: center;
  line-height: 50px;
}

.el-main {
  color: #333;
  text-align: left;
  line-height: 15px;
}

.container {
  padding: 50px 10% 200px 10%;
}

.border {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.2);
  padding: 10px;
}

.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

.text {
  font-size: 16px;
}

.item {
  margin-bottom: 18px;
}
</style>
