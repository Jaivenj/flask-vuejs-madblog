<template>
  <div>
    <!-- 页头 -->
    <div class="C_followers" v-if="followeds">
      <h4 style="padding-left:20px" class="el-icon-s-custom">User Followers(共4个，1页)</h4>
      <div style="float:right ;padding-right:30px">
        <el-dropdown trigger="click">
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
    <!-- Member成员 -->
    <div>
      <Member
        v-for="(followed, index) in followeds.items"
        v-bind:key="index"
        v-on:follow-user="onFollowUser(followed)"
        v-on:unfollow-user="onUnfollowUser(followed)"
        v-bind:member="followed"
      ></Member>
    </div>
  </div>
</template>

<script>
import Member from "./Member";

export default {
  name: "Followers",
  components: {
    Member
  },
  data() {
    return {
      user: "",
      followeds: ""
    };
  },
  methods: {
      getUser (id) {
      const path = `/users/${id}`
      this.$axios.get(path)
        .then((response) => {
          // handle success
          this.user = response.data
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    },
    getUserFolloweds (id) {
      let page = 1
      let per_page = 5
      if (typeof this.$route.query.page != 'undefined') {
        page = this.$route.query.page
      }
      if (typeof this.$route.query.per_page != 'undefined') {
        per_page = this.$route.query.per_page
      }
      
      const path = `users/${id}/followeds/?page=${page}&per_page=${per_page}`
      this.$axios.get(path)
        .then((response) => {
          // handle success
          this.followeds = response.data
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    },
    onFollowUser (followed) {
      const path = `/follow/${followed.id}`
      this.$axios.get(path)
        .then((response) => {
          // handle success
          this.getUserFolloweds(this.$route.params.id)
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    },
    onUnfollowUser (followed) {
      const path = `/unfollow/${followed.id}`
      this.$axios.get(path)
        .then((response) => {
          // handle success
          this.getUserFolloweds(this.$route.params.id)
        })
        .catch((error) => {
          // handle error
          console.error(error)
        })
    }
  },
  created() {
    const user_id = this.$route.params.id;
    this.getUser(user_id);
    this.getUserFolloweds(user_id);
  },
  // 进入子路由后重新加载数据
  beforeRouteUpdate(to, from, next) {
    next();
    this.getUser(to.params.id);
    this.getUserFolloweds(to.params.id);
  }
};
</script>

<style scoped>
.C_followers {
  margin-bottom: 20px;
  height: 60px;
  width: 100%;
  background-color: #eee;
  font-size: 1rem;
  line-height: 60px;
  color: rgb(124, 120, 120);
}
.el-dropdown-link {
  color: #409eff;
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
