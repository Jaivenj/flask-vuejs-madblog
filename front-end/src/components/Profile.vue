<template>
  <div class="container">
    <el-container>
      <el-header>个人信息</el-header>
      <el-container class="border">
        <el-aside width="250px">
          
          <div class="block">
            <el-avatar shape="circle" :size="200" :fit="fit"
              src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
          </div>
          <H1 >
            <font size="6">{{user.username}}</font>
          </H1>
          <el-button icon="el-icon-edit" type="primary" round >Edit Profile</el-button>

        </el-aside>
        <el-main>
          Main
            <el-divider><i class="el-icon-postcard"></i></el-divider>
          </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import store from '../store.js'

  export default {
    name: 'Profile', //this is the name of the component
    data() {
      return {
        sharedState: store.state,
        user: {
          username: '',
          email: '',
          name: '',
          location: '',
          about_me: '',
          member_since: '',
          last_seen: '',
          _links: {
            self: '',
            avatar: ''
          }
        }
      }
    },
    methods: {
      getUser(id) {
        const path = `/users/${id}`
        this.$axios.get(path)
          .then((response) => {
            this.user = response.data
          })
          .catch((error) => {
            // eslint-disable-next-line
            console.error(error)
          });
      }
    },
    created() {
      const user_id = this.$route.params.id
      this.getUser(user_id)
    },
    // 当 id 变化后重新加载数据
    beforeRouteUpdate(to, from, next) {
      this.getUser(to.params.id)
      next()
    }
  }

</script>

<style>
  .el-header {

    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {

    color: #333;
    text-align: center;
    line-height: 10px;

  }

  .el-main {

    color: #333;
    text-align: center;
    line-height: 100px;
  }

  .container {
    padding: 100px;
  }
  .border{
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .20);
      padding: 40px
  }
</style>
