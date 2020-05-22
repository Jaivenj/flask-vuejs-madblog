<template>
  <div class="Member_div">
    <el-row :gutter="20" type="flex" align="middle">
      <el-col :span="2.3" :offset="1">
        <router-link v-bind:to="{ path: `/user/${member.id}` }">
          <el-avatar shape="circle" :size="60" :src="member._links.avatar" class="Member_Border"></el-avatar>
        </router-link>
      </el-col>
      <el-col :span="2.5">
        <div>
          <font style="font-size:large;">{{member.name || member.username}}</font>
          <font style=" color:red ; font-size:2px">{{ member.followeds_count }} followeds</font>
          ,
          <font
            style=" color:green ;font-size:2px"
          >{{ member.followers_count }} following</font>
        </div>
        <p class="m-0">
          <strong>Follow Since:</strong>
          {{ $moment(member.timestamp).format('LLL') }}
        </p>
      </el-col>
    </el-row>
    <el-button
      type="danger"
      plain
      round
      v-if="member.is_following"
      v-on:click="$emit('unfollow-user')"
    >Unfollow</el-button>
    <el-button
      type="success"
      plain
      round
      v-if="!member.is_following && member.id != sharedState.user_id"
      v-on:click="$emit('follow-user')"
    >followe</el-button>
  </div>
</template>
<script>
import store from "../store";
export default {
  name: "Member",
  props: ["member"],
  data() {
    return {
      sharedState: store.state
    };
  }
};
</script>
<style scoped>
.Member_div {
  height: 100px;
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border: 1px solid #eee;
}
.el-row {
  height: 100px;
  width: 600px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.Member_Border {
  border-radius: 50px;
  border-style: solid;
  border-color: #eee;
  padding: 1px;
}
</style>
