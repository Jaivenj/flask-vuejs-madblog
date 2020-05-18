<template>
  <div>
    <el-container id="profile" class="Container">
      <el-header class="border">
        <H1>个人信息</H1>
      </el-header>
      <el-container class="border">
        <el-aside width="250px">
          <div class="block">
            <el-avatar shape="circle" :size="200" v-bind:src="user._links.avatar"></el-avatar>
          </div>
          <router-link v-if="$route.params.id == sharedState.user_id" v-bind:to="{ name: 'EditProfile' }">
            <el-button icon="el-icon-edit" type="primary" round>Edit Profile</el-button>
          </router-link>
        </el-aside>
        <el-main>
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
          <el-divider>
            <i class="el-icon-postcard"></i>
          </el-divider>
          <div class="text item">
            <p>生命犹如一片绿叶，随着时间的流逝，慢慢变的枯黄，但他的叶脉还是那么清晰可见。</p>
          </div>
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
        sharedState: store.state,
        user: {
          username: "",
          email: "",
          name: "",
          location: "",
          about_me: "",
          member_since: "",
          last_seen: "",
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

  .Container {
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
