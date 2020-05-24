<template>
  <div>
    <!-- 嵌套的子路由出口 -->

    <el-container style="padding-top:30px">
      <el-aside width="300px">
        <i v-if="user._links.avatar">
          <el-avatar shape="square" :size="250" :src="user._links.avatar" class="U_Border"></el-avatar>
        </i>
        <el-menu :default-active="activeIndex" active-text-color="#ffd04b" @select="handleSelect"
          class="el-menu-vertical-demo">
          <el-menu-item index="SettingProfile">
            Profile
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="SettingAccount">
            Account
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="SettingEmail">
            Email
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="SettingNotification">
            Notification
          </el-menu-item>
          <el-divider></el-divider>
        </el-menu>
      </el-aside>
      <el-container>
      <el-main style="padding:10px">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

    <!-- Tab Nav -->
  </div>
</template>

<script>
  import store from "../store";

  export default {
    name: "Settings",
    components: {

    },
    data() {
      return {
        sharedState: store.state,
        activeIndex: "",
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
      handleSelect(key, keyPath) {
        this.$router.push({
          name: keyPath
        });
        this.activeIndex = keyPath[0];
        console.log(" this.activeIndex :>> ", this.activeIndex);
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
      const user_id = this.sharedState.user_id
      this.getUser(user_id);

      //     this.Check_Url();

    },
    beforeRouteUpdate(to, from, next) {
      next();
      this.getUser(this.sharedState.user_id);
      //    this.Check_Url();
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        //        vm.Check_Url();
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

  .el-divider--horizontal {
    display: block;
    height: 1px;
    width: 250px;
    margin: 0px 0;
  }

</style>
