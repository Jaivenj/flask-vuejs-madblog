<template>
  <div>
    <el-container>
      <el-header class="el-Header">
        <el-row>
          <el-col :span="24">
            <div>
              <h1 style="float:left;color:#72c02c">{{post.title}}</h1>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="1.5" class="grid-content">
            <el-button size="mini" type="warning" plain>编辑</el-button>
          </el-col>
          <el-col :span="1.5" class="grid-content">
            <el-button size="mini" type="danger" plain>删除</el-button>
          </el-col>
          <el-col :span="1.5" class="grid-content">
            <el-button size="mini" type="primary" plain>评论</el-button>
          </el-col>
          <el-col :span="1.5" class="grid-content">
            <div>
              <router-link
                v-bind:to="{ path: `/user/${post.author.id}` }"
                style="color:#777;"
              >{{post.author.username}}</router-link>/
            </div>
          </el-col>
          <el-col :span="1.5" class="grid-content">
            <div
              style="color:#777; vertical-align: middle; "
            >{{ $moment(post.timestamp).format('LLL') }} /</div>
          </el-col>

          <el-col :span="1.5" class="grid-content">
            <div style="color:#777;" class="el-icon-chat-round">
              <font size="2px">1</font>
            </div>
          </el-col>

          <el-col :span="1.5" style="float:right;color:#777;" class="grid-content">
            <div class="el-icon-view">
              <font size="2">无数次阅读，读到不想读</font>
            </div>
          </el-col>
        </el-row>
        <div class="BBorder"></div>
      </el-header>
      <el-main class="el-Main">
        <article>
          <vue-markdown
            :source="post.body"
            :toc="showToc"
            :toc-first-level="1"
            :toc-last-level="3"
            v-on:toc-rendered="tocAllRight"
            toc-id="toc"
            class="markdown-body"
          ></vue-markdown>
        </article>

        <el-row style="padding-top:20px">
          <el-col :span="2">
            <el-button type="success">喜欢</el-button>
          </el-col>

          <el-col :span="2">
            <el-avatar :size="40" v-bind:src="post.author._links.avatar"></el-avatar>
          </el-col>
        </el-row>

        <el-row style="padding-top:20px">
          <el-col :span="2">
            <el-button type="primary">上一篇</el-button>
          </el-col>

          <el-col :span="2" style="float:right">
             <el-button type="primary" >上一篇</el-button>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import store from "../store";
// 导入 vue-markdown 组件解析 markdown 原文为　HTML
import VueMarkdown from "vue-markdown";
export default {
  name: "PostDetail",
  components: {
    VueMarkdown
  },
  data() {
    return {
      sharedState: store.state,
      post: {},
      editForm: {
        title: "",
        summary: "",
        body: "",
        errors: 0, // 表单是否在前端验证通过，0 表示没有错误，验证通过
        titleError: null,
        bodyError: null
      }
    };
  },
  methods: {
    getPost(id) {
      const path = `/posts/${id}`;
      this.$axios
        .get(path)
        .then(response => {
          this.post = response.data;
          console.log("this.post :>> ", this.post);
        })
        .catch(error => {
          // eslint-disable-next-line
          console.error(error);
        });
    }
  },
  created() {
    const post_id = this.$route.params.id;
    this.getPost(post_id);
  }
};
</script>

<style>
.el-col {
  border-radius: 4px;
}
.BBorder {
  height: 1px;
  width: 100%;
  background: #eee;
  margin: 20px auto;
  text-align: center;
}

.el-Header,
.el-footer {
  color: #333;
  text-align: center;
  line-height: 40px;
}

.el-aside {
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-Main {
  color: #333;
  text-align: left;
  padding-top: 100px;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>