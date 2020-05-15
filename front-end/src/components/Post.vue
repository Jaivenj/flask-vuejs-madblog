<template>
  <div style="padding:20px">
    <el-container class="border">
      <el-aside width="200px">
        <div class="block">
          <router-link
            v-bind:to="{ path: `/user/${post.author.id}` }"
            v-bind:title="post.author.name || post.author.username"
          >
            <div>
              <el-avatar
                shape="circle"
                :size="70"
                :fit="fit"
                :src="post.author._links.avatar"
                class="Circle"
              ></el-avatar>
            </div>
          </router-link>
        </div>
      </el-aside>
      <el-container>
        <el-header>
          <div style="float:left">
            <h4>
              <router-link v-bind:to="{ path: `/user/${post.author.id}` }">
                <font color="#72c02c">{{ post.author.name || post.author.username }}</font>
              </router-link>
              <span class="h6">
                发布了文章
                <router-link v-bind:to="{ name: 'PostDetail', params: { id: post.id } }">
                  <font color="#72c02c">《{{ post.title }}》</font>
                </router-link>
              </span>
            </h4>
            <span>{{ $moment(post.timestamp).format('YYYY年MM月DD日 HH:mm:ss') }}</span>
          </div>
        </el-header>

        <el-main>
          <vue-markdown :source="post.summary" style="float:left;font-size:22px"></vue-markdown>
        </el-main>

        <el-footer>
          <div class="el-icon-view" style="padding-right:20px;width:40px">
            <span style="padding-left:5px">1</span>
          </div>
          <div class="el-icon-coffee-cup" style="padding-right:20px;width:40px">
            <span style="padding-left:5px">1</span>
          </div>
          <div class="el-icon-chat-round" style="padding-right:20px;width:40px">
            <span style="padding-left:5px">1</span>
          </div>
        
            <el-button type="primary" style="float:right" size="small">阅读全文 </el-button>
         
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import store from "../store";
import VueMarkdown from "vue-markdown";
export default {
  name: "Post",
  post: {},
  props: ["post"],
  components: {
    VueMarkdown
  },
  data() {
    return {
      sharedState: store.state
    };
  },
  methods: {
    getPost(id) {
      const path = `/api/posts/${id}`;
      this.$axios
        .get(path)
        .then(response => {
          this.post = response.data;
          console.log("getPost (id):>", this.post);
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error(error);
        });
    }
  }
};
</script>
<style >
.border {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.2);
  padding: 10px;
}
.Circle {
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.el-header,
.el-footer {
  color: #333;
  text-align: left;
  line-height: 15px;
}

.el-aside {
  color: #333;
  text-align: right;
  line-height: 0px;
  padding-right: 20px;
}

.el-main {
  color: #333;
  text-align: left;
  line-height: 30px;
}
</style>