<template>
  <div>
    <!-- 页头 -->
    <div class="C_followers" v-if="followers">
      <h4 style="padding-left:20px" class="el-icon-s-custom">User Followers(共{{followers._meta.total_items}}个，{{followers._meta.page}}页)</h4>
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
        v-for="(follower, index) in followers.items"
        v-bind:key="index"
        v-on:follow-user="onFollowUser(follower)"
        v-on:unfollow-user="onUnfollowUser(follower)"
        v-bind:member="follower"
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
      followers: ""
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
        })
        .catch(error => {
          // handle error
          console.error(error);
        });
    },
    getUserFollowers(id) {
      let page = 1;
      let per_page = 5;
      if (typeof this.$route.query.page != "undefined") {
        page = this.$route.query.page;
      }
      if (typeof this.$route.query.per_page != "undefined") {
        per_page = this.$route.query.per_page;
      }

      const path = `users/${id}/followers/?page=${page}&per_page=${per_page}`;
      this.$axios
        .get(path)
        .then(response => {
          // handle success
          this.followers = response.data;
          console.log('this.followers :>> ', this.followers);
        })
        .catch(error => {
          // handle error
          console.error(error);
        });
    },
    onFollowUser(follower) {
      const path = `follow/${follower.id}`;
      this.$axios
        .get(path)
        .then(response => {
          // handle success
          this.getUserFollowers(this.$route.params.id);
        })
        .catch(error => {
          // handle error
          console.error(error);
        });
    },
    onUnfollowUser(follower) {
      const path = `unfollow/${follower.id}`;
      this.$axios
        .get(path)
        .then(response => {
          // handle success
          this.getUserFollowers(this.$route.params.id);
        })
        .catch(error => {
          // handle error
          console.error(error);
        });
    }
  },
  created() {
    const user_id = this.$route.params.id;
    this.getUser(user_id);
    this.getUserFollowers(user_id);
  },
  // 进入子路由后重新加载数据
  beforeRouteUpdate(to, from, next) {
    next();
    this.getUser(to.params.id);
    this.getUserFollowers(to.params.id);
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
