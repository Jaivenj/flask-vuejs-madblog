<template>
  <div class="A">
    <ul style=" list-style-type: none;color:#555 ;">
      <li v-if="user.name">
        <h1 style="font-size:35px;">{{user.name}}</h1>
      </li>
      <li v-else>
        <h1 style="font-size:35px">{{user.username}}</h1>
      </li>
      <li>
        <h4>
          <label class="el-icon-s-order" style="padding-right:10px"></label>
          Member since : {{ $moment(user.member_since).format('LLL') }}
        </h4>
      </li>
      <li>
        <h4>
          <label class="el-icon-user-solid" style="padding-right:10px"></label>
          Last seen : {{ $moment(user.last_seen).fromNow() }}
        </h4>
      </li>
      <li>
        <h4>
          <label class="el-icon-message" style="padding-right:10px"></label>Verified User : 
          <a style="color:#72c02c;" v-bind:href="'mailto:' + user.email"> {{user.email}}</a>
        </h4>
      </li>
      <li v-if="user.location">
        <h4>
          <label class="el-icon-location" style="padding-right:10px"></label>
          Location :  <small>{{user.location}}</small> 
        </h4>
      </li>
    </ul>
    <el-divider>
      <i class="el-icon-mobile-phone"></i>
    </el-divider>

    <div style="padding-left:40px"> {{user.about_me}} </div>
  </div>
</template>

<script>
  export default {
    name: "Overview",
    data() {
      return {
        user: ""
      };
    },
    methods: {
      getUser(id) {
        const path = `/users/${id}`;
        this.$axios
          .get(path)
          .then(response => {
            this.user = response.data;
            console.log("this.user :>> ", this.user);
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
  .A {
    font-weight: 400;
    font-size: 1rem;
    font-family: Open Sans, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #555;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizelegibility;
  }

</style>
