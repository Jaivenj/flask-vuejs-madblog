<template>
  <div>
    <!-- 页头 -->
    <div class="C_followers" v-if="followeds">
      <h4 style="padding-left:20px" class="el-icon-s-custom">User Followers(共{{followeds._meta.total_items}}个，{{followeds._meta.page}}页)</h4>
      <div style="float:right ;padding-right:30px">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <router-link v-bind:to="{ path: $route.path, query: { page: 1, per_page: 1 }}">
              <el-dropdown-item>每页 1 个</el-dropdown-item>
            </router-link>
            <router-link v-bind:to="{ path: $route.path, query: { page: 1, per_page: 5 }}">
              <el-dropdown-item>每页 5 个</el-dropdown-item>
            </router-link>
            <router-link v-bind:to="{ path: $route.path, query: { page: 1, per_page: 10 }}">
              <el-dropdown-item>每页 10 个</el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!-- Member成员 -->
    <div>
      <Member v-for="(followed, index) in followeds.items" v-bind:key="index" v-on:follow-user="onFollowUser(followed)"
        v-on:unfollow-user="onUnfollowUser(followed)" v-bind:member="followed"></Member>
    </div>
    <el-pagination background layout="prev, pager, next" :total="followeds._meta.total_items "
      :page-size="followeds._meta.per_page" style="padding:10px;text-align: right" @current-change="Current_Change()"
      :current-page.sync="Current_Page"></el-pagination>
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
        followeds:  {
          _meta:{
            total_items:null,
          }
        },
        Current_Page: Number(this.$route.query.currentPage) || 1,
      };
    },
    methods: {
      getUser(id) {
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
      getUserFolloweds(id) {
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
            console.log('followeds :', this.followeds);
          })
          .catch((error) => {
            // handle error
            console.error(error)
          })
      },
      onFollowUser(followed) {
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
      onUnfollowUser(followed) {
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
      },
      Current_Change() {
        console.log("Current_Page :", this.Current_Page);
        this.$router.push({
          path: this.$route.path,
          query: {
            page: this.Current_Page,
            per_page: this.followeds._meta.per_page
          }
        }).catch(err => {err});
      },
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
