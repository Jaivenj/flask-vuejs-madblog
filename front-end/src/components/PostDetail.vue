<template>
  <div>
    <el-container id="PostDetail">
      <el-header>
        <el-row>
          <el-col>
            <div>
              <h1 style="float:left;color:#72c02c">{{post.title}}</h1>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="1.5" class="grid-content" v-if="post.author.id == sharedState.user_id">
            <el-button size="mini" type="warning" plain>编辑</el-button>
          </el-col>
          <el-col :span="1.5" class="grid-content" v-if="post.author.id == sharedState.user_id">
            <el-button size="mini" type="danger" plain>删除</el-button>
          </el-col>
          <el-col :span="1.5" class="grid-content">
            <el-button size="mini" type="primary" plain>评论</el-button>
          </el-col>
          <el-col :span="1.5" class="grid-content">
            <div>
              <router-link v-bind:to="{ path: `/user/${post.author.id}` }" style="color:#777;">{{post.author.username}}
              </router-link>/
            </div>
          </el-col>
          <el-col :span="1.5" class="grid-content">
            <div style="color:#777; vertical-align: middle; ">{{ $moment(post.timestamp).format('LLL') }} /</div>
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

      <el-main style=" padding-top: 100px;">
        <article>
          <vue-markdown :source="post.body" class="markdown-body"></vue-markdown>
        </article>

        <el-row style="padding-top:20px">
          <el-col :span="2">
            <el-button type="success">喜欢</el-button>
          </el-col>

          <el-col :span="2">
            <el-avatar :size="40" v-bind:src="post.author._links.avatar"></el-avatar>
          </el-col>
        </el-row>

        <el-row style="padding-top:60px">
          <el-col :span="3">
            <el-tooltip content="Top center" placement="top" effect="light">
              <el-button type="primary" size="big" plain icon="el-icon-arrow-left">上一篇</el-button>
            </el-tooltip>
          </el-col>

          <el-col :span="3" style="float:right">
            <el-tooltip content="Top center" placement="top" effect="light">
              <el-button type="primary" plain>下一篇 <i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

    <el-container id="profile" class="Container">

      <el-container>
        <el-main>
          <div id="Comments" class="C_BODER">
            <div style="float:left;padding-right:30px">
              <el-avatar shape="circle" :size="80" v-bind:src="post.author._links.avatar"></el-avatar>
            </div>
            <div>
              <h1>Cjaven</h1>
            </div>
            <div>2015年5月18日 22:22</div>
            <div>
              <p style="padding-left:110px">
                <font size="5">评论的挺好</font>
              </p>
            </div>
            <div>
              <el-row style="padding-left:110px">
                <el-col :span="2">赞</el-col>
                <el-col :span="2">赞 </el-col>
              </el-row>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>







    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="float:left">Comments</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div class="text item">
        <quill-editor ref="myQuillEditor" style="height:200px;padding-bottom:50px"></quill-editor>
      </div>
      <div style="float:left;padding:20px">
        <el-button>Cancle</el-button>
        <el-button>Sumbit</el-button>
      </div>
    </el-card>

  </div>

</template>

<script>
  import {
    quillEditor
  } from "vue-quill-editor"; //调用编辑器
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "quill/dist/quill.bubble.css";
  import store from "../store";
  // 导入 vue-markdown 组件解析 markdown 原文为　HTML
  import VueMarkdown from "vue-markdown";
  export default {
    name: "PostDetail",
    components: {
      VueMarkdown,
      quillEditor,
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

  .el-main {
    color: #333;
    text-align: left;

  }

  .el-header,
  .el-footer {
    color: #333;
    text-align: center;
    line-height: 40px;
  }

  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
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
    height: fit-content;
    margin: 0 auto
  }

  .C_BODER {
    border-style: solid;
    border-width: 1px;
    border-color: #eee;
    padding: 20px;
    margin: 10 auto;
  }

</style>
